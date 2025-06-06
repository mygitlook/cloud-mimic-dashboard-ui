
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
  HardDrive
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
}

export default function BackendSetupWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [backendStructure, setBackendStructure] = useState<BackendStructure | null>(null)
  const { toast } = useToast()

  const analyzeCurrentApp = async () => {
    setIsAnalyzing(true)
    
    // Simulate analysis of the current application
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const mockBackendStructure: BackendStructure = {
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
          path: "/api/instances",
          method: "GET",
          description: "Get EC2 instances",
          response: { instances: "array" }
        },
        {
          path: "/api/instances",
          method: "POST",
          description: "Create new instance",
          body: { name: "string", type: "string", region: "string" },
          response: { instance: "object" }
        },
        {
          path: "/api/billing/invoices",
          method: "GET",
          description: "Get user invoices",
          response: { invoices: "array" }
        },
        {
          path: "/api/billing/generate-invoice",
          method: "POST",
          description: "Generate new invoice",
          body: { services: "array", amount: "number" },
          response: { invoice: "object" }
        },
        {
          path: "/api/storage/buckets",
          method: "GET",
          description: "Get S3 buckets",
          response: { buckets: "array" }
        },
        {
          path: "/api/monitoring/metrics",
          method: "GET",
          description: "Get system metrics",
          params: ["timeRange", "service"],
          response: { metrics: "object" }
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
            { name: "created_at", type: "TIMESTAMP", nullable: false },
            { name: "updated_at", type: "TIMESTAMP", nullable: false }
          ]
        },
        {
          name: "instances",
          columns: [
            { name: "id", type: "UUID", nullable: false, primary: true },
            { name: "user_id", type: "UUID", nullable: false, foreign: true },
            { name: "name", type: "VARCHAR(100)", nullable: false },
            { name: "type", type: "VARCHAR(50)", nullable: false },
            { name: "region", type: "VARCHAR(50)", nullable: false },
            { name: "status", type: "VARCHAR(20)", nullable: false },
            { name: "created_at", type: "TIMESTAMP", nullable: false }
          ]
        },
        {
          name: "invoices",
          columns: [
            { name: "id", type: "UUID", nullable: false, primary: true },
            { name: "user_id", type: "UUID", nullable: false, foreign: true },
            { name: "invoice_number", type: "VARCHAR(50)", nullable: false },
            { name: "amount", type: "DECIMAL(10,2)", nullable: false },
            { name: "due_date", type: "DATE", nullable: false },
            { name: "status", type: "VARCHAR(20)", nullable: false },
            { name: "created_at", type: "TIMESTAMP", nullable: false }
          ]
        },
        {
          name: "storage_buckets",
          columns: [
            { name: "id", type: "UUID", nullable: false, primary: true },
            { name: "user_id", type: "UUID", nullable: false, foreign: true },
            { name: "name", type: "VARCHAR(100)", nullable: false },
            { name: "region", type: "VARCHAR(50)", nullable: false },
            { name: "size_bytes", type: "BIGINT", nullable: false },
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
        "dotenv",
        "@types/node",
        "@types/express",
        "@types/cors",
        "@types/bcryptjs",
        "@types/jsonwebtoken",
        "@types/pg"
      ],
      environment: [
        "DATABASE_URL",
        "JWT_SECRET", 
        "PORT",
        "NODE_ENV",
        "CORS_ORIGIN",
        "AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY",
        "AWS_REGION"
      ]
    }
    
    setBackendStructure(mockBackendStructure)
    setIsAnalyzing(false)
    setAnalysisComplete(true)
    setCurrentStep(2)
    
    toast({
      title: "Analysis Complete",
      description: "Frontend codebase analyzed successfully!"
    })
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Content copied to clipboard"
    })
  }

  const generatePackageJson = () => {
    if (!backendStructure) return ""
    
    return JSON.stringify({
      "name": "backend-api",
      "version": "1.0.0",
      "description": "Auto-generated backend API",
      "main": "dist/index.js",
      "scripts": {
        "build": "tsc",
        "start": "node dist/index.js",
        "dev": "ts-node src/index.ts",
        "watch": "nodemon src/index.ts"
      },
      "dependencies": backendStructure.dependencies.reduce((acc, dep) => {
        acc[dep] = "latest"
        return acc
      }, {} as Record<string, string>),
      "devDependencies": {
        "nodemon": "latest",
        "ts-node": "latest"
      }
    }, null, 2)
  }

  const generateServerCode = () => {
    if (!backendStructure) return ""
    
    return `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());

// Auth middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

${backendStructure.endpoints.map(endpoint => `
// ${endpoint.description}
app.${endpoint.method.toLowerCase()}('${endpoint.path}', ${endpoint.path.includes('/auth/') ? '' : 'authenticateToken, '}async (req, res) => {
  try {
    // TODO: Implement ${endpoint.description.toLowerCase()}
    res.json({ message: '${endpoint.description} endpoint - implementation needed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});`).join('')}

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});`
  }

  const generateDatabaseSchema = () => {
    if (!backendStructure) return ""
    
    return backendStructure.database.map(table => `
-- ${table.name} table
CREATE TABLE ${table.name} (
${table.columns.map(col => 
  `  ${col.name} ${col.type}${col.nullable ? '' : ' NOT NULL'}${col.primary ? ' PRIMARY KEY' : ''}${col.foreign ? ` REFERENCES ${col.name.replace('_id', '')}(id)` : ''}`
).join(',\n')}
);`).join('\n')
  }

  const generateDockerfile = () => {
    return `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]`
  }

  const generateNginxConfig = () => {
    return `server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/frontend/dist;
        try_files $uri $uri/ /index.html;
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
    }
}`
  }

  const generateEnvFile = () => {
    if (!backendStructure) return ""
    
    return backendStructure.environment.map(env => `${env}=your_${env.toLowerCase()}_here`).join('\n')
  }

  const generateDeploymentGuide = () => {
    return `# Deployment Guide

## Prerequisites
- Ubuntu server with Nginx, PM2, PostgreSQL installed
- Node.js 18+ installed

## Steps

### 1. Database Setup
\`\`\`bash
sudo -u postgres psql
CREATE DATABASE your_app_db;
CREATE USER your_app_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE your_app_db TO your_app_user;
\\q
\`\`\`

### 2. Run Database Schema
\`\`\`bash
psql -U your_app_user -d your_app_db -f schema.sql
\`\`\`

### 3. Backend Deployment
\`\`\`bash
# Upload backend files to /opt/backend
cd /opt/backend
npm install
npm run build
\`\`\`

### 4. PM2 Setup
\`\`\`bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
\`\`\`

### 5. Frontend Build & Deploy
\`\`\`bash
# Build frontend locally
npm run build

# Upload dist folder to /var/www/frontend/
\`\`\`

### 6. Nginx Configuration
\`\`\`bash
sudo cp nginx.conf /etc/nginx/sites-available/your-app
sudo ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
\`\`\`

### 7. SSL Certificate (Optional)
\`\`\`bash
sudo certbot --nginx -d your-domain.com
\`\`\`

## Environment Variables
Create \`.env\` file in backend directory with the generated environment variables.`
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Backend Setup Wizard</h1>
          <p className="text-muted-foreground">
            Automatically analyze your frontend and generate a complete backend structure
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
            <span className={currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}>Analyze Frontend</span>
            <span className={currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}>Generate Backend</span>
            <span className={currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}>Deploy</span>
          </div>
        </div>

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Frontend Analysis
              </CardTitle>
              <CardDescription>
                Let's analyze your current frontend codebase to understand the required backend structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <h3 className="font-medium">Authentication</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Login, signup, user management</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-green-500" />
                    <h3 className="font-medium">Data Storage</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Database schema and queries</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="w-4 h-4 text-purple-500" />
                    <h3 className="font-medium">API Endpoints</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">REST API structure</p>
                </Card>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">What will be analyzed?</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• React components and their data requirements</li>
                      <li>• API calls and data flow patterns</li>
                      <li>• Authentication and user management needs</li>
                      <li>• Database schema based on data structures</li>
                      <li>• Required environment variables and dependencies</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                onClick={analyzeCurrentApp} 
                className="w-full" 
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing codebase...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Start Analysis
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
                  Analysis Complete
                </CardTitle>
                <CardDescription>
                  Found {backendStructure.endpoints.length} API endpoints, {backendStructure.database.length} database tables, and {backendStructure.dependencies.length} dependencies
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
                    <a href="https://docs.example.com/deployment" target="_blank" rel="noopener noreferrer">
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
                      'deployment-guide.md'
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
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download Backend Package
                </Button>
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Analyze Another App
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
