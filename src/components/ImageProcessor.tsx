import React from 'react';
import { Image as ImageIcon, Crop, FileOutput, Edit, ArrowUpDown, Stamp, Smile, RotateCw, Code, Bluetooth as Blur } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Compress Image',
    description: 'Reduce file size while maintaining quality. Support for JPG, PNG, SVG, and GIF formats.',
    icon: <ImageIcon className="w-8 h-8" />,
    path: '/compress'
  },
  {
    title: 'Resize Image',
    description: 'Define custom dimensions by percent or pixels. Supports all major image formats.',
    icon: <ArrowUpDown className="w-8 h-8" />,
    path: '/resize'
  },
  {
    title: 'Crop Image',
    description: 'Choose pixels to define your rectangle or use our visual editor.',
    icon: <Crop className="w-8 h-8" />,
    path: '/crop'
  },
  {
    title: 'Convert Format',
    description: 'Convert between JPG, PNG, WebP, SVG, and other formats with ease.',
    icon: <FileOutput className="w-8 h-8" />,
    path: '/convert'
  },
  {
    title: 'Photo Editor',
    description: 'Enhance your images with filters, effects, frames, and stickers.',
    icon: <Edit className="w-8 h-8" />,
    path: '/editor'
  },
  {
    title: 'Remove Background',
    description: 'Quickly remove image backgrounds with high accuracy.',
    icon: <ImageIcon className="w-8 h-8" />,
    path: '/background'
  },
  {
    title: 'Watermark Image',
    description: 'Add text or image watermarks with custom position and transparency.',
    icon: <Stamp className="w-8 h-8" />,
    path: '/watermark'
  },
  {
    title: 'Meme Generator',
    description: 'Create custom memes with text captions and various templates.',
    icon: <Smile className="w-8 h-8" />,
    path: '/meme'
  },
  {
    title: 'Rotate & Flip',
    description: 'Rotate or flip multiple images at once. Supports all formats.',
    icon: <RotateCw className="w-8 h-8" />,
    path: '/rotate'
  },
  {
    title: 'HTML to Image',
    description: 'Convert webpages to images. Capture any web content as JPG or PNG.',
    icon: <Code className="w-8 h-8" />,
    path: '/html2image'
  },
  {
    title: 'Blur Face',
    description: 'Easily blur faces and sensitive information in photos.',
    icon: <Blur className="w-8 h-8" />,
    path: '/blur'
  }
];

const ImageProcessor: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Image Processing Tools</h2>
        <p className="text-xl text-gray-600">Professional image tools for all your needs</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
          >
            <div className="p-8">
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors duration-300">
                <div className="text-blue-600">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {feature.description}
              </p>
              <Link
                to={feature.path}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 w-full"
              >
                Try Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageProcessor;