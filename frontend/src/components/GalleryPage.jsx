import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Camera, Trash2, Edit3, Download, Calendar, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import apiService from '../services/api';

const GalleryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const backendProjects = await apiService.getAllProjects();
      setProjects(backendProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
      toast({
        title: "Loading Failed",
        description: "Unable to load projects. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await apiService.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      
      toast({
        title: "Project Deleted",
        description: "The project has been removed from your gallery.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error.message || "Unable to delete project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const editProject = (projectId) => {
    navigate(`/studio?id=${projectId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your gallery...</p>
        </div>
      </div>
    );
  }

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
                <span className="font-semibold text-gray-900">My Gallery</span>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/studio')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {projects.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Projects Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start creating your first photobooth masterpiece with our easy-to-use studio tools.
            </p>
            <Button 
              onClick={() => navigate('/studio')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
            >
              <Camera className="w-5 h-5 mr-2" />
              Create First Project
            </Button>
          </div>
        ) : (
          <>
            {/* Gallery Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Creative Gallery</h1>
              <p className="text-gray-600">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'} • Keep creating and building your collection
              </p>
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project) => (
                <Card 
                  key={project.id} 
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                >
                  <CardHeader className="p-0">
                    {/* Project Preview */}
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      {project.photos && project.photos.length > 0 ? (
                        <div className="grid grid-cols-2 h-full">
                          {project.photos.slice(0, 4).map((photo, index) => (
                            <div
                              key={index}
                              className="relative overflow-hidden bg-gray-200"
                              style={{
                                filter: project.filter ? mockData.filters.vintage.find(f => f.id === project.filter)?.css || 
                                       mockData.filters.cinematic.find(f => f.id === project.filter)?.css ||
                                       mockData.filters.modern.find(f => f.id === project.filter)?.css ||
                                       mockData.filters.artistic.find(f => f.id === project.filter)?.css || 'none' : 'none'
                              }}
                            >
                              <img
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Camera className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            // TODO: Load project in studio
                            navigate('/studio');
                          }}
                          className="bg-white/90 hover:bg-white text-gray-900"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            // TODO: Export project
                            toast({
                              title: "Export Feature",
                              description: "Export functionality will be available when you edit the project.",
                            });
                          }}
                          className="bg-white/90 hover:bg-white text-gray-900"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteProject(project.id)}
                          className="bg-red-500/90 hover:bg-red-600 text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {project.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 space-x-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(project.updatedAt || project.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Camera className="w-3 h-3" />
                          <span>{project.photos?.length || 0} photos</span>
                        </div>
                      </div>
                      {project.customization?.text && (
                        <p className="text-xs text-gray-400 truncate">
                          "{project.customization.text}"
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;