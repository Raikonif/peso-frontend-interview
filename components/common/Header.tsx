"use client";

import Link from "next/link";
import { Button } from "../ui/Button";

interface HeaderProps {
  onCreateClick?: () => void;
  showCreateButton?: boolean;
}

export function Header({
  onCreateClick,
  showCreateButton = true,
}: HeaderProps) {
  return (
    <header className="bg-[#1a1a24] border-b border-[#2a2a3a] sticky top-0 z-40 backdrop-blur-xl bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <svg
              className="w-8 h-8 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="text-xl font-bold gradient-text">FakeStore</span>
          </Link>

          {/* Create button */}
          {showCreateButton && onCreateClick && (
            <Button variant="primary" onClick={onCreateClick}>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nuevo Producto
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
