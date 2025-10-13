'use client';
import { HEADER_MENU, HEADER_MENU_OWNER } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '../ui/menubar';
import Image from 'next/image';
import { signoutUser } from '@/lib/action/user.action';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function Header() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const route = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    const result = await signoutUser();

    if (result.success) {
      toast.success(result.message);
      route.push('/');
    } else {
      toast.error(result.message);
    }
  };

  const useUserInitials = useMemo(() => {
    const name = session?.user.name;

    if (!name) return '';
    const parts = name.split(' ');
    const firstInitial = parts[0]?.charAt(0) || '';
    const secondInitial = parts[1]?.charAt(0) || '';
    return `${firstInitial}${secondInitial}`;
  }, [session?.user.name])

  return (
    <div
      className={`flex items-center bg-white justify-between px-[16px] lg:px-[112px] py-[16px] sticky top-0 z-20 transition-all duration-300 ${
        isScrolled ? 'shadow-md ' : 'shadow-md'
      }`}
    >
      <div className="font-semibold text-lg">CaféTales</div>
      <div className="flex space-x-4 items-center">
        <div className="flex space-x-3 p-4">
          {(session?.user?.role === "owner"? HEADER_MENU_OWNER : HEADER_MENU).map(({ id, label, link }) => (
            <Link
              className="cursor-pointer hover:text-primary-500 transition-all duration-500 ease-in-out font-bold"
              key={id}
              href={link}
            >
              {label}
            </Link>
          ))}
        </div>
        <div>
          {session?.user ? (
            <Menubar className="border-none bg-transparent">
              <MenubarMenu>
                <MenubarTrigger className="p-0 focus:outline-none data-[state=open]:bg-transparent">
                  <div className="size-[50px] rounded-full cursor-pointer bg-primary-50 flex items-center justify-center">
                    {session.user.image?.length ? (
                      <Image
                        height={100}
                        width={100}
                        src={session.user.image}
                        alt={session.user.name || ''}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <p className="text-white text-[20px] font-bold">
                        {useUserInitials}
                      </p>
                    )}
                  </div>
                </MenubarTrigger>
                <MenubarContent className="mt-2 w-[180px] rounded-md shadow-md">
                  <MenubarItem asChild>
                    <Link href="/profile">Profile</Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    {/* <Link href="/settings">Settings</Link> */}
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem
                    onClick={() => handleSignOut()}
                    className="text-red-500 focus:text-red-600"
                  >
                    Sign Out
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          ) : (
            <Link href="/sign-in">Login</Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
