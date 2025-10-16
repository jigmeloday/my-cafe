import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import { CategoryProvider } from '@/context/category-context';

export default function WithHeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <main>
    <Header />
    <CategoryProvider>{children}</CategoryProvider>
    <Footer />
   </main>
  );
}
