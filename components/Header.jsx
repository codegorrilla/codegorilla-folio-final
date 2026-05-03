// components/Header.jsx
import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full absolute z-20 flex justify-end items-center ml-auto p-10 font-main font-black text-white text-[2.5rem] tracking-tighter">
      <Link href="/">code.gorrilla</Link>
    </header>
  );
};

export default Header;
