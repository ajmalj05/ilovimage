import React, { useState, useCallback } from 'react';
import ImageProcessingLayout from '../components/shared/ImageProcessingLayout';

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sepia: boolean;
  grayscale: boolean;
}

const PhotoEditor: React.FC = () => {
  const [settings, setSettings] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    sepia: false,
    grayscale: false
  });

  const processImage = useCallback(async (image: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    canvas.width = image.width;
    canvas.height = image.height;

    // Apply filters
    ctx.filter = [
      `brightness(${settings.brightness}%)`,
      `contrast(${settings.contrast}%)`,
      `saturate(${settings.saturation}%)`,
      `blur(${settings.blur}px)`,
      settings.sepia ? 'sepia(1)' : '',
      settings.grayscale ? 'grayscale(1)' : ''
    ].filter(Boolean).join(' ');

    ctx.drawImage(image, 0, 0);
    ctx.filter = 'none';

    return canvas.toDataURL('image/jpeg', 0.9);
  }, [settings]);

  return (
    <ImageProcessingLayout
      title="Photo Editor"
      description="Enhance your photos with professional editing tools"
      onImageProcess={processImage}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brightness ({settings.brightness}%)
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={settings.brightness}
            onChange={(e) => setSettings(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contrast ({settings.contrast}%)
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={settings.contrast}
            onChange={(e) => setSettings(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Saturation ({settings.saturation}%)
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={settings.saturation}
            onChange={(e) => setSettings(prev => ({ ...prev, saturation: parseInt(e.target.value) }))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blur ({settings.blur}px)
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={settings.blur}
            onChange={(e) => setSettings(prev => ({ ...prev, blur: parseInt(e.target.value) }))}
            className="w-full"
          />
        </div>

        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={settings.sepia}
              onChange={(e) => setSettings(prev => ({ ...prev, sepia: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-600">Sepia</span>
          </label>

          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={settings.grayscale}
              onChange={(e) => setSettings(prev => ({ ...prev, grayscale: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-600">Grayscale</span>
          </label>
        </div>
      </div>
    </ImageProcessingLayout>
  );
};

export default PhotoEditor;