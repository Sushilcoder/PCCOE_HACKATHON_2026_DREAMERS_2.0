# DeepScan System Architecture

## Overview

DeepScan is a distributed, cloud-native multi-modal deepfake detection system built with microservices architecture. It combines advanced AI models with blockchain authentication for content verification.

## System Components

### 1. Frontend Layer (Next.js)

**Technology**: Next.js 16, React 19, Tailwind CSS, Shadcn/UI

**Responsibilities**:
- User authentication interface
- File upload with drag-drop support
- Real-time analysis result visualization
- Heatmap rendering (Grad-CAM visualizations)
- Blockchain interaction (MetaMask integration)
- Responsive design (mobile-first)

**Key Routes**:
- `/` - Landing page
- `/auth/login` - User login
- `/auth/register` - Registration
- `/dashboard` - Main application
- `/dashboard/history` - Analysis history

**State Management**: Browser localStorage, SWR for API calls, Socket.io for real-time updates

### 2. API Gateway (Node.js + Express)

**Port**: 3001

**Responsibilities**:
- JWT authentication and authorization
- Request validation and sanitization
- Rate limiting and DDoS protection
- File upload handling with multipart
- WebSocket connection management
- Database query orchestration
- Blockchain contract interaction
- ML backend service routing

**Key Features**:
- Error handling middleware
- CORS configuration
- Request logging
- Authentication middleware
- Rate limiter (10 req/min for analysis, 5 req/15min for auth)

**Database Connection Pool**: PostgreSQL with 20 connections

**Cache Layer**: Redis for session storage and rate limiting

### 3. ML Backend (FastAPI + Python)

**Port**: 8000

**Responsibilities**:
- Image deepfake detection (EfficientNet, XceptionNet)
- Video deepfake detection (3D CNN, LSTM)
- Audio deepfake detection (Wav2Vec2, Spectral analysis)
- Text AI detection (RoBERTa, BERT)
- Cross-modal verification
- Model inference and optimization

**Detection Pipeline**:
```
Input File
    ↓
File Type Detection
    ↓
Preprocessing (resize, normalize, artifact extraction)
    ↓
Model Inference (ensemble of models)
    ↓
Post-processing (confidence calibration)
    ↓
Result Aggregation & Scoring
    ↓
Database Storage
```

**GPU Support**: NVIDIA CUDA 12.2.2 (optional)

### 4. Database Layer

**PostgreSQL** (Port 5432):
- User accounts
- Analysis results
- Analysis jobs
- Content authenticity records
- Audit logs

**Redis** (Port 6379):
- Session caching
- Rate limiting counters
- Analysis result caching (1-hour TTL)
- Task queue for async operations

### 5. Blockchain Layer

**Network**: Polygon (Mumbai testnet for development, Mainnet for production)

**Smart Contract**: `ContentAuthenticity.sol`
- Content registration
- Creator authentication
- Signature verification
- Verification status tracking
- Event logging

**Integration Points**:
- API Gateway: Contract interaction
- Frontend: MetaMask connection
- Database: Record storage

## Data Flow Diagrams

### Image Analysis Flow

```
User Upload
    ↓
Frontend (file validation)
    ↓
API Gateway (authentication, rate limiting)
    ↓
ML Backend (preprocessing)
    ↓
EfficientNet Model → Confidence Score
    ↓
XceptionNet Model → Confidence Score
    ↓
Ensemble Voting
    ↓
Face Detection & Artifact Analysis
    ↓
Heatmap Generation (Grad-CAM)
    ↓
Database Storage
    ↓
Frontend (result visualization)
```

### Cross-Modal Verification Flow

```
Video + Audio Input
    ↓
Video Detection Pipeline
    ↓
Audio Detection Pipeline
    ↓
Lip-Sync Verification (SyncNet)
    ↓
Face-Voice Correlation (FaceNet embeddings)
    ↓
Weighted Ensemble
    ↓
Final Confidence Score
```

### Blockchain Authentication Flow

```
Analysis Complete
    ↓
User Registers Content
    ↓
Generate Content Hash (SHA256)
    ↓
Sign with Private Key
    ↓
API Gateway Broadcasts Transaction
    ↓
Polygon Network Confirmation
    ↓
Transaction Hash Stored in DB
    ↓
Authenticity Badge Generated
```

## Scalability Architecture

### Horizontal Scaling

- **Stateless API Gateway**: Scale independently with load balancer
- **ML Backend**: GPU-based inference servers with queue (Redis)
- **Frontend**: Served via CDN with caching headers

### Load Distribution

```
┌─────────────────────────────────────┐
│     User Requests (Thousands)       │
└──────────────────┬──────────────────┘
                   │
         ┌─────────▼─────────┐
         │  Load Balancer    │
         └──┬──────────────┬─┘
            │              │
    ┌───────▼──┐    ┌──────▼────┐
    │ API Inst 1│    │ API Inst 2│
    └───────┬──┘    └──────┬────┘
            │              │
            └──────┬───────┘
                   │
         ┌─────────▼──────────┐
         │   Task Queue       │
         │   (Redis)          │
         └────────────────────┘
                   │
    ┌──────────┬───▼────┬──────────┐
    │ ML GPU 1 │ ML GPU │ ML GPU 3 │
    │          │   2    │          │
    └──────────┴────────┴──────────┘
```

### Database Scaling

- **Read Replicas**: For analysis history queries
- **Write Master**: Single source for consistency
- **Connection Pooling**: PgBouncer for connection management
- **Sharding**: By user_id for future scaling

## Security Architecture

### Authentication & Authorization

```
Login Request
    ↓
Password Hash (bcrypt)
    ↓
JWT Token Generation (7-day expiry)
    ↓
Token Stored (client-side)
    ↓
Authorization Header on Requests
    ↓
Token Validation Middleware
    ↓
User ID Extraction from Token
    ↓
Permission Check (row-level security)
```

### Data Protection

- **In Transit**: TLS 1.3 encryption
- **At Rest**: Database encryption, encrypted backups
- **Private Keys**: Secure vault integration (AWS Secrets Manager)
- **API Keys**: Environment-based, never exposed

### Input Validation

```
User Input
    ↓
Schema Validation (Zod, Pydantic)
    ↓
File Type Validation
    ↓
File Size Validation (100MB max)
    ↓
Malware Scanning (optional ClamAV)
    ↓
Processing
```

## Performance Optimization

### Frontend

- Code splitting with Next.js dynamic imports
- Image optimization with next/image
- Caching headers for static assets
- Progressive Web App capabilities
- Service Worker for offline support

### API Gateway

- Request caching (1-hour TTL for analysis)
- Connection pooling (20 connections)
- Compression (gzip)
- Async processing for heavy operations
- Rate limiting per user/IP

### ML Backend

- Model caching in memory
- Batch processing for multiple files
- GPU optimization with CUDA
- Quantization for faster inference
- Model pruning for reduced size

### Database

```sql
-- Key Indexes
CREATE INDEX idx_analysis_results_score ON analysis_results(overall_score);
CREATE INDEX idx_analysis_jobs_user_id ON analysis_jobs(user_id);
CREATE INDEX idx_analysis_jobs_created ON analysis_jobs(created_at);
CREATE INDEX idx_content_hash ON content_authenticity(content_hash);
```

## Monitoring & Observability

### Metrics Collection

- **Prometheus**: Metrics scraping
- **ELK Stack**: Log aggregation
- **Jaeger**: Distributed tracing
- **Grafana**: Dashboards

### Key Metrics

```
API Gateway:
  - Request latency (p50, p95, p99)
  - Error rate (4xx, 5xx)
  - Throughput (req/sec)
  - Authentication failures

ML Backend:
  - Inference time (per modality)
  - GPU utilization
  - Model accuracy
  - Queue depth

Database:
  - Query latency
  - Connection pool usage
  - Replication lag
  - Backup status
```

### Alerting

```yaml
AlertRules:
  - HighErrorRate: error_rate > 5%
  - SlowResponse: p95_latency > 5s
  - GPUUnavailable: gpu_count == 0
  - DatabaseDown: postgres_up == 0
  - LowDiskSpace: disk_free < 10%
```

## Deployment Topology

### Development

```
Single Machine
├── Frontend (port 3000)
├── API Gateway (port 3001)
├── ML Backend (port 8000)
├── PostgreSQL (port 5432)
└── Redis (port 6379)
```

### Production (Kubernetes)

```
k8s Cluster (3+ nodes)
├── Frontend Pods (2 replicas)
├── API Gateway Pods (3 replicas)
├── ML Backend Pods (2 replicas with GPU)
├── PostgreSQL StatefulSet (1 primary, 2 replicas)
├── Redis StatefulSet (1 primary, 1 replica)
├── Ingress Controller (SSL termination)
├── ConfigMaps & Secrets
└── PersistentVolumes (Database, Models)
```

## Disaster Recovery

### Backup Strategy

- **Database**: Daily snapshots, WAL archiving
- **Models**: Version controlled, stored in S3
- **Code**: Git repository with continuous backup
- **Blockchain Records**: Immutable on-chain

### Recovery Procedures

```
RTO (Recovery Time Objective): < 1 hour
RPO (Recovery Point Objective): < 15 minutes

1. Detect failure
2. Alert on-call engineer
3. Initiate database restoration
4. Verify data integrity
5. Perform smoke tests
6. Notify users
```

## Future Enhancements

- [ ] Federated learning for privacy
- [ ] On-device ML inference (ONNX)
- [ ] Real-time stream analysis (WebRTC)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] API marketplace
- [ ] Custom model training service
- [ ] Hardware acceleration (TPU support)

---

For detailed component documentation, see individual README files in `/backend`.
