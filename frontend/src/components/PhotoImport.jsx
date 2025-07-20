import React, { useRef } from 'react';
import { Button } from './ui/button';
import { Camera, Upload, X, Plus } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { mockData } from '../utils/mockData';

const PhotoImport = ({ photos, onPhotosChange }) => {
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // Convert backend format keys to frontend format
          const newPhoto = {
            id: Date.now() + Math.random(),
            url: e.target.result,
            name: file.name,
            type: file.type,
            file: file
          };
          onPhotosChange([...photos, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Reset input
    event.target.value = '';
  };

  const handleCameraCapture = (event) => {
    handleFileUpload(event); // Same logic for camera capture
  };

  const removePhoto = (photoId) => {
    onPhotosChange(photos.filter(p => p.id !== photoId));
  };

  const addSamplePhotos = () => {
    const samplePhotos = mockData.samplePhotos.map(photo => ({
      ...photo,
      id: Date.now() + Math.random()
    }));
    onPhotosChange([...photos, ...samplePhotos]);
    
    toast({
      title: "Sample Photos Added",
      description: "Added sample photos for you to try out the features.",
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Add Photos</h3>
        
        {/* Upload Buttons */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          <Button
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-center justify-center py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Camera className="w-5 h-5 mr-2" />
            Take Photo
          </Button>
          
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center py-6 border-2 border-dashed border-gray-300 hover:border-purple-400 text-gray-600 hover:text-purple-600"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Photos
          </Button>
          
          {photos.length === 0 && (
            <Button
              variant="ghost"
              onClick={addSamplePhotos}
              className="text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Try with Sample Photos
            </Button>
          )}
        </div>
        
        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleCameraCapture}
          className="hidden"
        />
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Selected Photos ({photos.length})
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removePhoto(photo.id)}
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs text-white bg-black/50 px-2 py-1 rounded truncate">
                    {photo.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoImport;