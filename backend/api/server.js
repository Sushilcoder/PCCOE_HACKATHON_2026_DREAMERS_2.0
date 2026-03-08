const express = require('express');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { Pool } = require('pg');
const redis = require('redis');
const { Server } = require('socket.io');
const http = require('http');
const multer = require('multer');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Environment variables
const PORT = process.env.PORT || 3001;
const ML_BACKEND_URL = process.env.ML_BACKEND_URL || 'http://localhost:8000';
const DATABASE_URL = process.env.DATABASE_URL;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const POLYGON_RPC = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Database connection
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: false
});

// Redis connection
const redisClient = redis.createClient({ url: REDIS_URL });
redisClient.connect().catch(console.error);

// Ethers provider for blockchain
const provider = new ethers.JsonRpcProvider(POLYGON_RPC);

// Database initialization
async function initializeDatabase() {
  try {
    const queries = [
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS analysis_jobs (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        file_name VARCHAR(255),
        file_type VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending',
        result JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS content_authenticity (
        id VARCHAR(255) PRIMARY KEY,
        content_hash VARCHAR(255) UNIQUE NOT NULL,
        creator_address VARCHAR(255),
        signature VARCHAR(512),
        authenticated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        transaction_hash VARCHAR(255)
      )`
    ];

    for (const query of queries) {
      await pool.query(query);
    }
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Helper function to stream file to ML backend
async function sendToMLBackend(endpoint, formData) {
  try {
    const response = await axios.post(`${ML_BACKEND_URL}${endpoint}`, formData, {
      headers: formData.getHeaders?.()
    });
    return response.data;
  } catch (error) {
    console.error('ML Backend error:', error);
    throw error;
  }
}

// Health check
app.get('/health', async (req, res) => {
  try {
    const mlHealth = await axios.get(`${ML_BACKEND_URL}/health`);
    res.json({
      status: 'healthy',
      service: 'API Gateway',
      ml_backend: mlHealth.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Authentication Routes
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);

    // Insert user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
      [email, passwordHash]
    );

    const userId = result.rows[0].id;
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      userId
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT id, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcryptjs.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      userId: user.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analysis Routes
app.post('/analyze/image', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create FormData for ML backend
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);

    // Send to ML backend
    const result = await sendToMLBackend('/analyze/image', formData);

    // Store job in database
    await pool.query(
      'INSERT INTO analysis_jobs (id, user_id, file_name, file_type, status, result) VALUES ($1, $2, $3, $4, $5, $6)',
      [result.analysis_id, req.userId, req.file.originalname, 'image', 'completed', JSON.stringify(result)]
    );

    // Cache result
    await redisClient.setEx(`analysis:${result.analysis_id}`, 3600, JSON.stringify(result));

    res.json(result);
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/analyze/video', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);

    const result = await sendToMLBackend('/analyze/video', formData);

    await pool.query(
      'INSERT INTO analysis_jobs (id, user_id, file_name, file_type, status, result) VALUES ($1, $2, $3, $4, $5, $6)',
      [result.analysis_id, req.userId, req.file.originalname, 'video', 'completed', JSON.stringify(result)]
    );

    await redisClient.setEx(`analysis:${result.analysis_id}`, 3600, JSON.stringify(result));

    res.json(result);
  } catch (error) {
    console.error('Video analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/analyze/audio', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);

    const result = await sendToMLBackend('/analyze/audio', formData);

    await pool.query(
      'INSERT INTO analysis_jobs (id, user_id, file_name, file_type, status, result) VALUES ($1, $2, $3, $4, $5, $6)',
      [result.analysis_id, req.userId, req.file.originalname, 'audio', 'completed', JSON.stringify(result)]
    );

    await redisClient.setEx(`analysis:${result.analysis_id}`, 3600, JSON.stringify(result));

    res.json(result);
  } catch (error) {
    console.error('Audio analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/analyze/text', authenticate, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'No text content provided' });
    }

    const result = await axios.post(`${ML_BACKEND_URL}/analyze/text`, { content });

    await pool.query(
      'INSERT INTO analysis_jobs (id, user_id, file_name, file_type, status, result) VALUES ($1, $2, $3, $4, $5, $6)',
      [result.data.analysis_id, req.userId, 'text_input', 'text', 'completed', JSON.stringify(result.data)]
    );

    await redisClient.setEx(`analysis:${result.data.analysis_id}`, 3600, JSON.stringify(result.data));

    res.json(result.data);
  } catch (error) {
    console.error('Text analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get analysis history
app.get('/analysis/history', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, file_name, file_type, status, created_at FROM analysis_jobs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific analysis
app.get('/analysis/:id', authenticate, async (req, res) => {
  try {
    // Try cache first
    const cached = await redisClient.get(`analysis:${req.params.id}`);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query(
      'SELECT * FROM analysis_jobs WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blockchain Routes - Register content authenticity
app.post('/blockchain/register', authenticate, async (req, res) => {
  try {
    const { contentHash, signature } = req.body;

    if (!contentHash || !signature) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Store in database
    const result = await pool.query(
      'INSERT INTO content_authenticity (id, content_hash, signature) VALUES ($1, $2, $3) RETURNING *',
      [`auth_${Date.now()}`, contentHash, signature]
    );

    res.json({
      success: true,
      authenticity_id: result.rows[0].id,
      registered_at: result.rows[0].authenticated_at
    });
  } catch (error) {
    console.error('Blockchain registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify content authenticity
app.get('/blockchain/verify/:contentHash', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM content_authenticity WHERE content_hash = $1',
      [req.params.contentHash]
    );

    if (result.rows.length === 0) {
      return res.json({
        verified: false,
        message: 'Content not found in registry'
      });
    }

    res.json({
      verified: true,
      authenticity: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WebSocket for real-time updates
io.on('connection', (socket) => {
  console.log('New WebSocket connection:', socket.id);

  socket.on('subscribe_analysis', (analysisId) => {
    socket.join(`analysis:${analysisId}`);
    socket.emit('subscribed', { analysisId });
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected:', socket.id);
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Start server
initializeDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
    console.log(`ML Backend: ${ML_BACKEND_URL}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});

module.exports = { app, io };
