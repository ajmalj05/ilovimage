import React, { useState, useCallback } from 'react';
import ImageProcessingLayout from '../components/shared/ImageProcessingLayout';

const formats = [
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'image/webp', label: 'WebP' },
  { value: 'image/bmp', label: 'BMP' }
];

const ConvertImage: React.FC = () => {
  const [format, setFormat] = useState('image/jpeg');
  const [quality, setQuality] = useState(0.9);

  const processImage = useCallback(async (image: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    return canvas.toDataURL(format, quality);
  }, [format, quality]);

  return (
    <ImageProcessingLayout
      title="Convert Image Format"
      description="Convert your image to different formats"
      onImageProcess={processImage}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {formats.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quality ({Math.round(quality * 100)}%)
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="mt-1 text-sm text-gray-500">
            Adjust quality to balance between file size and image quality
          </p>
        </div>
      </div>
    </ImageProcessingLayout>
  );
};

export default ConvertImage;