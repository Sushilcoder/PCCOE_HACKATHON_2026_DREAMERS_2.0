# DeepScan Deployment Guide

Complete guide to deploying the Multi-Modal Deepfake Detection System.

## Prerequisites

- Docker & Docker Compose
- Polygon Testnet RPC URL
- MetaMask or similar Web3 wallet
- AWS/GCP credentials (if using cloud deployment)
- Node.js 20+ and Python 3.10+ (for local development)

## Local Deployment with Docker

### 1. Prepare Environment

```bash
# Clone repository
git clone https://github.com/yourusername/deepscan.git
cd deepscan

# Create environment file
cat > .env.local << EOF
# Database
POSTGRES_USER=deepfake_admin
POSTGRES_PASSWORD=secure_password_123
POSTGRES_DB=deepfake_detection
DATABASE_URL=postgresql://deepfake_admin:secure_password_123@postgres:5432/deepfake_detection

# Redis
REDIS_URL=redis://redis:6379

# API
JWT_SECRET=your_jwt_secret_key_change_this
PORT=3001
ML_BACKEND_URL=http://ml_backend:8000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Blockchain
POLYGON_RPC_URL=https://mumbai.polygonscan.com/rpc
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=0x...
EOF
```

### 2. Build and Start Services

```bash
# Build all images
docker-compose build

# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 3. Verify Services

```bash
# Check frontend
curl http://localhost:3000

# Check API Gateway
curl http://localhost:3001/health

# Check ML Backend
curl http://localhost:8000/health

# Check database
docker-compose exec postgres psql -U deepfake_admin -d deepfake_detection -c "SELECT version();"
```

## Blockchain Deployment (Polygon)

### 1. Deploy Smart Contract

```bash
cd backend/blockchain

# Install dependencies
npm install

# Deploy contract
npx hardhat run scripts/deploy.js --network mumbai

# Save contract address for API
export CONTRACT_ADDRESS=0x...
```

### 2. Verify Contract

```bash
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

### 3. Update Configuration

Update `.env.local` with the deployed contract address:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
POLYGON_RPC_URL=https://mumbai.polygonscan.com/rpc
```

## AWS Deployment

### 1. Prepare AWS Resources

```bash
# Create ECR repositories
aws ecr create-repository --repository-name deepscan-frontend --region us-east-1
aws ecr create-repository --repository-name deepscan-api --region us-east-1
aws ecr create-repository --repository-name deepscan-ml --region us-east-1
```

### 2. Push Docker Images

```bash
# Get ECR login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

# Tag images
docker tag deepscan-frontend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/deepscan-frontend:latest
docker tag deepscan-api:latest <account>.dkr.ecr.us-east-1.amazonaws.com/deepscan-api:latest
docker tag deepscan-ml:latest <account>.dkr.ecr.us-east-1.amazonaws.com/deepscan-ml:latest

# Push images
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/deepscan-frontend:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/deepscan-api:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/deepscan-ml:latest
```

### 3. Deploy with ECS

```bash
# Create task definitions
aws ecs register-task-definition --cli-input-json file://deployment/ecs/frontend-task.json
aws ecs register-task-definition --cli-input-json file://deployment/ecs/api-task.json
aws ecs register-task-definition --cli-input-json file://deployment/ecs/ml-task.json

# Create services
aws ecs create-service --cluster deepscan --service-name frontend --task-definition frontend:1 --desired-count 2
aws ecs create-service --cluster deepscan --service-name api --task-definition api:1 --desired-count 2
aws ecs create-service --cluster deepscan --service-name ml --task-definition ml:1 --desired-count 1
```

### 4. Setup RDS Database

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier deepscan-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username deepfake_admin \
  --master-user-password SecurePassword123 \
  --allocated-storage 20
```

### 5. Setup ElastiCache

```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id deepscan-cache \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

## Kubernetes Deployment

### 1. Create Kubernetes Manifests

```bash
# Apply configuration
kubectl create namespace deepscan
kubectl apply -f deployment/k8s/configmap.yaml -n deepscan
kubectl apply -f deployment/k8s/secrets.yaml -n deepscan
```

### 2. Deploy Services

```bash
# Deploy frontend
kubectl apply -f deployment/k8s/frontend-deployment.yaml -n deepscan

# Deploy API Gateway
kubectl apply -f deployment/k8s/api-deployment.yaml -n deepscan

# Deploy ML Backend
kubectl apply -f deployment/k8s/ml-deployment.yaml -n deepscan

# Deploy PostgreSQL
kubectl apply -f deployment/k8s/postgres-deployment.yaml -n deepscan

# Deploy Redis
kubectl apply -f deployment/k8s/redis-deployment.yaml -n deepscan
```

### 3. Verify Deployment

```bash
# Check pods
kubectl get pods -n deepscan

# Check services
kubectl get svc -n deepscan

# Check logs
kubectl logs -n deepscan -l app=frontend
```

## Production Checklist

- [ ] SSL/TLS certificates configured
- [ ] Environment variables securely managed
- [ ] Database backups configured
- [ ] Monitoring and alerting setup
- [ ] Log aggregation configured
- [ ] Auto-scaling policies defined
- [ ] Database replicas configured
- [ ] CDN configured for frontend
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers configured
- [ ] Private key securely stored
- [ ] Contract address verified
- [ ] Load testing completed

## Monitoring & Logging

### CloudWatch

```bash
# View API logs
aws logs tail /aws/ecs/deepscan-api --follow

# View application metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --dimensions Name=ServiceName,Value=api \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average
```

### Prometheus

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'deepscan-api'
    static_configs:
      - targets: ['localhost:3001']
  
  - job_name: 'deepscan-ml'
    static_configs:
      - targets: ['localhost:8000']
```

## Scaling

### Horizontal Scaling

```bash
# Update ECS service desired count
aws ecs update-service \
  --cluster deepscan \
  --service api \
  --desired-count 5
```

### Vertical Scaling

```bash
# Update task definition with larger resources
aws ecs register-task-definition --cli-input-json file://deployment/ecs/api-task-large.json
```

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs ml_backend

# Check resource limits
docker stats

# Rebuild images
docker-compose build --no-cache
```

### Database Connection Issues

```bash
# Check PostgreSQL
docker-compose exec postgres psql -U deepfake_admin -d deepfake_detection -c "\dt"

# Check Redis
docker-compose exec redis redis-cli ping
```

### GPU Not Detected

```bash
# Check NVIDIA Docker
docker run --rm --runtime=nvidia nvidia/cuda:12.2.2-runtime-ubuntu22.04 nvidia-smi

# Update docker-compose.yml GPU configuration
```

## Backup & Recovery

### Database Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U deepfake_admin deepfake_detection > backup.sql

# Restore from backup
docker-compose exec -T postgres psql -U deepfake_admin deepfake_detection < backup.sql
```

### Volume Backup

```bash
# Backup PostgreSQL volume
docker run --rm -v deepscan_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz /data

# Restore from backup
docker run --rm -v deepscan_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres-backup.tar.gz -C /
```

## Performance Optimization

### Database

```sql
-- Create indexes
CREATE INDEX idx_analysis_results_score ON analysis_results(overall_score);
CREATE INDEX idx_analysis_jobs_created ON analysis_jobs(created_at);

-- Vacuum and analyze
VACUUM ANALYZE;
```

### Redis

```bash
# Monitor Redis memory
docker-compose exec redis redis-cli INFO memory

# Enable persistence
docker-compose exec redis redis-cli CONFIG SET save "900 1 300 10 60 10000"
```

---

For additional support, visit https://github.com/deepscan/deepscan or contact support@deepscan.ai
