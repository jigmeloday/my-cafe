import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';

export default function WithHeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <main>
    <Header />
    {children}
    <Footer />
   </main>
  );
}
