"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
}: Readonly<HeaderProps>) {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  return (
    <div className="flex items-center justify-between gap-lg mb-xl sticky top-0 bg-background z-10 py-lg w-full p-2 rounded-b-2xl shadow-md shadow-primary">
      <h1 className="hidden sm:block text-2xl sm:text-3xl font-bold text-foreground">
        Dashboard
      </h1>
      <div className="flex items-center gap-4 sm:gap-8 flex-1 sm:flex-none">
        <nav className="flex gap-4 sm:gap-8">
          <Link
            href="/"
            className={`pb-2 text-sm sm:text-base transition-colors ${
              isActive("/")
                ? "text-primary border-b-2 border-primary"
                : "text-surface-muted hover:text-foreground"
            }`}
          >
            Feed
          </Link>
          <Link
            href="/admin"
            className={`pb-2 text-sm sm:text-base transition-colors ${
              isActive("/admin")
                ? "text-primary border-b-2 border-primary"
                : "text-surface-muted hover:text-foreground"
            }`}
          >
            Edit
          </Link>
        </nav>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-surface text-foreground pl-xl pr-md py-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
          />
        </div>
      </div>
    </div>
  );
}
