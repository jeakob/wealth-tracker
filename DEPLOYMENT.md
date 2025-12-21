# Wealth Tracker - Deployment Guide

## API URL Configuration

The `API_URL` environment variable determines where the frontend connects to the backend API. This needs to be configured differently based on your deployment scenario.

---

## Deployment Scenarios

### 1. **Local Development (Default)**

For running on your local machine:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Configuration**: Uses default `API_URL=http://localhost:4000`
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Works because both services are exposed on your host machine

---

### 2. **Production with Public Domain**

For deploying to a server with a domain name:

#### Option A: Separate API Subdomain
```bash
API_URL=https://api.yourdomain.com docker-compose -f docker-compose.prod.yml up -d
```

**Setup**:
- Frontend: https://yourdomain.com (port 3000)
- Backend: https://api.yourdomain.com (port 4000)
- Configure DNS A records for both domains
- Use reverse proxy (nginx/traefik) with SSL certificates

#### Option B: Same Domain with Path
```bash
API_URL=https://yourdomain.com/api docker-compose -f docker-compose.prod.yml up -d
```

**Setup**:
- Frontend: https://yourdomain.com
- Backend: https://yourdomain.com/api
- Use reverse proxy to route `/api` to backend:4000

---

### 3. **Production with IP Address**

If you don't have a domain:

```bash
API_URL=http://YOUR_SERVER_IP:4000 docker-compose -f docker-compose.prod.yml up -d
```

**Configuration**:
- Frontend: http://YOUR_SERVER_IP:3000
- Backend: http://YOUR_SERVER_IP:4000
- ⚠️ Not recommended for production (no HTTPS)

---

## Recommended Production Setup (with Nginx)

### Step 1: Create nginx configuration

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Step 2: Deploy with correct API URL

```bash
API_URL=https://yourdomain.com/api docker-compose -f docker-compose.prod.yml up -d
```

### Step 3: Setup SSL with Let's Encrypt

```bash
sudo certbot --nginx -d yourdomain.com
```

---

## Quick Start Commands

### Local Testing
```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Production Deployment
```bash
# Deploy with custom API URL
API_URL=https://api.yourdomain.com docker-compose -f docker-compose.prod.yml up -d

# Or create a .env file
echo "API_URL=https://api.yourdomain.com" > .env
docker-compose -f docker-compose.prod.yml up -d
```

---

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `API_URL` | `http://localhost:4000` | Backend API endpoint URL |
| `POSTGRES_PASSWORD` | `securepassword` | Database password (change in production!) |
| `JWT_SECRET` | `your_jwt_secret` | JWT signing secret (change in production!) |

---

## Security Checklist for Production

- [ ] Change `POSTGRES_PASSWORD` to a strong password
- [ ] Change `JWT_SECRET` to a random string
- [ ] Use HTTPS (SSL/TLS certificates)
- [ ] Configure firewall to restrict database port (5432)
- [ ] Use environment variables or secrets management
- [ ] Enable CORS only for your domain
- [ ] Regular backups of database volume

---

## Troubleshooting

### Assets not saving
**Problem**: Frontend can't connect to backend
**Solution**: Check that `API_URL` matches your backend's public URL

### CORS errors
**Problem**: Browser blocks requests due to CORS policy
**Solution**: Configure backend CORS to allow your frontend domain

### Database connection failed
**Problem**: Backend can't connect to database
**Solution**: Ensure database service is running and `DATABASE_URL` is correct

---

## Support

For issues or questions, check the logs:
```bash
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs db
```
