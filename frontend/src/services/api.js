import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Configure axios defaults
axios.defaults.timeout = 30000; // 30 seconds for photo uploads

class ApiService {
  // Projects API
  async getAllProjects() {
    try {
      const response = await axios.get(`${API}/projects`);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  async getProject(projectId) {
    try {
      const response = await axios.get(`${API}/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw new Error('Failed to fetch project');
    }
  }

  async createProject(projectData) {
    try {
      const response = await axios.post(`${API}/projects`, projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  }

  async updateProject(projectId, updateData) {
    try {
      const response = await axios.put(`${API}/projects/${projectId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  }

  async deleteProject(projectId) {
    try {
      const response = await axios.delete(`${API}/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project');
    }
  }

  async addPhotosToProject(projectId, photos) {
    try {
      const response = await axios.post(`${API}/projects/${projectId}/photos`, photos);
      return response.data;
    } catch (error) {
      console.error('Error adding photos to project:', error);
      throw new Error('Failed to add photos to project');
    }
  }

  async removePhotoFromProject(projectId, photoId) {
    try {
      const response = await axios.delete(`${API}/projects/${projectId}/photos/${photoId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing photo from project:', error);
      throw new Error('Failed to remove photo from project');
    }
  }

  // Utility methods
  convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async processPhotosForUpload(photos) {
    const processedPhotos = [];
    
    for (const photo of photos) {
      try {
        let photoData = {
          name: photo.name,
          type: photo.type,
          url: photo.url
        };

        // If photo has a file object, convert to base64
        if (photo.file) {
          photoData.url = await this.convertImageToBase64(photo.file);
        }

        processedPhotos.push(photoData);
      } catch (error) {
        console.error('Error processing photo:', photo.name, error);
        throw new Error(`Failed to process photo: ${photo.name}`);
      }
    }

    return processedPhotos;
  }
}

export default new ApiService();