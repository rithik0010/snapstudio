import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Camera, Layout, Palette, Download, Heart, Sparkles } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Camera className="w-8 h-8 text-purple-600" />,
      title: "Professional Photobooth",
      description: "Capture moments with our in-app camera or import your favorite photos"
    },
    {
      icon: <Palette className="w-8 h-8 text-pink-600" />,
      title: "Stunning Filters",
      description: "Choose from vintage, cinematic, modern, and artistic filter collections"
    },
    {
      icon: <Layout className="w-8 h-8 text-blue-600" />,
      title: "Creative Layouts",
      description: "Classic strips, modern grids, and customizable arrangements"
    },
    {
      icon: <Download className="w-8 h-8 text-green-600" />,
      title: "High-Quality Export",
      description: "Print-ready 300 DPI exports in JPEG and PNG formats"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                SnapStyle Studio
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/gallery')}
                className="text-gray-600 hover:text-purple-600"
              >
                My Gallery
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4 mr-2" />
            Transform Memories into Masterpieces
          </div>
          
          <h2 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Your Personal
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Photobooth Studio
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Capture the fun of a classic photobooth and unleash your creativity with professional filters, 
            unique layouts, and high-quality exports ready for printing and sharing.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              onClick={() => navigate('/studio')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Creating
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/gallery')}
              className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-2xl"
            >
              View Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20 bg-white/50 backdrop-blur-sm rounded-3xl mx-6 mb-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Create
          </h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Professional-grade tools designed for creators, families, and anyone who loves to capture and customize memories.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-3 text-lg">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white">
          <h3 className="text-4xl font-bold mb-6">Ready to Create Magic?</h3>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Join thousands of creators who are already making beautiful photobooth memories with SnapStyle Studio.
          </p>
          <Button 
            onClick={() => navigate('/studio')}
            className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Camera className="w-5 h-5 mr-2" />
            Launch Studio
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold">SnapStyle Studio</h4>
          </div>
          <p className="text-gray-400 mb-6">
            Transform your photos into professional photobooth memories
          </p>
          <p className="text-sm text-gray-500">
            &copy; 2025 SnapStyle Studio. Made with love for creators everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;