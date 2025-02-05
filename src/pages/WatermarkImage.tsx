import React, { useState, useCallback } from 'react';
import ImageProcessingLayout from '../components/shared/ImageProcessingLayout';

const WatermarkImage: React.FC = () => {
  const [text, setText] = useState('Watermark');
  const [position, setPosition] = useState('bottom-right');
  const [opacity, setOpacity] = useState(0.5);
  const [fontSize, setFontSize] = useState(24);

  const processImage = useCallback(async (image: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    canvas.width = image.width;
    canvas.height = image.height;

    // Draw original image
    ctx.drawImage(image, 0, 0);

    // Configure watermark text
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    
    const metrics = ctx.measureText(text);
    const padding = 20;
    let x = 0;
    let y = 0;

    // Calculate position
    switch (position) {
      case 'top-left':
        x = padding;
        y = fontSize + padding;
        break;
      case 'top-right':
        x = canvas.width - metrics.width - padding;
        y = fontSize + padding;
        break;
      case 'bottom-left':
        x = padding;
        y = canvas.height - padding;
        break;
      case 'bottom-right':
        x = canvas.width - metrics.width - padding;
        y = canvas.height - padding;
        break;
      case 'center':
        x = (canvas.width - metrics.width) / 2;
        y = canvas.height / 2;
        break;
    }

    // Draw watermark
    ctx.fillText(text, x, y);

    return canvas.toDataURL('image/jpeg', 0.9);
  }, [text, position, opacity, fontSize]);

  return (
    <ImageProcessingLayout
      title="Add Watermark"
      description="Protect your images with custom watermarks"
      onImageProcess={processImage}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Watermark Text
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Position
          </label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="top-left">Top Left</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="center">Center</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opacity ({Math.round(opacity * 100)}%)
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Size ({fontSize}px)
          </label>
          <input
            type="range"
            min="12"
            max="72"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </ImageProcessingLayout>
  );
};

export default WatermarkImage;