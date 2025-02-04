import React from 'react';
import { Heart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-6 shadow-lg">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-4xl font-bold tracking-tight">I LOVE IMAGE</h1>
          <Heart className="w-8 h-8 text-red-400 animate-pulse" fill="#FCA5A5" />
        </div>
        <p className="text-center mt-2 text-blue-100">Transform your images with powerful tools</p>
      </div>
    </header>
  );
};

export default Header;