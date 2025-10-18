import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import { AddressProvider } from '@/context/address-context';
import { CategoryProvider } from '@/context/category-context';

export default function WithHeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <main>
    <Header />
    <CategoryProvider>
      <AddressProvider>
        {children}
      </AddressProvider>
      </CategoryProvider>
    <Footer />
   </main>
  );
}
