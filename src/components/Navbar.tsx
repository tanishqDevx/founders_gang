import React from "react";
import Link from "next/link";
import Image from "next/image";
import localfont from "next/font/local";

const getdreamavenue = localfont({
  src: "../fonts/Dream_Avenue.ttf",
});
const times = localfont({
  src: "../fonts/times.ttf",
});

const Navbar = () => {
  return (
    <>
      <nav className="bg-white border-b border-gray-200 fixed w-full z-20 top-0 start-0">
        <div className="flex justify-between items-center h-16 max-w-screen-xl mx-auto px-4">
          {/* Logo + Name */}
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Image
                src="/FGG.jpg"
                alt="Founders Gang Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            </Link>
            <Link href="/">
              <span
                className={`${getdreamavenue.className} text-black font-extrabold text-lg`}
              >
                Founders Gang
              </span>
            </Link>
          </div>
          <nav
            className={`${times.className} hidden md:flex items-center space-x-8`}
          >
            <Link
              className="text-gray-600 hover:text-gray-900 transition-colors"
              href="/"
            >
              Home
            </Link>
            <Link
              className="text-gray-600 hover:text-gray-900 transition-colors"
              href="/videos"
            >
              Videos
            </Link>
            <Link
              className="text-gray-600 hover:text-gray-900 transition-colors"
              href="/tools"
            >
              Tools
            </Link>
            <a
              className="text-gray-600 hover:text-gray-900 transition-colors"
              href="https://startup.foundersgang.com/companies"
            >
              Startups
            </a>
            <a
              className="text-gray-600 hover:text-gray-900 transition-colors"
              href="https://startup.foundersgang.com/founders"
            >
              Founders
            </a>
          </nav>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu"
              >
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth">
              <button
                className={`${times.className} inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white`}
              >
                Get started
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
