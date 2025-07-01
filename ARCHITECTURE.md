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
**Selected Stack: Vercel + Railway**
- **Frontend:** Vercel
- **Backend:** Railway (Node.js + Socket.IO + Fastify)
- **Database:** Railway PostgreSQL
- **Real-time:** Socket.IO WebSockets

### Rationale for Backend Choice

**Why Railway instead of Supabase Edge Functions:**

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
| **Railway** ⭐ | ✅ Excellent | ✅ Native | ⭐⭐⭐⭐⭐ | ✅ Yes | ✅ PostgreSQL | Git-based |
| **Render** | ✅ Excellent | ✅ Native | ⭐⭐⭐⭐ | ❌ Sleeps 15min | ✅ PostgreSQL | Git-based |
| **Heroku** | ✅ Excellent | ✅ Native | ⭐⭐ | ❌ No free tier | ✅ Add-ons | Git-based |
| **Vercel + Supabase** | ⚠️ Edge Functions | ❌ Incompatible | ⭐⭐⭐⭐⭐ | ✅ Yes | ✅ PostgreSQL | Git-based |

#### Detailed Platform Analysis

**1. Railway** ⭐ **SELECTED**
- ✅ **Pros:**
  - **Best free tier for Node.js**: $5/month credit covers most small-medium apps
  - **Excellent WebSocket support**: Native Socket.IO compatibility, no configuration needed
  - **Zero-config deployments**: Connect GitHub repo, auto-deploys on push
  - **Included PostgreSQL**: Database included in free tier (1GB storage, 1GB RAM)
  - **Always-on services**: No sleeping, maintains WebSocket connections
  - **Environment variables**: Easy secret management and configuration
  - **Real-time logs**: Built-in monitoring and debugging tools
  - **Auto-scaling**: Handles traffic spikes automatically
  - **Same datacenter**: Database and backend co-located for low latency

- ❌ **Cons:**
  - **Newer platform**: Less mature than Heroku (founded 2020)
  - **Credit limit**: $5/month free tier limit (pay-as-you-go after)
  - **Limited regions**: Fewer deployment regions than major cloud providers

- 💰 **Pricing:**
  - **Free tier**: $5/month usage credit (covers ~0.1 vCPU, 0.1GB RAM + database)
  - **Pay-as-you-go**: $0.000463/GB-sec RAM, $0.000231/vCPU-sec
  - **PostgreSQL**: Included in usage credit

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
- Setup Railway project with Node.js + PostgreSQL
- Configure GitHub integration for auto-deployment

**Phase 2: Database Integration**
- Add PostgreSQL connection to server
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
- Deploy to Vercel (frontend) and Railway (backend/database)
- Environment variable management
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

## Future ADRs
- ADR-003: Authentication Strategy (Railway Auth vs Custom vs Third-party)
- ADR-004: State Management (Context vs Redux vs Zustand)  
- ADR-005: Database Schema Design for Message Persistence
- ADR-006: Performance Optimization Strategies

---

*Last updated: 2025-06-30*