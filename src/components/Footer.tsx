import { Instagram, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        {/* Logo and copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Image
            src="/fglogo.jpg"
            alt="Founders Gang Logo"
            width={32}
            height={32}
            className="rounded"
          />
          <p className="text-sm mt-2 sm:mt-0 font-dream">
            Founders Gang © {new Date().getFullYear()} - All rights reserved
          </p>
        </div>

        {/* Social icons */}
        <div className="flex justify-center sm:justify-end items-center gap-6">
          <a
            href="https://instagram.com/foundersgang"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors"
          >
            <Instagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </a>
          <a
            href="https://youtube.com/@foundersgang"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors"
          >
            <Youtube className="h-5 w-5" />
            <span className="sr-only">YouTube</span>
          </a>
          <a
            href="https://linkedin.com/company/foundersgang"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors"
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
