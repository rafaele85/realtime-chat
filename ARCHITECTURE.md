# Architecture Decision Records (ADR)

## Overview
This document captures key architectural decisions made for the realtime chat application, including the rationale, alternatives considered, and trade-offs evaluated.

---

## ADR-001: Deployment Platform Selection

**Date:** 2025-06-30  
**Status:** Decided  
**Deciders:** Development Team  

### Context
Need to select deployment platforms for frontend, backend, and database that provide:
- Low cost / free tier options
- Reliable performance for real-time chat application
- Ease of deployment and maintenance
- Scalability for future growth

### Decision
**Selected Stack: Vercel + GCP + Supabase**
- **Frontend:** Vercel
- **Backend:** GCP Compute Engine e2-micro (Node.js + Socket.IO + Fastify)
- **Database:** Supabase PostgreSQL (free tier)
- **Real-time:** Socket.IO WebSockets

### Rationale for Backend Choice

**Why Google Cloud Platform instead of Railway:**

**Cost Effectiveness:**
- Railway's $5 credit expires after 30 days, making it unsuitable for long-term projects
- GCP provides generous always-free tier with e2-micro instances (1 vCPU shared, 1GB memory)
- GCP free tier includes 30GB standard persistent disk and 5GB snapshot storage
- No expiration on GCP's always-free tier resources

**Why GCP instead of Supabase Edge Functions:**

**Technical Compatibility:**
- Our existing Socket.IO server requires persistent WebSocket connections
- Supabase Edge Functions are stateless and short-lived (incompatible with Socket.IO)
- Converting to Supabase real-time would require complete rewrite of real-time logic

**Development Consistency:**
- Same codebase runs locally, in CI/CD, and production
- No need to maintain separate implementations
- Faster development and easier debugging

**Single-Vendor Architecture:**
- Database and backend in same datacenter (low latency)
- No cross-vendor network connections or security complexity
- Simpler deployment, monitoring, and billing
- Better utilization of Railway's $5/month free credit

### Alternatives Considered

#### Backend Hosting Platform Comparison

| Platform | Node.js Support | WebSocket Support | Free Tier Quality | Always-On | Database Included | Deployment |
|----------|-----------------|-------------------|-------------------|-----------|-------------------|------------|
| **Google Cloud Platform** ⭐ | ✅ Excellent | ✅ Native | ⭐⭐⭐⭐⭐ | ✅ Yes | ✅ Cloud SQL | VM/Container |
| **Railway** | ✅ Excellent | ✅ Native | ⭐⭐⭐ | ✅ Yes | ✅ PostgreSQL | Git-based |
| **Render** | ✅ Excellent | ✅ Native | ⭐⭐⭐⭐ | ❌ Sleeps 15min | ✅ PostgreSQL | Git-based |
| **Heroku** | ✅ Excellent | ✅ Native | ⭐⭐ | ❌ No free tier | ✅ Add-ons | Git-based |
| **Vercel + Supabase** | ⚠️ Edge Functions | ❌ Incompatible | ⭐⭐⭐⭐⭐ | ✅ Yes | ✅ PostgreSQL | Git-based |

#### Detailed Platform Analysis

**1. Google Cloud Platform** ⭐ **SELECTED**
- ✅ **Pros:**
  - **Permanent free tier**: e2-micro instance always free (no expiration)
  - **Excellent WebSocket support**: Native Socket.IO compatibility on Compute Engine
  - **Generous resources**: 1 shared vCPU, 1GB memory, 30GB persistent disk
  - **Mature platform**: Enterprise-grade reliability and extensive documentation
  - **Always-on services**: No sleeping, maintains WebSocket connections
  - **Advanced features**: Load balancing, auto-scaling, monitoring included
  - **Global network**: Low latency worldwide with multiple regions
  - **Hybrid approach**: Combine GCP compute with Supabase database for optimal cost/features
  - **Best of both worlds**: Enterprise-grade compute with generous database free tier

- ❌ **Cons:**
  - **Learning curve**: More complex setup than simple PaaS solutions
  - **Manual configuration**: Requires VM setup, networking, and security configuration
  - **Database costs**: Cloud SQL not included in free tier (solved by using Supabase)

- 💰 **Pricing:**
  - **Free tier**: 1 e2-micro instance always free (744 hours/month)
  - **Storage**: 30GB standard persistent disk always free
  - **Networking**: 1GB outbound transfer/month always free
  - **Database**: Supabase free tier (500MB, 50MB file uploads, 2GB bandwidth)

**2. Render**
- ✅ **Pros:**
  - **Good free tier**: 750 hours/month compute time
  - **Native WebSocket support**: Works out of the box with Socket.IO
  - **Auto-deploy from GitHub**: Simple Git-based deployment
  - **Free SSL**: Automatic HTTPS certificates
  - **PostgreSQL included**: Free database tier available

- ❌ **Cons:**
  - **Services sleep**: Free tier sleeps after 15 minutes of inactivity
  - **Cold start delays**: 30+ seconds to wake up, breaks WebSocket connections
  - **Limited compute**: 0.5 CPU, 512MB RAM on free tier
  - **Poor for real-time**: Sleeping breaks persistent connections

- 💰 **Pricing:**
  - **Free tier**: 750 hours/month, but services sleep
  - **Always-on**: $7/month minimum for persistent services

**3. Heroku**
- ✅ **Pros:**
  - **Mature platform**: 15+ years, very stable and well-documented
  - **Excellent add-on ecosystem**: Redis, monitoring, etc.
  - **WebSocket support**: Works well with Socket.IO

- ❌ **Cons:**
  - **No free tier**: Removed November 2022
  - **Expensive**: $7/month minimum for basic dyno
  - **Services still sleep**: Even paid dynos sleep without traffic

**4. Vercel + Supabase (Original Plan)**
- ✅ **Pros:**
  - **Excellent for static sites**: Best-in-class frontend hosting
  - **Great database features**: Supabase provides auth, APIs, real-time

- ❌ **Cons:**
  - **Edge Functions incompatible**: Can't run persistent WebSocket servers
  - **Would require complete rewrite**: Converting Socket.IO to Supabase real-time
  - **Cross-vendor complexity**: Managing services across multiple platforms

**5. AWS Free Tier**
- ✅ **Pros:**
  - Comprehensive services (S3, CloudFront, EC2, Lambda, RDS)
  - 750 hours/month EC2 t2.micro
  - 1TB CloudFront data transfer
  - Industry standard, highly scalable
- ❌ **Cons:**
  - High complexity, steep learning curve
  - Manual setup and configuration required
  - Costs escalate quickly after free tier
  - 12-month time limit on free tier
  - Real-time features require additional services (API Gateway WebSocket)

**5. Google Cloud Platform**
- ✅ **Pros:**
  - f1-micro Compute Engine instance always free
  - Cloud Functions with 2M invocations/month
  - Firestore with real-time capabilities
  - Good integration between services
- ❌ **Cons:**
  - Cloud SQL not in always-free tier
  - Complex networking and security setup
  - Requires GCP expertise
  - Limited storage in free tier (1GB Firestore)

### Implementation Plan

**Phase 1: Basic Setup**
- Deploy React client to Vercel
- Setup GCP Compute Engine e2-micro instance with Node.js
- Setup Supabase project with PostgreSQL database
- Configure CI/CD for auto-deployment

**Phase 2: Database Integration**
- Add Supabase PostgreSQL connection to server
- Implement message persistence schema
- Update real-time messaging to use database

**Phase 3: Production Ready**
- Custom domains and SSL
- Performance monitoring and logging
- CI/CD pipeline integration
- Backup strategies

### Success Metrics
- Deployment time < 5 minutes
- Zero cold start issues for real-time features
- Free tier sustainability for development/testing
- Easy scaling path for production use

---

## ADR-002: CI/CD Implementation Plan

**Date:** 2025-06-30  
**Status:** Planned  
**Deciders:** Development Team  

### Implementation Phases

#### **Phase 1: Basic CI Pipeline**
**What we'll build:**
1. **GitHub Actions Workflow** - `.github/workflows/ci.yml`
2. **Quality Gates Pipeline:**
   - Install dependencies (all workspaces)
   - TypeScript checks (shared, client, server)
   - ESLint checks (all packages)
   - Jest unit tests (client + server)
   - Playwright E2E tests
   - Production build verification

**Key Features:**
- Trigger on PRs and pushes to master
- Node.js version matrix for compatibility
- Dependency caching for performance
- Parallel jobs where possible
- Clear failure reporting

**Benefits:**
- Catch issues before they reach main branch
- Ensure all tests pass in clean environment
- Verify builds work across Node versions
- Automated quality enforcement

#### **Phase 2: Advanced CI Features**

**2.1 Code Quality Metrics**
- Code coverage reporting
- Bundle size analysis for client
- Performance regression detection
- Dependency vulnerability scanning

**2.2 Branch Protection**
- Require CI checks to pass before merge
- Require up-to-date branches
- Dismiss stale reviews on new commits
- Prevent direct pushes to main

**2.3 PR Automation**
- Automated labeling based on changed files
- Comment with test results and coverage
- Auto-assign reviewers based on CODEOWNERS

#### **Phase 3: Deployment Pipeline (CD)**

**3.1 Environment Strategy**
- **Development**: Auto-deploy feature branches to preview environments
- **Staging**: Auto-deploy main branch for integration testing
- **Production**: Manual approval or tagged releases

**3.2 Containerization**
- Docker containers for client and server
- Multi-stage builds for optimization
- Health checks and readiness probes

**3.3 Deployment Automation**
- Deploy to Vercel (frontend) and GCP Compute Engine (backend)
- Environment variable management for Supabase connection
- Rollback capabilities

#### **Phase 4: Monitoring & Observability**

**4.1 Application Monitoring**
- Health check endpoints
- Application metrics (response times, error rates)
- Real-time monitoring dashboards

**4.2 CI/CD Monitoring**
- Build time tracking
- Success/failure rate metrics
- Notification channels (Slack, Discord)

### Notification Strategy

**Slack Integration:**
- GitHub Actions Slack app
- Custom webhook for detailed build reports
- Separate channels: #ci-builds, #deployments

**Discord Integration:**
- Discord webhook integration
- Embed rich messages with build status
- Bot commands for deployment triggers

### Implementation Priority

**High Priority (Immediate Value)**
1. Basic CI pipeline with quality gates
2. Slack and Discord notifications
3. Branch protection rules
4. Build verification

**Medium Priority (Enhanced DX)**
5. Code coverage and metrics
6. PR automation features
7. Performance monitoring

**Lower Priority (Production Ready)**
8. Full CD pipeline with environments
9. Comprehensive monitoring
10. Advanced deployment strategies

### Estimated Timeline
- **Phase 1**: 1-2 sessions (Core CI)
- **Phase 2**: 1 session (Advanced CI)  
- **Phase 3**: 2-3 sessions (CD Pipeline)
- **Phase 4**: 1 session (Monitoring)

---

---

## ADR-003: GCP Migration Plan

**Date:** 2025-07-01  
**Status:** Planned  
**Deciders:** Development Team  

### Migration Overview
Complete migration from Railway (planned but not implemented) to Google Cloud Platform with Supabase database.

### Migration Steps

#### **Phase 1: Infrastructure Setup (2-3 hours)**

**1.1 GCP Project Setup**
- Create new GCP project: `chat-app-production`
- Enable required APIs:
  - Compute Engine API
  - Cloud Build API
  - Cloud Run API (for future containerization)
  - Cloud Storage API
- Setup billing account (free tier usage)

**1.2 Compute Engine Instance**
- Create e2-micro instance (always free)
- Region: us-central1-a (lowest latency)
- OS: Ubuntu 22.04 LTS
- Disk: 30GB standard persistent disk
- Network: Allow HTTP/HTTPS traffic
- Firewall: Custom port for Socket.IO (default 3001)

**1.3 Supabase Database Setup**
- Create new Supabase project
- Configure PostgreSQL database
- Setup environment variables for connection
- Create initial database schema for messages

#### **Phase 2: Server Configuration (2-4 hours)**

**2.1 Server Environment Setup**
```bash
# SSH into GCP instance
gcloud compute ssh chat-app-instance

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install git and clone repository
sudo apt-get update && sudo apt-get install -y git
git clone https://github.com/your-repo/chat-app.git
cd chat-app
```

**2.2 Application Deployment**
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Setup environment variables
cp .env.example .env
# Configure SUPABASE_URL, SUPABASE_ANON_KEY, etc.

# Start with PM2
pm2 start server/dist/index.js --name chat-server
pm2 startup
pm2 save
```

**2.3 Reverse Proxy & SSL**
```bash
# Install Nginx
sudo apt-get install -y nginx

# Configure Nginx for reverse proxy
sudo nano /etc/nginx/sites-available/chat-app

# Setup SSL with Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

#### **Phase 3: Database Migration (1-2 hours)**

**3.1 Database Schema Creation**
```sql
-- Create messages table in Supabase
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    user_id TEXT NOT NULL,
    room_id TEXT NOT NULL DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_messages_room_created ON messages(room_id, created_at DESC);
CREATE INDEX idx_messages_user ON messages(user_id);
```

**3.2 Application Database Connection**
```typescript
// Update server database configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)
```

#### **Phase 4: CI/CD Pipeline Update (1-2 hours)**

**4.1 GitHub Actions Workflow**
Create `.github/workflows/deploy-gcp.yml`:
```yaml
name: Deploy to GCP

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GCP
      run: |
        # Setup gcloud CLI
        # Copy files to GCP instance
        # Restart PM2 processes
```

**4.2 Environment Variables**
Configure GitHub secrets:
- `GCP_PROJECT_ID`
- `GCP_INSTANCE_NAME`
- `GCP_ZONE`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SSH_PRIVATE_KEY`

#### **Phase 5: Testing & Validation (1 hour)**

**5.1 Functionality Testing**
- [ ] WebSocket connections work correctly
- [ ] Message persistence to Supabase
- [ ] Real-time message broadcasting
- [ ] Frontend-backend communication
- [ ] SSL/HTTPS working properly

**5.2 Performance Testing**
- [ ] Load testing with multiple concurrent users
- [ ] Database query performance
- [ ] Memory usage monitoring
- [ ] Response time measurements

#### **Phase 6: DNS & Domain Setup (30 minutes)**

**6.1 Domain Configuration**
- Point domain to GCP instance external IP
- Configure A record: `chat.yourdomain.com → GCP_EXTERNAL_IP`
- Verify SSL certificate installation

### Migration Checklist

**Pre-Migration:**
- [ ] Backup any existing data
- [ ] Test Supabase connection locally
- [ ] Verify GCP free tier limits

**Migration:**
- [ ] Create GCP project and enable APIs
- [ ] Launch e2-micro Compute Engine instance
- [ ] Install Node.js, PM2, Nginx
- [ ] Clone repository and install dependencies
- [ ] Configure environment variables
- [ ] Setup Supabase database schema
- [ ] Deploy application with PM2
- [ ] Configure Nginx reverse proxy
- [ ] Setup SSL with Let's Encrypt
- [ ] Update GitHub Actions workflow
- [ ] Test all functionality

**Post-Migration:**
- [ ] Monitor application performance
- [ ] Setup monitoring and logging
- [ ] Document new deployment process
- [ ] Update team on new infrastructure

### Cost Analysis

**Monthly Costs:**
- **GCP Compute Engine**: $0 (e2-micro always free)
- **GCP Storage**: $0 (30GB always free)
- **GCP Networking**: $0 (1GB egress always free)
- **Supabase Database**: $0 (free tier: 500MB, 50MB uploads)
- **Domain**: ~$12/year (optional)

**Total: $0/month** (vs Railway $5/month for 30 days)

### Rollback Plan

If migration fails:
1. Keep existing local development setup
2. Revert DNS changes
3. Use current Vercel frontend with localhost backend
4. Document issues for future migration attempt

### Success Metrics

- [ ] Application running 24/7 without sleeping
- [ ] WebSocket connections stable
- [ ] Database queries under 100ms
- [ ] Zero cost for first 6 months
- [ ] Successful automated deployments

---

## Future ADRs
- ADR-004: Authentication Strategy (GCP vs Supabase Auth vs Custom)
- ADR-005: State Management (Context vs Redux vs Zustand)  
- ADR-006: Database Schema Design for Message Persistence
- ADR-007: Performance Optimization Strategies

---

*Last updated: 2025-07-01*