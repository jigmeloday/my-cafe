"use client";
import { useEffect, useState } from "react";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`flex justify-between px-[16px] lg:px-[112px] py-[32px] sticky top-0 z-20 transition-all duration-300 ${
        isScrolled ? "shadow-md bg-white" : "shadow-md"
      }`}
    >
      <div className="font-semibold text-lg">CaféTales</div>
      <div>Menu</div>
    </div>
  );
}

export default Header;
