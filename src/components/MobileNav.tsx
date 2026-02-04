'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-400 hover:text-white"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-900 border-b border-gray-800 md:hidden">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              href="/dashboard" 
              className="text-gray-400 hover:text-white transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/docs" 
              className="text-gray-400 hover:text-white transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Docs
            </Link>
            <a 
              href="/skill.md" 
              className="text-gray-400 hover:text-white transition py-2"
              onClick={() => setIsOpen(false)}
            >
              For Agents
            </a>
            <Link 
              href="/api/register" 
              className="bg-emerald-600 hover:bg-emerald-500 px-4 py-3 rounded-lg font-medium transition text-center"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
