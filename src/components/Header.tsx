import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 fixed w-full top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-8">
        <Link to="/" className="flex items-center justify-center gap-3 hover:opacity-90 transition-opacity">
          <h1 className="text-3xl font-bold tracking-tight">I LOVE IMAGE</h1>
          <Heart className="w-7 h-7 text-red-400 animate-pulse" fill="#FCA5A5" />
        </Link>
        <p className="text-center mt-1 text-blue-100">Transform your images with powerful tools</p>
      </div>
    </header>
  );
};

export default Header;