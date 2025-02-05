import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download } from 'lucide-react';

interface ImageProcessingLayoutProps {
  title: string;
  description: string;
  onImageProcess: (image: HTMLImageElement) => Promise<string>;
  children: React.ReactNode;
}

const ImageProcessingLayout: React.FC<ImageProcessingLayoutProps> = ({
  title,
  description,
  onImageProcess,
  children
}) => {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageLoad = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
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

  const handleProcess = async () => {
    if (!originalImage) return;
    
    setIsProcessing(true);
    try {
      const processedUrl = await onImageProcess(originalImage);
      setProcessedImageUrl(processedUrl);
    } catch (error) {
      console.error('Processing failed:', error);
    }
    setIsProcessing(false);
  };

  const handleDownload = useCallback(() => {
    if (processedImageUrl) {
      const link = document.createElement('a');
      link.href = processedImageUrl;
      link.download = 'processed-image.jpg';
      link.click();
    }
  }, [processedImageUrl]);

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-xl text-gray-600">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px] transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
        >
          {originalImage ? (
            <div className="space-y-4 w-full">
              <img
                src={originalImage.src}
                alt="Original"
                className="max-w-full max-h-[400px] object-contain mx-auto"
              />
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Process Image'}
              </button>
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

        {/* Settings and Preview Section */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          {children}
          
          {processedImageUrl && (
            <div className="mt-6 space-y-4">
              <img
                src={processedImageUrl}
                alt="Processed"
                className="max-w-full max-h-[400px] object-contain mx-auto"
              />
              <button
                onClick={handleDownload}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageProcessingLayout;