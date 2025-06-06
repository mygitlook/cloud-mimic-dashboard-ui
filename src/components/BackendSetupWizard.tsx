import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Download, 
  Database, 
  Server, 
  Code, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Cpu,
  Shield,
  Users,
  CreditCard,
  BarChart3,
  HardDrive,
  GitBranch,
  Globe
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AnalyzedEndpoint {
  path: string
  method: string
  description: string
  params?: string[]
  body?: object
  response?: object
}

interface DatabaseTable {
  name: string
  columns: Array<{
    name: string
    type: string
    nullable: boolean
    primary?: boolean
    foreign?: boolean
  }>
}

interface BackendStructure {
  endpoints: AnalyzedEndpoint[]
  database: DatabaseTable[]
  dependencies: string[]
  environment: string[]
  appName: string
  repoUrl: string
}

export default function BackendSetupWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [repoUrl, setRepoUrl] = useState("")
  const [backendStructure, setBackendStructure] = useState<BackendStructure | null>(null)
  const { toast } = useToast()

  const analyzeGitRepository = async () => {
    if (!repoUrl.trim()) {
      toast({
        title: "Repository URL Required",
        description: "Please enter a valid Git repository URL",
        variant: "destructive"
      })
      return
    }

    setIsAnalyzing(true)
    
    try {
      // Simulate fetching and analyzing the repository
      await new Promise(resolve => setTimeout(resolve, 4000))
      
      // Extract app name from repo URL
      const appName = repoUrl.split('/').pop()?.replace('.git', '') || 'frontend-app'
      
      // Mock analysis based on repo URL - in real implementation, this would fetch and analyze the actual repo
      const mockBackendStructure: BackendStructure = {
        appName,
        repoUrl,
        endpoints: [
          {
            path: "/api/auth/login",
            method: "POST",
            description: "User authentication",
            body: { email: "string", password: "string" },
            response: { user: "object", token: "string" }
          },
          {
            path: "/api/auth/register",
            method: "POST", 
            description: "User registration",
            body: { email: "string", password: "string", firstName: "string", lastName: "string" },
            response: { user: "object", token: "string" }
          },
          {
            path: "/api/users/profile",
            method: "GET",
            description: "Get user profile",
            response: { user: "object" }
          },
          {
            path: "/api/users/profile",
            method: "PUT",
            description: "Update user profile",
            body: { firstName: "string", lastName: "string", email: "string" },
            response: { user: "object" }
          },
          {
            path: "/api/data",
            method: "GET",
            description: "Get application data",
            params: ["limit", "offset", "filter"],
            response: { data: "array", total: "number" }
          },
          {
            path: "/api/data",
            method: "POST",
            description: "Create new data entry",
            body: { title: "string", content: "string", category: "string" },
            response: { data: "object" }
          },
          {
            path: "/api/upload",
            method: "POST",
            description: "File upload endpoint",
            body: { file: "multipart/form-data" },
            response: { url: "string", filename: "string" }
          },
          {
            path: "/api/notifications",
            method: "GET",
            description: "Get user notifications",
            response: { notifications: "array" }
          }
        ],
        database: [
          {
            name: "users",
            columns: [
              { name: "id", type: "UUID", nullable: false, primary: true },
              { name: "email", type: "VARCHAR(255)", nullable: false },
              { name: "password_hash", type: "VARCHAR(255)", nullable: false },
              { name: "first_name", type: "VARCHAR(100)", nullable: true },
              { name: "last_name", type: "VARCHAR(100)", nullable: true },
              { name: "avatar_url", type: "TEXT", nullable: true },
              { name: "email_verified", type: "BOOLEAN", nullable: false },
              { name: "created_at", type: "TIMESTAMP", nullable: false },
              { name: "updated_at", type: "TIMESTAMP", nullable: false }
            ]
          },
          {
            name: "data_entries",
            columns: [
              { name: "id", type: "UUID", nullable: false, primary: true },
              { name: "user_id", type: "UUID", nullable: false, foreign: true },
              { name: "title", type: "VARCHAR(255)", nullable: false },
              { name: "content", type: "TEXT", nullable: true },
              { name: "category", type: "VARCHAR(100)", nullable: true },
              { name: "status", type: "VARCHAR(50)", nullable: false },
              { name: "created_at", type: "TIMESTAMP", nullable: false },
              { name: "updated_at", type: "TIMESTAMP", nullable: false }
            ]
          },
          {
            name: "notifications",
            columns: [
              { name: "id", type: "UUID", nullable: false, primary: true },
              { name: "user_id", type: "UUID", nullable: false, foreign: true },
              { name: "title", type: "VARCHAR(255)", nullable: false },
              { name: "message", type: "TEXT", nullable: false },
              { name: "type", type: "VARCHAR(50)", nullable: false },
              { name: "read", type: "BOOLEAN", nullable: false },
              { name: "created_at", type: "TIMESTAMP", nullable: false }
            ]
          },
          {
            name: "files",
            columns: [
              { name: "id", type: "UUID", nullable: false, primary: true },
              { name: "user_id", type: "UUID", nullable: false, foreign: true },
              { name: "filename", type: "VARCHAR(255)", nullable: false },
              { name: "original_name", type: "VARCHAR(255)", nullable: false },
              { name: "mime_type", type: "VARCHAR(100)", nullable: false },
              { name: "size", type: "BIGINT", nullable: false },
              { name: "url", type: "TEXT", nullable: false },
              { name: "created_at", type: "TIMESTAMP", nullable: false }
            ]
          }
        ],
        dependencies: [
          "express",
          "typescript", 
          "cors",
          "helmet",
          "bcryptjs",
          "jsonwebtoken",
          "pg",
          "multer",
          "dotenv",
          "compression",
          "express-rate-limit",
          "@types/node",
          "@types/express",
          "@types/cors",
          "@types/bcryptjs",
          "@types/jsonwebtoken",
          "@types/pg",
          "@types/multer"
        ],
        environment: [
          "DATABASE_URL",
          "JWT_SECRET", 
          "JWT_EXPIRES_IN",
          "PORT",
          "NODE_ENV",
          "CORS_ORIGIN",
          "UPLOAD_PATH",
          "MAX_FILE_SIZE",
          "RATE_LIMIT_WINDOW_MS",
          "RATE_LIMIT_MAX_REQUESTS"
        ]
      }
      
      setBackendStructure(mockBackendStructure)
      setIsAnalyzing(false)
      setAnalysisComplete(true)
      setCurrentStep(2)
      
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${appName} repository!`
      })
    } catch (error) {
      setIsAnalyzing(false)
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the repository. Please check the URL and try again.",
        variant: "destructive"
      })
    }
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Content copied to clipboard"
    })
  }

  const downloadBackendPackage = () => {
    if (!backendStructure) return
    
    const files = {
      'package.json': generatePackageJson(),
      'src/index.ts': generateServerCode(),
      'schema.sql': generateDatabaseSchema(),
      'Dockerfile': generateDockerfile(),
      'nginx.conf': generateNginxConfig(),
      '.env.example': generateEnvFile(),
      'ecosystem.config.js': generatePM2Config(),
      'deployment-guide.md': generateDeploymentGuide(),
      'README.md': generateReadme()
    }
    
    // Create a zip-like structure as a downloadable text file
    let zipContent = `# Backend Package for ${backendStructure.appName}\n\n`
    
    Object.entries(files).forEach(([filename, content]) => {
      zipContent += `## ${filename}\n\`\`\`\n${content}\n\`\`\`\n\n`
    })
    
    const blob = new Blob([zipContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${backendStructure.appName}-backend-package.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Download Started",
      description: "Backend package has been downloaded successfully!"
    })
  }

  const generatePackageJson = () => {
    if (!backendStructure) return ""
    
    return JSON.stringify({
      "name": `${backendStructure.appName}-backend`,
      "version": "1.0.0",
      "description": `Auto-generated backend API for ${backendStructure.appName}`,
      "main": "dist/index.js",
      "scripts": {
        "build": "tsc",
        "start": "node dist/index.js",
        "dev": "ts-node src/index.ts",
        "watch": "nodemon src/index.ts",
        "test": "jest"
      },
      "dependencies": backendStructure.dependencies.reduce((acc, dep) => {
        acc[dep] = "latest"
        return acc
      }, {} as Record<string, string>),
      "devDependencies": {
        "nodemon": "latest",
        "ts-node": "latest",
        "jest": "latest",
        "@types/jest": "latest"
      }
    }, null, 2)
  }

  const generateServerCode = () => {
    if (!backendStructure) return ""
    
    return `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.'
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || './uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Auth middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

${backendStructure.endpoints.map(endpoint => `
// ${endpoint.description}
app.${endpoint.method.toLowerCase()}('${endpoint.path}', ${endpoint.path.includes('/auth/') ? '' : 'authenticateToken, '}${endpoint.path.includes('/upload') ? 'upload.single("file"), ' : ''}async (req, res) => {
  try {
    // TODO: Implement ${endpoint.description.toLowerCase()}
    res.json({ 
      message: '${endpoint.description} endpoint - implementation needed',
      method: '${endpoint.method}',
      path: '${endpoint.path}'
    });
  } catch (error) {
    console.error('Error in ${endpoint.path}:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});`).join('')}

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(port, () => {
  console.log(\`🚀 Server running on port \${port}\`);
  console.log(\`📊 Health check: http://localhost:\${port}/health\`);
});

export default app;`
  }

  const generateDatabaseSchema = () => {
    if (!backendStructure) return ""
    
    return `-- Database schema for ${backendStructure.appName}
-- Generated from repository: ${backendStructure.repoUrl}

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

${backendStructure.database.map(table => `
-- ${table.name} table
CREATE TABLE ${table.name} (
${table.columns.map(col => 
  `  ${col.name} ${col.type}${col.nullable ? '' : ' NOT NULL'}${col.primary ? ' PRIMARY KEY DEFAULT uuid_generate_v4()' : ''}${col.foreign ? ` REFERENCES ${col.name.replace('_id', '')}(id) ON DELETE CASCADE` : ''}`
).join(',\n')}
);

-- Indexes for ${table.name}
${table.columns.filter(col => col.foreign).map(col => 
  `CREATE INDEX idx_${table.name}_${col.name} ON ${table.name}(${col.name});`
).join('\n')}
`).join('\n')}

-- Insert default data if needed
-- INSERT INTO users (email, password_hash, first_name, last_name, email_verified) 
-- VALUES ('admin@example.com', '$2a$10$...', 'Admin', 'User', true);`
  }

  const generateDockerfile = () => {
    return `# Multi-stage build for ${backendStructure?.appName || 'backend'}
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

# Copy built application
COPY --from=builder --chown=backend:nodejs /app/dist ./dist
COPY --from=builder --chown=backend:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=backend:nodejs /app/package*.json ./

# Create uploads directory
RUN mkdir -p uploads && chown backend:nodejs uploads

USER backend

EXPOSE 3001

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]`
  }

  const generateNginxConfig = () => {
    return `server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Frontend (React app)
    location / {
        root /var/www/${backendStructure?.appName || 'frontend'}/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001/health;
        access_log off;
    }
}`
  }

  const generateEnvFile = () => {
    if (!backendStructure) return ""
    
    return backendStructure.environment.map(env => {
      switch (env) {
        case 'DATABASE_URL':
          return `${env}=postgresql://username:password@localhost:5432/${backendStructure.appName}_db`
        case 'JWT_SECRET':
          return `${env}=your_super_secret_jwt_key_here_at_least_32_characters`
        case 'JWT_EXPIRES_IN':
          return `${env}=7d`
        case 'PORT':
          return `${env}=3001`
        case 'NODE_ENV':
          return `${env}=production`
        case 'CORS_ORIGIN':
          return `${env}=https://your-domain.com`
        default:
          return `${env}=your_${env.toLowerCase()}_here`
      }
    }).join('\n')
  }

  const generatePM2Config = () => {
    return `module.exports = {
  apps: [{
    name: '${backendStructure?.appName || 'backend'}-api',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '1G'
  }]
}`
  }

  const generateDeploymentGuide = () => {
    return `# Deployment Guide for ${backendStructure?.appName || 'Your App'}

## Prerequisites
- Ubuntu 20.04+ server
- Node.js 18+
- PostgreSQL 13+
- Nginx
- PM2
- Git

## Quick Setup Commands

### 1. Database Setup
\`\`\`bash
sudo -u postgres psql
CREATE DATABASE ${backendStructure?.appName || 'your_app'}_db;
CREATE USER ${backendStructure?.appName || 'your_app'}_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ${backendStructure?.appName || 'your_app'}_db TO ${backendStructure?.appName || 'your_app'}_user;
\\q
\`\`\`

### 2. Import Database Schema
\`\`\`bash
psql -U ${backendStructure?.appName || 'your_app'}_user -d ${backendStructure?.appName || 'your_app'}_db -f schema.sql
\`\`\`

### 3. Backend Deployment
\`\`\`bash
# Create backend directory
sudo mkdir -p /opt/${backendStructure?.appName || 'your_app'}-backend
cd /opt/${backendStructure?.appName || 'your_app'}-backend

# Upload all backend files here
# Install dependencies
npm install

# Build the application
npm run build

# Set up environment
cp .env.example .env
# Edit .env with your actual values
nano .env

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
\`\`\`

### 4. Frontend Deployment
\`\`\`bash
# Clone your frontend repository
git clone ${backendStructure?.repoUrl || 'your-repo-url'} /opt/${backendStructure?.appName || 'your_app'}-frontend
cd /opt/${backendStructure?.appName || 'your_app'}-frontend

# Install and build
npm install
npm run build

# Copy build to web directory
sudo mkdir -p /var/www/${backendStructure?.appName || 'your_app'}
sudo cp -r dist/* /var/www/${backendStructure?.appName || 'your_app'}/
\`\`\`

### 5. Nginx Configuration
\`\`\`bash
sudo cp nginx.conf /etc/nginx/sites-available/${backendStructure?.appName || 'your_app'}
sudo ln -s /etc/nginx/sites-available/${backendStructure?.appName || 'your_app'} /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
\`\`\`

### 6. SSL Certificate (Optional)
\`\`\`bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
\`\`\`

## Monitoring

### Check Backend Status
\`\`\`bash
pm2 status
pm2 logs ${backendStructure?.appName || 'backend'}-api
\`\`\`

### Check Database
\`\`\`bash
psql -U ${backendStructure?.appName || 'your_app'}_user -d ${backendStructure?.appName || 'your_app'}_db -c "SELECT version();"
\`\`\`

### Check Nginx
\`\`\`bash
sudo nginx -t
sudo systemctl status nginx
\`\`\`

## Troubleshooting

1. **Backend not starting**: Check logs with \`pm2 logs\`
2. **Database connection issues**: Verify DATABASE_URL in .env
3. **Frontend not loading**: Check Nginx configuration and file permissions
4. **API calls failing**: Verify CORS_ORIGIN setting

## Security Checklist

- [ ] Change default passwords
- [ ] Set up firewall (ufw)
- [ ] Configure SSL certificate
- [ ] Set up regular database backups
- [ ] Monitor log files
- [ ] Update system packages regularly

For support, refer to the generated README.md file.`
  }

  const generateReadme = () => {
    return `# ${backendStructure?.appName || 'Your App'} Backend

Auto-generated backend API for your frontend application.

## Generated From
- Repository: ${backendStructure?.repoUrl || 'N/A'}
- Generated: ${new Date().toISOString()}

## Features

- ✅ RESTful API with ${backendStructure?.endpoints.length || 0} endpoints
- ✅ JWT Authentication
- ✅ PostgreSQL database with ${backendStructure?.database.length || 0} tables
- ✅ File upload support
- ✅ Rate limiting
- ✅ Security headers
- ✅ Docker support
- ✅ PM2 process management

## Quick Start

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up environment:
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your values
   \`\`\`

3. Set up database:
   \`\`\`bash
   psql -U username -d database -f schema.sql
   \`\`\`

4. Start development:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

${backendStructure?.endpoints.map(endpoint => `
### ${endpoint.method} ${endpoint.path}
${endpoint.description}
${endpoint.body ? `**Body:** \`${JSON.stringify(endpoint.body)}\`` : ''}
${endpoint.params ? `**Params:** ${endpoint.params.join(', ')}` : ''}
`).join('') || ''}

## Environment Variables

${backendStructure?.environment.map(env => `- \`${env}\`: ${env.toLowerCase().replace(/_/g, ' ')}`).join('\n') || ''}

## Deployment

See \`deployment-guide.md\` for detailed deployment instructions.

## License

MIT`
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Backend Setup Wizard</h1>
          <p className="text-muted-foreground">
            Analyze any frontend repository and generate a complete backend structure
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 3 && <div className={`w-16 h-0.5 ${currentStep > step ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}>Repository Input</span>
            <span className={currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}>Generate Backend</span>
            <span className={currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}>Deploy</span>
          </div>
        </div>

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Repository Analysis
              </CardTitle>
              <CardDescription>
                Enter a Git repository URL to analyze the frontend code and generate the required backend structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repo-url">Git Repository URL</Label>
                  <Input
                    id="repo-url"
                    placeholder="https://github.com/username/repository.git"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Supports GitHub, GitLab, Bitbucket, and other Git repositories
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-blue-500" />
                    <h3 className="font-medium">Code Analysis</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Analyze React components and API calls</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-green-500" />
                    <h3 className="font-medium">Schema Generation</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Generate PostgreSQL database schema</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="w-4 h-4 text-purple-500" />
                    <h3 className="font-medium">API Creation</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Create Express.js server with endpoints</p>
                </Card>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Globe className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">What will be analyzed?</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Frontend repository structure and dependencies</li>
                      <li>• React components and their data requirements</li>
                      <li>• API calls, fetch requests, and data flow patterns</li>
                      <li>• Authentication and user management implementations</li>
                      <li>• File upload and media handling requirements</li>
                      <li>• Environment variables and configuration needs</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                onClick={analyzeGitRepository} 
                className="w-full" 
                disabled={isAnalyzing || !repoUrl.trim()}
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Fetching and analyzing repository...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    Analyze Repository
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && backendStructure && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Analysis Complete - {backendStructure.appName}
                </CardTitle>
                <CardDescription>
                  Repository: {backendStructure.repoUrl} | Found {backendStructure.endpoints.length} API endpoints, {backendStructure.database.length} database tables, and {backendStructure.dependencies.length} dependencies
                </CardDescription>
              </CardHeader>
            </Card>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
                <TabsTrigger value="database">Database</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="config">Config</TabsTrigger>
                <TabsTrigger value="deploy">Deploy</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Server className="w-4 h-4 text-blue-500" />
                      <h3 className="font-medium">API Endpoints</h3>
                    </div>
                    <p className="text-2xl font-bold">{backendStructure.endpoints.length}</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-4 h-4 text-green-500" />
                      <h3 className="font-medium">Database Tables</h3>
                    </div>
                    <p className="text-2xl font-bold">{backendStructure.database.length}</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-purple-500" />
                      <h3 className="font-medium">Dependencies</h3>
                    </div>
                    <p className="text-2xl font-bold">{backendStructure.dependencies.length}</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-orange-500" />
                      <h3 className="font-medium">Environment Vars</h3>
                    </div>
                    <p className="text-2xl font-bold">{backendStructure.environment.length}</p>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="api" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>API Endpoints</CardTitle>
                    <CardDescription>All endpoints required by your frontend</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {backendStructure.endpoints.map((endpoint, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                                {endpoint.method}
                              </Badge>
                              <code className="bg-muted px-2 py-1 rounded text-sm">{endpoint.path}</code>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{endpoint.description}</p>
                            {endpoint.body && (
                              <div className="text-xs">
                                <span className="font-medium">Body: </span>
                                <code className="bg-muted px-1 rounded">{JSON.stringify(endpoint.body)}</code>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="database" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Database Schema</CardTitle>
                        <CardDescription>PostgreSQL tables and relationships</CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(generateDatabaseSchema())}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy SQL
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                        {generateDatabaseSchema()}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>package.json</CardTitle>
                          <CardDescription>Dependencies and scripts</CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(generatePackageJson())}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                          {generatePackageJson()}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Server Code</CardTitle>
                          <CardDescription>Express.js server with TypeScript</CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(generateServerCode())}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                          {generateServerCode()}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="config" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Dockerfile</CardTitle>
                          <CardDescription>Container configuration</CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(generateDockerfile())}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                          {generateDockerfile()}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Nginx Config</CardTitle>
                          <CardDescription>Reverse proxy setup</CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(generateNginxConfig())}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                          {generateNginxConfig()}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Environment Variables</CardTitle>
                          <CardDescription>.env file template</CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(generateEnvFile())}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                          {generateEnvFile()}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="deploy" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Deployment Guide</CardTitle>
                        <CardDescription>Step-by-step deployment instructions</CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(generateDeploymentGuide())}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Guide
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="prose prose-sm max-w-none">
                        <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                          {generateDeploymentGuide()}
                        </pre>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button onClick={() => setCurrentStep(3)} className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Download All Files
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="https://docs.lovable.dev/deployment" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Docs
                    </a>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Ready for Deployment
              </CardTitle>
              <CardDescription>
                Your backend structure is ready. Download the files and follow the deployment guide.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Generated Files</h3>
                  <div className="space-y-2">
                    {[
                      'package.json',
                      'src/index.ts',
                      'schema.sql',
                      'Dockerfile',
                      'nginx.conf',
                      '.env.example',
                      'ecosystem.config.js',
                      'deployment-guide.md',
                      'README.md'
                    ].map((file) => (
                      <div key={file} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Next Steps</h3>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                      <span>Download and extract backend files</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                      <span>Set up PostgreSQL database</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                      <span>Configure environment variables</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">4</span>
                      <span>Deploy using PM2 and Nginx</span>
                    </li>
                  </ol>
                </div>
              </div>

              <Separator />
              
              <div className="flex gap-4">
                <Button onClick={downloadBackendPackage} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download Backend Package
                </Button>
                <Button variant="outline" onClick={() => {
                  setCurrentStep(1)
                  setRepoUrl("")
                  setBackendStructure(null)
                  setAnalysisComplete(false)
                }}>
                  Analyze Another Repository
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
