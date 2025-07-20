// Mock data for SnapStyle Studio

export const mockData = {
  // Sample photos for demonstration
  samplePhotos: [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1494790108755-2616c525ecb9?w=400&h=400&fit=crop&crop=face',
      name: 'Portrait 1',
      type: 'image/jpeg'
    },
    {
      id: '2', 
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      name: 'Portrait 2',
      type: 'image/jpeg'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      name: 'Portrait 3',
      type: 'image/jpeg'
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      name: 'Portrait 4',
      type: 'image/jpeg'
    }
  ],

  // Filter presets
  filters: {
    vintage: [
      { id: 'vintage-1', name: 'Classic Film', css: 'sepia(0.8) contrast(1.2) brightness(1.1)' },
      { id: 'vintage-2', name: 'Faded Memories', css: 'sepia(0.5) contrast(0.9) brightness(1.2) saturate(0.8)' },
      { id: 'vintage-3', name: 'Old Photo', css: 'sepia(1) contrast(1.1) brightness(1.05)' },
    ],
    cinematic: [
      { id: 'cinematic-1', name: 'Orange & Teal', css: 'contrast(1.1) brightness(1.05) hue-rotate(15deg)' },
      { id: 'cinematic-2', name: 'Film Noir', css: 'grayscale(0.8) contrast(1.5) brightness(0.9)' },
      { id: 'cinematic-3', name: 'Blockbuster', css: 'contrast(1.2) saturate(1.3) brightness(1.1)' },
    ],
    modern: [
      { id: 'modern-1', name: 'Clean & Bright', css: 'contrast(1.1) brightness(1.15) saturate(1.1)' },
      { id: 'modern-2', name: 'Minimal', css: 'contrast(0.95) brightness(1.05) saturate(0.9)' },
      { id: 'modern-3', name: 'Vibrant', css: 'contrast(1.2) saturate(1.4) brightness(1.05)' },
    ],
    artistic: [
      { id: 'artistic-1', name: 'Cross Process', css: 'contrast(1.3) saturate(1.5) hue-rotate(30deg)' },
      { id: 'artistic-2', name: 'Dream', css: 'contrast(0.9) brightness(1.2) blur(0.5px) saturate(1.2)' },
      { id: 'artistic-3', name: 'Pop Art', css: 'contrast(1.4) saturate(2) brightness(1.1)' },
    ]
  },

  // Layout templates
  layouts: [
    {
      id: 'strip-2',
      name: '2-Photo Strip',
      type: 'strip',
      slots: 2,
      dimensions: { width: 400, height: 800 },
      arrangement: 'vertical'
    },
    {
      id: 'strip-4',
      name: '4-Photo Strip',
      type: 'strip', 
      slots: 4,
      dimensions: { width: 400, height: 1200 },
      arrangement: 'vertical'
    },
    {
      id: 'grid-2x2',
      name: '2x2 Grid',
      type: 'grid',
      slots: 4,
      dimensions: { width: 800, height: 800 },
      arrangement: 'grid'
    },
    {
      id: 'grid-3x2',
      name: '3x2 Grid',
      type: 'grid',
      slots: 6,
      dimensions: { width: 1200, height: 800 },
      arrangement: 'grid'
    },
    {
      id: 'single-large',
      name: 'Single Large',
      type: 'single',
      slots: 1,
      dimensions: { width: 800, height: 600 },
      arrangement: 'single'
    }
  ],

  // Sample saved projects
  savedProjects: [
    {
      id: 1,
      name: 'Birthday Party Fun',
      photos: [
        'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop'
      ],
      layout: 'strip-4',
      filter: 'vintage-1',
      customization: {
        borderColor: '#ffffff',
        backgroundColor: '#ffffff',
        spacing: 10,
        text: 'Birthday Celebration 2025',
        textColor: '#000000'
      },
      createdAt: new Date(2025, 0, 15).toISOString(),
      updatedAt: new Date(2025, 0, 15).toISOString()
    },
    {
      id: 2,
      name: 'Wedding Memories',
      photos: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=400&fit=crop'
      ],
      layout: 'grid-2x2',
      filter: 'cinematic-1',
      customization: {
        borderColor: '#f8f8f8',
        backgroundColor: '#ffffff',
        spacing: 15,
        text: 'Sarah & John • June 2025',
        textColor: '#333333'
      },
      createdAt: new Date(2025, 0, 10).toISOString(),
      updatedAt: new Date(2025, 0, 12).toISOString()
    }
  ]
};