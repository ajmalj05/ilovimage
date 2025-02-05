import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ImageProcessor from './components/ImageProcessor';
import CompressImage from './pages/CompressImage';
import ResizeImage from './pages/ResizeImage';
import CropImage from './pages/CropImage';
import ConvertImage from './pages/ConvertImage';
import PhotoEditor from './pages/PhotoEditor';
import WatermarkImage from './pages/WatermarkImage';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <main className="flex-grow pt-24">
          <Routes>
            <Route path="/" element={<ImageProcessor />} />
            <Route path="/compress" element={<CompressImage />} />
            <Route path="/resize" element={<ResizeImage />} />
            <Route path="/crop" element={<CropImage />} />
            <Route path="/convert" element={<ConvertImage />} />
            <Route path="/editor" element={<PhotoEditor />} />
            <Route path="/watermark" element={<WatermarkImage />} />
            <Route path="/background" element={<div className="pt-24 text-center">Background Removal Tool Coming Soon</div>} />
            <Route path="/meme" element={<div className="pt-24 text-center">Meme Generator Coming Soon</div>} />
            <Route path="/rotate" element={<div className="pt-24 text-center">Rotate Tool Coming Soon</div>} />
            <Route path="/html2image" element={<div className="pt-24 text-center">HTML to Image Tool Coming Soon</div>} />
            <Route path="/blur" element={<div className="pt-24 text-center">Blur Tool Coming Soon</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;