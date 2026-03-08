"""
ML Models Package
Provides detection models for different media types
"""

from .image_detector import ImageDeepfakeDetector, create_image_detector
from .video_detector import VideoDeepfakeDetector, create_video_detector
from .audio_detector import AudioDeepfakeDetector, create_audio_detector

__all__ = [
    'ImageDeepfakeDetector',
    'VideoDeepfakeDetector',
    'AudioDeepfakeDetector',
    'create_image_detector',
    'create_video_detector',
    'create_audio_detector'
]
