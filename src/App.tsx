import React from 'react';
import Header from './components/Header';
import ImageProcessor from './components/ImageProcessor';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow">
        <ImageProcessor />
      </main>
      <Footer />
    </div>
  );
}

export default App;