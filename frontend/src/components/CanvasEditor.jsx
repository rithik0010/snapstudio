import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { mockData } from '../utils/mockData';

const CanvasEditor = forwardRef(({ project, className }, ref) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => canvasRef.current);

  const getLayoutConfig = (layoutId) => {
    return mockData.layouts.find(l => l.id === layoutId) || mockData.layouts[0];
  };

  const getFilterCSS = (filterId) => {
    if (!filterId) return 'none';
    
    for (const category of Object.values(mockData.filters)) {
      const filter = category.find(f => f.id === filterId);
      if (filter) return filter.css;
    }
    return 'none';
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!canvas || !ctx) return;

    const layout = getLayoutConfig(project.layout);
    const { photos, customization } = project;
    
    // Set canvas dimensions for high resolution
    const scale = 2; // For high DPI
    const width = layout.dimensions.width;
    const height = layout.dimensions.height;
    
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    ctx.scale(scale, scale);
    
    // Clear canvas
    ctx.fillStyle = customization.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    if (photos.length === 0) {
      // Draw placeholder
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(20, 20, width - 40, height - 40);
      
      ctx.fillStyle = '#9ca3af';
      ctx.font = '16px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Add photos to start creating', width / 2, height / 2 - 10);
      ctx.fillText('Use the tools panel on the left', width / 2, height / 2 + 10);
      return;
    }

    // Calculate photo positions based on layout
    const spacing = customization.spacing || 10;
    const borderWidth = 2;
    
    let photoPositions = [];
    
    if (layout.type === 'strip') {
      const photoHeight = (height - (spacing * (layout.slots + 1))) / layout.slots;
      const photoWidth = width - (spacing * 2);
      
      for (let i = 0; i < layout.slots; i++) {
        photoPositions.push({
          x: spacing,
          y: spacing + i * (photoHeight + spacing),
          width: photoWidth,
          height: photoHeight
        });
      }
    } else if (layout.type === 'grid') {
      const cols = layout.id === 'grid-2x2' ? 2 : 3;
      const rows = Math.ceil(layout.slots / cols);
      
      const photoWidth = (width - (spacing * (cols + 1))) / cols;
      const photoHeight = (height - (spacing * (rows + 1))) / rows;
      
      for (let i = 0; i < layout.slots; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        
        photoPositions.push({
          x: spacing + col * (photoWidth + spacing),
          y: spacing + row * (photoHeight + spacing),
          width: photoWidth,
          height: photoHeight
        });
      }
    } else if (layout.type === 'single') {
      photoPositions.push({
        x: spacing,
        y: spacing,
        width: width - (spacing * 2),
        height: height - (spacing * 2) - (customization.text ? 30 : 0)
      });
    }

    // Draw photos
    const loadedImages = [];
    let loadedCount = 0;
    
    const drawPhotos = () => {
      photoPositions.forEach((pos, index) => {
        if (index < photos.length && loadedImages[index]) {
          const img = loadedImages[index];
          
          // Draw border
          ctx.fillStyle = customization.borderColor || '#ffffff';
          ctx.fillRect(pos.x - borderWidth, pos.y - borderWidth, 
                      pos.width + borderWidth * 2, pos.height + borderWidth * 2);
          
          // Save context for filter application
          ctx.save();
          
          // Apply filter effect (simplified for canvas)
          if (project.filter) {
            const filterCSS = getFilterCSS(project.filter);
            // Note: Canvas doesn't support CSS filters directly
            // This is a simplified representation
            if (filterCSS.includes('sepia')) {
              ctx.filter = 'sepia(1)';
            } else if (filterCSS.includes('grayscale')) {
              ctx.filter = 'grayscale(0.8)';
            } else if (filterCSS.includes('contrast')) {
              ctx.filter = 'contrast(1.2)';
            }
          }
          
          // Draw image
          ctx.drawImage(img, pos.x, pos.y, pos.width, pos.height);
          
          ctx.restore();
        } else if (index < layout.slots) {
          // Draw placeholder
          ctx.fillStyle = '#f3f4f6';
          ctx.fillRect(pos.x, pos.y, pos.width, pos.height);
          
          ctx.fillStyle = '#d1d5db';
          ctx.font = '14px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Photo ${index + 1}`, pos.x + pos.width / 2, pos.y + pos.height / 2);
        }
      });
      
      // Draw custom text
      if (customization.text) {
        ctx.fillStyle = customization.textColor || '#000000';
        ctx.font = `${customization.textSize || 16}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = 'center';
        
        let textY;
        switch (customization.textPosition) {
          case 'top':
            textY = 30;
            break;
          case 'center':
            textY = height / 2;
            break;
          case 'bottom':
          default:
            textY = height - 20;
            break;
        }
        
        ctx.fillText(customization.text, width / 2, textY);
      }
    };

    // Load images
    photos.slice(0, layout.slots).forEach((photo, index) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        loadedImages[index] = img;
        loadedCount++;
        if (loadedCount === Math.min(photos.length, layout.slots)) {
          drawPhotos();
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === Math.min(photos.length, layout.slots)) {
          drawPhotos();
        }
      };
      img.src = photo.url;
    });

    // If no photos, draw immediately
    if (photos.length === 0) {
      drawPhotos();
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [project]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        const layout = getLayoutConfig(project.layout);
        
        const containerWidth = container.clientWidth - 40;
        const containerHeight = container.clientHeight - 40;
        
        const scaleX = containerWidth / layout.dimensions.width;
        const scaleY = containerHeight / layout.dimensions.height;
        const scale = Math.min(scaleX, scaleY, 1);
        
        canvas.style.transform = `scale(${scale})`;
        canvas.style.transformOrigin = 'top left';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [project.layout]);

  return (
    <div 
      ref={containerRef}
      className={`flex items-center justify-center p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg ${className}`}
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="shadow-2xl rounded-lg bg-white"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
        <div className="absolute -bottom-6 left-0 right-0 text-center">
          <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
            {getLayoutConfig(project.layout).name} • {project.photos.length}/{getLayoutConfig(project.layout).slots} photos
          </span>
        </div>
      </div>
    </div>
  );
});

CanvasEditor.displayName = 'CanvasEditor';

export default CanvasEditor;