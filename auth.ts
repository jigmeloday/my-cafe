import NextAuth, { AuthOptions, User } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/signin',
    signOut: '/signout',
    error: '/signin',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user',
  },
  session: {
    strategy: 'jwt', // TypeScript will now accept this
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
          include: { role: true },
        });

        if (user && user.password) {
          const isMatch = compareSync(credentials.password, user.password);
          if(isMatch && !user.emailVerified) {
            throw new Error('Email not verify')
          }
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email!,
              role: user.role?.name,
              image: user.image,
             cafeCreation: user.cafeCreation
            } as unknown as User;;
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
   async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = user.role;
      token.image = user.image;
      token.cafeCreation = user.cafeCreation
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.image = token.image;
      session.user.cafeCreation = token.cafeCreation;
    }
    return session;
  },
  },
};

// export handler for API route
export default NextAuth(authOptions);
