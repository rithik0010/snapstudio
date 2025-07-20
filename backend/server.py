from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from bson import ObjectId


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Helper function to convert ObjectId to string
def serialize_mongo_doc(doc):
    if doc is None:
        return None
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

# Photo Model
class Photo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str  # base64 data URL
    name: str
    type: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PhotoCreate(BaseModel):
    url: str
    name: str
    type: str

# Customization Model
class Customization(BaseModel):
    border_color: str = "#ffffff"
    background_color: str = "#ffffff"
    spacing: int = 10
    text: str = ""
    text_color: str = "#000000"
    text_size: int = 16
    text_position: str = "bottom"

# Project Model
class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    photos: List[Photo] = []
    layout: str = "strip-4"
    filter: Optional[str] = None
    customization: Customization = Field(default_factory=Customization)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectCreate(BaseModel):
    name: str
    photos: List[PhotoCreate] = []
    layout: str = "strip-4"
    filter: Optional[str] = None
    customization: Optional[Customization] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    photos: Optional[List[PhotoCreate]] = None
    layout: Optional[str] = None
    filter: Optional[str] = None
    customization: Optional[Customization] = None

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "SnapStyle Studio API is running!"}

# Project Routes
@api_router.get("/projects", response_model=List[Project])
async def get_projects():
    try:
        projects = await db.projects.find().to_list(1000)
        return [serialize_mongo_doc(project) for project in projects]
    except Exception as e:
        logging.error(f"Error fetching projects: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch projects")

@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    try:
        project = await db.projects.find_one({"id": project_id})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return serialize_mongo_doc(project)
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching project {project_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch project")

@api_router.post("/projects", response_model=Project)
async def create_project(project_data: ProjectCreate):
    try:
        # Create photos with IDs
        photos = []
        for photo_data in project_data.photos:
            photo = Photo(**photo_data.dict())
            photos.append(photo)
        
        # Create project
        customization = project_data.customization or Customization()
        project = Project(
            name=project_data.name,
            photos=photos,
            layout=project_data.layout,
            filter=project_data.filter,
            customization=customization
        )
        
        # Insert to database
        project_dict = project.dict()
        await db.projects.insert_one(project_dict)
        
        return project
    except Exception as e:
        logging.error(f"Error creating project: {e}")
        raise HTTPException(status_code=500, detail="Failed to create project")

@api_router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, project_data: ProjectUpdate):
    try:
        # Check if project exists
        existing_project = await db.projects.find_one({"id": project_id})
        if not existing_project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Prepare update data
        update_data = {"updated_at": datetime.utcnow()}
        
        if project_data.name is not None:
            update_data["name"] = project_data.name
        
        if project_data.photos is not None:
            photos = []
            for photo_data in project_data.photos:
                photo = Photo(**photo_data.dict())
                photos.append(photo.dict())
            update_data["photos"] = photos
        
        if project_data.layout is not None:
            update_data["layout"] = project_data.layout
        
        if project_data.filter is not None:
            update_data["filter"] = project_data.filter
        
        if project_data.customization is not None:
            update_data["customization"] = project_data.customization.dict()
        
        # Update project
        await db.projects.update_one(
            {"id": project_id}, 
            {"$set": update_data}
        )
        
        # Return updated project
        updated_project = await db.projects.find_one({"id": project_id})
        return serialize_mongo_doc(updated_project)
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating project {project_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update project")

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    try:
        # Check if project exists
        existing_project = await db.projects.find_one({"id": project_id})
        if not existing_project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Delete project
        result = await db.projects.delete_one({"id": project_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return {"message": "Project deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error deleting project {project_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete project")

# Photo upload endpoint
@api_router.post("/projects/{project_id}/photos", response_model=Project)
async def add_photos_to_project(project_id: str, photos: List[PhotoCreate]):
    try:
        # Check if project exists
        existing_project = await db.projects.find_one({"id": project_id})
        if not existing_project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Create photo objects
        new_photos = []
        for photo_data in photos:
            photo = Photo(**photo_data.dict())
            new_photos.append(photo.dict())
        
        # Add photos to existing project
        existing_photos = existing_project.get("photos", [])
        all_photos = existing_photos + new_photos
        
        # Update project
        await db.projects.update_one(
            {"id": project_id},
            {
                "$set": {
                    "photos": all_photos,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Return updated project
        updated_project = await db.projects.find_one({"id": project_id})
        return serialize_mongo_doc(updated_project)
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error adding photos to project {project_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to add photos to project")

@api_router.delete("/projects/{project_id}/photos/{photo_id}")
async def remove_photo_from_project(project_id: str, photo_id: str):
    try:
        # Check if project exists
        existing_project = await db.projects.find_one({"id": project_id})
        if not existing_project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Remove photo from project
        existing_photos = existing_project.get("photos", [])
        updated_photos = [photo for photo in existing_photos if photo.get("id") != photo_id]
        
        if len(updated_photos) == len(existing_photos):
            raise HTTPException(status_code=404, detail="Photo not found in project")
        
        # Update project
        await db.projects.update_one(
            {"id": project_id},
            {
                "$set": {
                    "photos": updated_photos,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return {"message": "Photo removed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error removing photo {photo_id} from project {project_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to remove photo from project")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
