import React, { useState, useCallback } from 'react';
import ImageProcessingLayout from '../components/shared/ImageProcessingLayout';

const CompressImage: React.FC = () => {
  const [quality, setQuality] = useState(0.8);

  const processImage = useCallback(async (image: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    return canvas.toDataURL('image/jpeg', quality);
  }, [quality]);

  return (
    <ImageProcessingLayout
      title="Compress Image"
      description="Reduce file size while maintaining quality"
      onImageProcess={processImage}
    >
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
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
        <p className="text-sm text-gray-500">
          Lower quality = smaller file size. Adjust the slider to find the best balance.
        </p>
      </div>
    </ImageProcessingLayout>
  );
};

export default CompressImage;