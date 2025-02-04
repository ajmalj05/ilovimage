import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Image as ImageIcon, Download, Rotate3D as Rotate, FlipHorizontal, FlipVertical, Settings, Sliders, FileOutput, FileDown, Eye } from 'lucide-react';

interface ProcessedImage {
  url: string;
  name: string;
  type: string;
  size: number;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] ?? '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

const ImageProcessor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLivePreview, setIsLivePreview] = useState(true);
  const [settings, setSettings] = useState({
    format: 'image/jpeg',
    quality: 0.9,
    width: 0,
    height: 0,
    grayscale: false,
    sepia: false,
    blur: 0,
    brightness: 100,
    rotation: 0,
    flipH: false,
    flipV: false,
    maintainAspectRatio: true,
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processingTimeoutRef = useRef<number>();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const updateDimension = useCallback((dimension: 'width' | 'height', value: number) => {
    if (settings.maintainAspectRatio && originalImage) {
      const aspectRatio = originalImage.width / originalImage.height;
      setSettings(prev => ({
        ...prev,
        [dimension]: value,
        [dimension === 'width' ? 'height' : 'width']: 
          dimension === 'width' 
            ? Math.round(value / aspectRatio)
            : Math.round(value * aspectRatio)
      }));
    } else {
      setSettings(prev => ({ ...prev, [dimension]: value }));
    }
  }, [settings.maintainAspectRatio, originalImage]);

  const processImage = useCallback(() => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const width = settings.width || originalImage.width;
    const height = settings.height || originalImage.height;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Apply transformations
    ctx.save();
    
    // Handle rotation and flips
    ctx.translate(width/2, height/2);
    ctx.rotate((settings.rotation * Math.PI) / 180);
    ctx.scale(settings.flipH ? -1 : 1, settings.flipV ? -1 : 1);
    ctx.translate(-width/2, -height/2);

    // Draw image
    ctx.drawImage(originalImage, 0, 0, width, height);
    ctx.restore();

    // Apply filters
    if (settings.grayscale || settings.sepia || settings.blur > 0 || settings.brightness !== 100) {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        if (settings.grayscale) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }

        if (settings.sepia) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }

        if (settings.brightness !== 100) {
          const factor = settings.brightness / 100;
          data[i] *= factor;
          data[i + 1] *= factor;
          data[i + 2] *= factor;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    }

    if (settings.blur > 0) {
      ctx.filter = `blur(${settings.blur}px)`;
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';
    }

    // Convert to desired format
    const processedUrl = canvas.toDataURL(settings.format, settings.quality);
    const processedBlob = dataURLtoBlob(processedUrl);
    
    setProcessedImage({
      url: processedUrl,
      name: `processed_${originalImage.src.split('/').pop()}`,
      type: settings.format,
      size: processedBlob.size
    });
  }, [originalImage, settings]);

  // Live preview effect
  useEffect(() => {
    if (isLivePreview && originalImage) {
      window.clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = window.setTimeout(() => {
        processImage();
      }, 300);
    }
    return () => {
      window.clearTimeout(processingTimeoutRef.current);
    };
  }, [isLivePreview, originalImage, settings, processImage]);

  const handleImageLoad = useCallback((file: File) => {
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setSettings(prev => ({
          ...prev,
          width: img.width,
          height: img.height
        }));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageLoad(file);
    }
  }, [handleImageLoad]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageLoad(file);
    }
  }, [handleImageLoad]);

  const handleDownload = useCallback(() => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage.url;
      link.download = processedImage.name;
      link.click();
    }
  }, [processedImage]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-8 h-8" />
            Image Processor
          </h1>
          <div className="flex items-center gap-2">
            <Eye className={`w-5 h-5 ${isLivePreview ? 'text-blue-500' : 'text-gray-400'}`} />
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isLivePreview}
                onChange={(e) => setIsLivePreview(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">Live Preview</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px] transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {originalImage ? (
              <div className="space-y-4 w-full">
                <img
                  src={originalImage.src}
                  alt="Original"
                  className="max-w-full max-h-[400px] object-contain mx-auto"
                />
                <div className="text-center text-sm text-gray-600">
                  Original Size: {formatBytes(originalSize)}
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Drag and drop an image here, or</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInput}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Select File
                </button>
              </>
            )}
          </div>

          {/* Settings Section */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Image Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Format</label>
                <select
                  value={settings.format}
                  onChange={(e) => setSettings(prev => ({ ...prev, format: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                  <option value="image/bmp">BMP</option>
                  <option value="image/gif">GIF</option>
                  <option value="image/tiff">TIFF</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Quality ({Math.round(settings.quality * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={settings.quality}
                  onChange={(e) => setSettings(prev => ({ ...prev, quality: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Lower quality = smaller file size</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Dimensions</label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.maintainAspectRatio}
                      onChange={(e) => setSettings(prev => ({ ...prev, maintainAspectRatio: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-600">Maintain aspect ratio</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Width</label>
                    <input
                      type="number"
                      value={settings.width}
                      onChange={(e) => updateDimension('width', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Height</label>
                    <input
                      type="number"
                      value={settings.height}
                      onChange={(e) => updateDimension('height', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Filters</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, grayscale: !prev.grayscale }))}
                    className={`px-3 py-1 rounded ${settings.grayscale ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  >
                    Grayscale
                  </button>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, sepia: !prev.sepia }))}
                    className={`px-3 py-1 rounded ${settings.sepia ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  >
                    Sepia
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Blur</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={settings.blur}
                  onChange={(e) => setSettings(prev => ({ ...prev, blur: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Brightness</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={settings.brightness}
                  onChange={(e) => setSettings(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Transform</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))}
                    className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    <Rotate className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, flipH: !prev.flipH }))}
                    className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    <FlipHorizontal className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, flipV: !prev.flipV }))}
                    className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    <FlipVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={processImage}
                  disabled={!originalImage}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sliders className="w-5 h-5" />
                  Process Image
                </button>
              </div>

              {processedImage && (
                <div className="pt-4">
                  <button
                    onClick={handleDownload}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download ({formatBytes(processedImage.size)})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {processedImage && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileOutput className="w-5 h-5" />
              Processed Image
            </h2>
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <img
                src={processedImage.url}
                alt="Processed"
                className="max-w-full max-h-[400px] object-contain mx-auto"
              />
              <div className="text-center mt-4 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <FileDown className="w-4 h-4" />
                  Size: {formatBytes(processedImage.size)}
                  {originalSize > 0 && (
                    <span className="text-green-600">
                      ({Math.round((processedImage.size / originalSize) * 100)}% of original)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default ImageProcessor;