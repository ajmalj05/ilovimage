import React, { useState, useCallback, useRef, useEffect } from 'react';
import ImageProcessingLayout from '../components/shared/ImageProcessingLayout';

const CropImage: React.FC = () => {
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const processImage = useCallback(async (image: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    canvas.width = cropArea.width;
    canvas.height = cropArea.height;
    
    ctx.drawImage(
      image,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      0, 0, cropArea.width, cropArea.height
    );

    return canvas.toDataURL('image/jpeg', 0.9);
  }, [cropArea]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setStartPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCropArea(prev => ({
      x: Math.min(startPos.x, x),
      y: Math.min(startPos.y, y),
      width: Math.abs(x - startPos.x),
      height: Math.abs(y - startPos.y)
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <ImageProcessingLayout
      title="Crop Image"
      description="Select an area to crop your image"
      onImageProcess={processImage}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">X Position</label>
            <input
              type="number"
              value={cropArea.x}
              onChange={(e) => setCropArea(prev => ({ ...prev, x: parseInt(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Y Position</label>
            <input
              type="number"
              value={cropArea.y}
              onChange={(e) => setCropArea(prev => ({ ...prev, y: parseInt(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Width</label>
            <input
              type="number"
              value={cropArea.width}
              onChange={(e) => setCropArea(prev => ({ ...prev, width: parseInt(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Height</label>
            <input
              type="number"
              value={cropArea.height}
              onChange={(e) => setCropArea(prev => ({ ...prev, height: parseInt(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <div
          className="relative border rounded-lg overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-64 bg-gray-100"
          />
          <div
            className="absolute border-2 border-blue-500 bg-blue-500/20"
            style={{
              left: `${cropArea.x}px`,
              top: `${cropArea.y}px`,
              width: `${cropArea.width}px`,
              height: `${cropArea.height}px`,
            }}
          />
        </div>
      </div>
    </ImageProcessingLayout>
  );
};

export default CropImage;