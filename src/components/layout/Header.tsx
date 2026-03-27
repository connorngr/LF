"use client";

import { Search } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
}: Readonly<HeaderProps>) {
  return (
    <div className="flex items-center justify-between gap-lg mb-xl sticky top-0 bg-background z-10 py-lg w-full">
      <h1 className="hidden sm:block text-2xl sm:text-3xl font-bold text-foreground">
        Dashboard
      </h1>
      <div className="flex items-center gap-4 sm:gap-8 flex-1 sm:flex-none">
        <nav className="flex gap-4 sm:gap-8">
          {/* TODO: Build navigation for admin */}
          <a
            href="#"
            className="text-primary border-b-2 border-primary pb-2 text-sm sm:text-base"
          >
            Feed
          </a>
          <a
            href="#"
            className="text-surface-muted hover:text-foreground pb-2 text-sm sm:text-base"
          >
            Edit
          </a>
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
