# DeepScan Quick Start Guide

Get up and running with the Multi-Modal Deepfake Detection System in minutes.

## Prerequisites

- Docker & Docker Compose installed
- At least 8GB RAM available
- Ports 3000, 3001, 8000, 5432 available

## 30-Second Startup

```bash
# Clone and enter directory
git clone https://github.com/yourusername/deepscan.git
cd deepscan

# Copy environment file (uses defaults)
cp .env.local.example .env.local

# Start all services
docker-compose up --build

# Wait for services to initialize (~2-3 minutes)
# Then visit http://localhost:3000
```

## First Time Setup

### 1. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

### 2. Create Account

1. Click "Get Started" or go to Sign Up
2. Enter email and password
3. Confirm password
4. Click "Create Account"

### 3. Test Image Analysis

1. Go to Dashboard
2. Click "Image" tab
3. Drag and drop an image or click to select
4. View results with heatmap and confidence scores

### 4. Try Other Modalities

- **Video**: Upload a video file to test video deepfake detection
- **Audio**: Upload an audio file to detect voice cloning
- **Text**: Paste text to check if it's AI-generated

## Services Overview

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| Frontend | 3000 | http://localhost:3000 | Web interface |
| API Gateway | 3001 | http://localhost:3001 | REST API |
| ML Backend | 8000 | http://localhost:8000 | Detection models |
| PostgreSQL | 5432 | localhost | Database |
| Redis | 6379 | localhost | Cache |

## Common Tasks

### View Service Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f ml_backend
docker-compose logs -f api_gateway
docker-compose logs -f frontend
```

### Stop Services

```bash
# Stop all services (keeps data)
docker-compose stop

# Stop and remove containers (keeps data)
docker-compose down

# Stop and remove everything (including volumes - DATA LOSS!)
docker-compose down -v
```

### Restart a Service

```bash
docker-compose restart ml_backend
```

### Check Service Status

```bash
docker-compose ps
```

## Testing API Endpoints

### Health Check

```bash
curl http://localhost:3001/health
```

### Register User

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

### Analyze Image

```bash
curl -X POST http://localhost:3001/analyze/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

### Analyze Text

```bash
curl -X POST http://localhost:3001/analyze/text \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "This is a test sentence."}'
```

## File Structure

```
deepscan/
├── app/                          # Next.js frontend
│   ├── page.tsx                 # Landing page
│   ├── auth/                    # Authentication pages
│   ├── dashboard/               # Main application
│   └── globals.css              # Theme and styles
├── components/                   # React components
│   ├── ui/                      # Shadcn UI components
│   └── dashboard/               # Dashboard specific
├── backend/
│   ├── api/                     # Node.js API Gateway
│   │   ├── server.js           # Main server
│   │   ├── middleware/         # Express middleware
│   │   ├── blockchain/         # Web3 integration
│   │   └── utils/              # Utilities
│   ├── ml/                      # FastAPI ML backend
│   │   ├── app.py             # Main FastAPI app
│   │   ├── models_/            # Detection models
│   │   ├── Dockerfile         # Python container
│   │   └── requirements.txt    # Python dependencies
│   ├── db/                      # Database
│   │   └── init.sql            # Database schema
│   └── blockchain/              # Smart contracts
│       └── ContentAuthenticity.sol
├── docker-compose.yml            # Container orchestration
├── Dockerfile.frontend          # Frontend Docker image
├── .env.local                   # Environment variables
└── README.md                    # Full documentation
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # Frontend
lsof -i :3001  # API
lsof -i :8000  # ML
lsof -i :5432  # Database

# Kill process
kill -9 <PID>

# Or modify docker-compose.yml ports
```

### Out of Memory

```bash
# Increase Docker memory limit
# Docker Desktop: Settings > Resources > Memory

# Or reduce ML model precision
# Edit docker-compose.yml GPU settings
```

### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

### ML Backend Errors

```bash
# Check GPU availability
docker run --rm --runtime=nvidia nvidia/cuda:12.2.2-runtime nvidia-smi

# View ML logs
docker-compose logs -f ml_backend

# Disable GPU if not available
# Edit docker-compose.yml: set GPU_ENABLED=false
```

## Performance Tips

1. **For CPU-only systems**: Set `GPU_ENABLED=false` in docker-compose.yml
2. **Reduce memory usage**: Lower `FRAME_BATCH_SIZE` in ML backend
3. **Faster inference**: Use smaller models (edit `models_/` files)
4. **Database optimization**: Add indexes from DEPLOYMENT.md

## Next Steps

1. Read the full [README.md](./README.md) for comprehensive documentation
2. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
3. Review API documentation in backend/api/README.md
4. Configure blockchain integration for mainnet
5. Setup SSL/TLS for production

## Getting Help

### Common Issues

- **Docker not starting**: Check Docker is running, `docker ps`
- **Services won't initialize**: Check logs with `docker-compose logs`
- **Can't login**: Verify database is initialized: `docker-compose logs postgres`

### Support

- GitHub Issues: https://github.com/yourusername/deepscan/issues
- Email: support@deepscan.ai
- Documentation: https://docs.deepscan.ai

## Demo Credentials

For testing purposes, you can use:
- Email: `demo@deepscan.ai`
- Password: `DemoPassword123`

(Only available in development with demo data seeding enabled)

---

Enjoy using DeepScan! For updates and announcements, follow our GitHub repository.
