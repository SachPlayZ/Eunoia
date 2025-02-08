"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function Navbar() {
  const handleScroll = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/[0.02] border-b border-white/[0.05] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent hover:from-blue-100 hover:to-purple-100 transition-all duration-300"
            >
              Eunoia
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {["features", "testimonials"].map((item) => (
              <button
                key={item}
                onClick={() => handleScroll(item)}
                className="text-blue-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 relative group"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </button>
            ))}
            {/* Subscriptions as a normal route */}
            <Link
              href="/subscriptions"
              className="text-blue-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 relative group"
            >
              Subscriptions
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <ConnectButton chainStatus="none" showBalance={false} />
          </div>
        </div>
      </div>
    </nav>
  );
}
