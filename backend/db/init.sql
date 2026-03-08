-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analysis results table
CREATE TABLE IF NOT EXISTS analysis_results (
  id VARCHAR(255) PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Detection scores
  image_score FLOAT,
  video_score FLOAT,
  audio_score FLOAT,
  text_score FLOAT,
  
  -- Cross-modal scores
  lipsync_score FLOAT,
  face_voice_score FLOAT,
  text_image_score FLOAT,
  
  -- Overall result
  overall_score FLOAT NOT NULL,
  is_deepfake VARCHAR(50) NOT NULL,
  confidence FLOAT,
  
  -- Metadata
  metadata JSONB
);

-- Analysis jobs table
CREATE TABLE IF NOT EXISTS analysis_jobs (
  id VARCHAR(255) PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255),
  file_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  result JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content authenticity table (for blockchain records)
CREATE TABLE IF NOT EXISTS content_authenticity (
  id VARCHAR(255) PRIMARY KEY,
  content_hash VARCHAR(255) UNIQUE NOT NULL,
  creator_address VARCHAR(255),
  signature VARCHAR(512),
  authenticated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  transaction_hash VARCHAR(255),
  metadata JSONB
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_analysis_results_file_type ON analysis_results(file_type);
CREATE INDEX IF NOT EXISTS idx_analysis_jobs_user_id ON analysis_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_jobs_status ON analysis_jobs(status);
CREATE INDEX IF NOT EXISTS idx_content_authenticity_hash ON content_authenticity(content_hash);

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255),
  resource_type VARCHAR(50),
  resource_id VARCHAR(255),
  changes JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
