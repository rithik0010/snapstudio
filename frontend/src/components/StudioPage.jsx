import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Camera, Upload, Download, Save, Undo, Redo, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import PhotoImport from './PhotoImport';
import FilterPanel from './FilterPanel';
import LayoutPanel from './LayoutPanel';
import CustomizationPanel from './CustomizationPanel';
import CanvasEditor from './CanvasEditor';
import apiService from '../services/api';

const StudioPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const canvasRef = useRef(null);
  
  const [currentProject, setCurrentProject] = useState({
    id: Date.now(),
    name: 'Untitled Project',
    photos: [],
    layout: 'strip-4',
    filter: null,
    customization: {
      borderColor: '#ffffff',
      backgroundColor: '#ffffff',
      spacing: 10,
      text: '',
      textColor: '#000000',
      textSize: 16,
      textPosition: 'bottom'
    },
    createdAt: new Date().toISOString()
  });

  const [history, setHistory] = useState([currentProject]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('photos');

  const saveToHistory = (newProject) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newProject);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentProject(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentProject(history[historyIndex + 1]);
    }
  };

  const handlePhotosChange = (photos) => {
    const newProject = { ...currentProject, photos };
    setCurrentProject(newProject);
    saveToHistory(newProject);
  };

  const handleFilterChange = (filter) => {
    const newProject = { ...currentProject, filter };
    setCurrentProject(newProject);
    saveToHistory(newProject);
  };

  const handleLayoutChange = (layout) => {
    const newProject = { ...currentProject, layout };
    setCurrentProject(newProject);
    saveToHistory(newProject);
  };

  const handleCustomizationChange = (customization) => {
    const newProject = { ...currentProject, customization: { ...currentProject.customization, ...customization } };
    setCurrentProject(newProject);
    saveToHistory(newProject);
  };

  const saveProject = () => {
    try {
      const savedProjects = JSON.parse(localStorage.getItem('snapstyle-projects') || '[]');
      const existingIndex = savedProjects.findIndex(p => p.id === currentProject.id);
      
      if (existingIndex >= 0) {
        savedProjects[existingIndex] = { ...currentProject, updatedAt: new Date().toISOString() };
      } else {
        savedProjects.push({ ...currentProject, updatedAt: new Date().toISOString() });
      }
      
      localStorage.setItem('snapstyle-projects', JSON.stringify(savedProjects));
      
      toast({
        title: "Project Saved!",
        description: "Your project has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const exportProject = () => {
    if (canvasRef.current) {
      try {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = `${currentProject.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        
        toast({
          title: "Export Successful!",
          description: "Your high-resolution image has been downloaded.",
        });
      } catch (error) {
        toast({
          title: "Export Failed",
          description: "Unable to export image. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-purple-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1.5 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">SnapStyle Studio</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={undo}
                disabled={historyIndex === 0}
                className="text-gray-600"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={redo}
                disabled={historyIndex === history.length - 1}
                className="text-gray-600"
              >
                <Redo className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={saveProject}
                className="bg-white hover:bg-gray-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button 
                onClick={exportProject}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
          {/* Left Panel - Tools */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Studio Tools</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 rounded-lg mx-6 mb-4">
                    <TabsTrigger value="photos" className="text-sm">Photos</TabsTrigger>
                    <TabsTrigger value="design" className="text-sm">Design</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="photos" className="px-6 pb-6 mt-0">
                    <PhotoImport 
                      photos={currentProject.photos}
                      onPhotosChange={handlePhotosChange}
                    />
                  </TabsContent>
                  
                  <TabsContent value="design" className="px-6 pb-6 mt-0">
                    <div className="space-y-6">
                      <FilterPanel 
                        selectedFilter={currentProject.filter}
                        onFilterChange={handleFilterChange}
                      />
                      <LayoutPanel 
                        selectedLayout={currentProject.layout}
                        onLayoutChange={handleLayoutChange}
                      />
                      <CustomizationPanel 
                        customization={currentProject.customization}
                        onCustomizationChange={handleCustomizationChange}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Canvas */}
          <div className="lg:col-span-9">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg h-full">
              <CardContent className="p-6 h-full">
                <CanvasEditor
                  ref={canvasRef}
                  project={currentProject}
                  className="w-full h-full"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioPage;