"use client";

import { Search } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <nav className="flex gap-4 sm:gap-8">
          <a
            href="#"
            className="text-primary border-b-2 border-primary pb-2 text-sm sm:text-base"
          >
            Feed
          </a>
          <a href="#" className="text-zinc-400 hover:text-white pb-2 text-sm sm:text-base">
            Edit
          </a>
        </nav>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-64 bg-zinc-900 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
        />
      </div>
    </div>
  );
}
