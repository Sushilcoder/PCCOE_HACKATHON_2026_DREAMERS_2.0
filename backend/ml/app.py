from fastapi import FastAPI, File, UploadFile, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import os
import shutil
import asyncio
import numpy as np
import cv2
from datetime import datetime
import json
import redis
from sqlalchemy import create_engine, Column, String, Float, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Deepfake Detection ML Backend", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
DB_URL = os.getenv("DB_URL", "postgresql://deepfake_admin:secure_password_change_me@localhost:5432/deepfake_detection")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
GPU_ENABLED = os.getenv("GPU_ENABLED", "false").lower() == "true"

# Database setup
engine = create_engine(DB_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Redis connection
redis_client = redis.from_url(REDIS_URL)

# Database models
class AnalysisResult(Base):
    __tablename__ = "analysis_results"
    
    id = Column(String, primary_key=True)
    file_name = Column(String)
    file_type = Column(String)  # image, video, audio, text
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    # Detection scores
    image_score = Column(Float, nullable=True)
    video_score = Column(Float, nullable=True)
    audio_score = Column(Float, nullable=True)
    text_score = Column(Float, nullable=True)
    
    # Cross-modal scores
    lipsync_score = Column(Float, nullable=True)
    face_voice_score = Column(Float, nullable=True)
    text_image_score = Column(Float, nullable=True)
    
    # Overall result
    overall_score = Column(Float)
    is_deepfake = Column(String)  # "REAL", "DEEPFAKE", "SUSPICIOUS"
    confidence = Column(Float)
    
    # Metadata
    metadata = Column(JSON)

Base.metadata.create_all(bind=engine)

# Pydantic models
class DetectionRequest(BaseModel):
    file_path: str
    file_type: str

class DetectionResponse(BaseModel):
    analysis_id: str
    file_name: str
    file_type: str
    scores: dict
    overall_score: float
    is_deepfake: str
    confidence: float
    timestamp: str

# Simulated detection models (replace with actual models)
class DeepfakeDetector:
    @staticmethod
    def detect_image(image_path: str) -> dict:
        """Detect deepfake in image using EfficientNet"""
        try:
            # Simulate detection
            score = np.random.random()
            return {
                "score": float(score),
                "confidence": float(np.random.random()),
                "face_count": np.random.randint(0, 5),
                "artifacts": []
            }
        except Exception as e:
            logger.error(f"Image detection error: {str(e)}")
            return {"score": 0.5, "error": str(e)}
    
    @staticmethod
    def detect_video(video_path: str) -> dict:
        """Detect deepfake in video using 3D CNN"""
        try:
            # Simulate detection
            score = np.random.random()
            frame_scores = [np.random.random() for _ in range(10)]
            return {
                "score": float(score),
                "confidence": float(np.random.random()),
                "frame_scores": frame_scores,
                "max_frame_score": float(max(frame_scores)),
                "artifacts": []
            }
        except Exception as e:
            logger.error(f"Video detection error: {str(e)}")
            return {"score": 0.5, "error": str(e)}
    
    @staticmethod
    def detect_audio(audio_path: str) -> dict:
        """Detect deepfake in audio using Wav2Vec2"""
        try:
            # Simulate detection
            score = np.random.random()
            return {
                "score": float(score),
                "confidence": float(np.random.random()),
                "frequency_anomalies": []
            }
        except Exception as e:
            logger.error(f"Audio detection error: {str(e)}")
            return {"score": 0.5, "error": str(e)}
    
    @staticmethod
    def detect_text(text_content: str) -> dict:
        """Detect AI-generated text using RoBERTa"""
        try:
            # Simulate detection
            score = np.random.random()
            return {
                "score": float(score),
                "confidence": float(np.random.random()),
                "ai_generated_probability": float(score)
            }
        except Exception as e:
            logger.error(f"Text detection error: {str(e)}")
            return {"score": 0.5, "error": str(e)}

detector = DeepfakeDetector()

# Routes
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ML Backend",
        "gpu_enabled": GPU_ENABLED,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/analyze/image", response_model=DetectionResponse)
async def analyze_image(file: UploadFile = File(...)):
    """Analyze image for deepfakes"""
    try:
        upload_dir = "/app/uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = os.path.join(upload_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Run detection
        image_result = detector.detect_image(file_path)
        
        analysis_id = f"img_{datetime.utcnow().timestamp()}"
        overall_score = image_result.get("score", 0.5)
        is_deepfake = "DEEPFAKE" if overall_score > 0.6 else "REAL" if overall_score < 0.4 else "SUSPICIOUS"
        
        # Store in database
        db = SessionLocal()
        result = AnalysisResult(
            id=analysis_id,
            file_name=file.filename,
            file_type="image",
            image_score=overall_score,
            overall_score=overall_score,
            is_deepfake=is_deepfake,
            confidence=image_result.get("confidence", 0.0),
            metadata=image_result
        )
        db.add(result)
        db.commit()
        db.close()
        
        return DetectionResponse(
            analysis_id=analysis_id,
            file_name=file.filename,
            file_type="image",
            scores={"image": overall_score},
            overall_score=overall_score,
            is_deepfake=is_deepfake,
            confidence=image_result.get("confidence", 0.0),
            timestamp=datetime.utcnow().isoformat()
        )
    except Exception as e:
        logger.error(f"Error analyzing image: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/video", response_model=DetectionResponse)
async def analyze_video(file: UploadFile = File(...)):
    """Analyze video for deepfakes"""
    try:
        upload_dir = "/app/uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = os.path.join(upload_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Run detection
        video_result = detector.detect_video(file_path)
        
        analysis_id = f"vid_{datetime.utcnow().timestamp()}"
        overall_score = video_result.get("score", 0.5)
        is_deepfake = "DEEPFAKE" if overall_score > 0.6 else "REAL" if overall_score < 0.4 else "SUSPICIOUS"
        
        # Store in database
        db = SessionLocal()
        result = AnalysisResult(
            id=analysis_id,
            file_name=file.filename,
            file_type="video",
            video_score=overall_score,
            overall_score=overall_score,
            is_deepfake=is_deepfake,
            confidence=video_result.get("confidence", 0.0),
            metadata=video_result
        )
        db.add(result)
        db.commit()
        db.close()
        
        return DetectionResponse(
            analysis_id=analysis_id,
            file_name=file.filename,
            file_type="video",
            scores={"video": overall_score},
            overall_score=overall_score,
            is_deepfake=is_deepfake,
            confidence=video_result.get("confidence", 0.0),
            timestamp=datetime.utcnow().isoformat()
        )
    except Exception as e:
        logger.error(f"Error analyzing video: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/audio", response_model=DetectionResponse)
async def analyze_audio(file: UploadFile = File(...)):
    """Analyze audio for deepfakes"""
    try:
        upload_dir = "/app/uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = os.path.join(upload_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Run detection
        audio_result = detector.detect_audio(file_path)
        
        analysis_id = f"aud_{datetime.utcnow().timestamp()}"
        overall_score = audio_result.get("score", 0.5)
        is_deepfake = "DEEPFAKE" if overall_score > 0.6 else "REAL" if overall_score < 0.4 else "SUSPICIOUS"
        
        # Store in database
        db = SessionLocal()
        result = AnalysisResult(
            id=analysis_id,
            file_name=file.filename,
            file_type="audio",
            audio_score=overall_score,
            overall_score=overall_score,
            is_deepfake=is_deepfake,
            confidence=audio_result.get("confidence", 0.0),
            metadata=audio_result
        )
        db.add(result)
        db.commit()
        db.close()
        
        return DetectionResponse(
            analysis_id=analysis_id,
            file_name=file.filename,
            file_type="audio",
            scores={"audio": overall_score},
            overall_score=overall_score,
            is_deepfake=is_deepfake,
            confidence=audio_result.get("confidence", 0.0),
            timestamp=datetime.utcnow().isoformat()
        )
    except Exception as e:
        logger.error(f"Error analyzing audio: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/text", response_model=DetectionResponse)
async def analyze_text(text_data: dict):
    """Analyze text for AI-generated content"""
    try:
        text_content = text_data.get("content", "")
        
        if not text_content:
            raise HTTPException(status_code=400, detail="No text content provided")
        
        # Run detection
        text_result = detector.detect_text(text_content)
        
        analysis_id = f"txt_{datetime.utcnow().timestamp()}"
        overall_score = text_result.get("score", 0.5)
        is_deepfake = "DEEPFAKE" if overall_score > 0.6 else "REAL" if overall_score < 0.4 else "SUSPICIOUS"
        
        # Store in database
        db = SessionLocal()
        result = AnalysisResult(
            id=analysis_id,
            file_name="text_input",
            file_type="text",
            text_score=overall_score,
            overall_score=overall_score,
            is_deepfake=is_deepfake,
            confidence=text_result.get("confidence", 0.0),
            metadata=text_result
        )
        db.add(result)
        db.commit()
        db.close()
        
        return DetectionResponse(
            analysis_id=analysis_id,
            file_name="text_input",
            file_type="text",
            scores={"text": overall_score},
            overall_score=overall_score,
            is_deepfake=is_deepfake,
            confidence=text_result.get("confidence", 0.0),
            timestamp=datetime.utcnow().isoformat()
        )
    except Exception as e:
        logger.error(f"Error analyzing text: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analysis/{analysis_id}")
async def get_analysis(analysis_id: str):
    """Retrieve analysis results"""
    try:
        db = SessionLocal()
        result = db.query(AnalysisResult).filter(AnalysisResult.id == analysis_id).first()
        db.close()
        
        if not result:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        return {
            "id": result.id,
            "file_name": result.file_name,
            "file_type": result.file_type,
            "overall_score": result.overall_score,
            "is_deepfake": result.is_deepfake,
            "confidence": result.confidence,
            "metadata": result.metadata,
            "uploaded_at": result.uploaded_at.isoformat()
        }
    except Exception as e:
        logger.error(f"Error retrieving analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
