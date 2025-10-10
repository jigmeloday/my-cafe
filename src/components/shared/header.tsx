'use client';
import { HEADER_MENU } from '@/lib/constant';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function Header() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`flex items-center justify-between px-[16px] lg:px-[112px] py-[32px] sticky top-0 z-20 transition-all duration-300 ${
        isScrolled ? 'shadow-md bg-white' : 'shadow-md'
      }`}
    >
      <div className="font-semibold text-lg">CaféTales</div>
      <div className="flex space-x-4 items-center">
        <div className="flex space-x-3 p-4">
          {HEADER_MENU.map(({ id, label, link }) => (
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
            <div className="size-[50px] rounded-full cursor-pointer bg-primary-300 flex items-center justify-center">
              {
                session.user.image?.length? <></> : <p className='text-white text-[20px] font-bold'>
                  {`${session.user.name?.split(' ')[0].charAt(0)}${session.user.name?.split(' ')[1].charAt(0)}` }
                </p>
              }
            </div>
          ) : (
            <Link href="/sign-in">Login</Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
