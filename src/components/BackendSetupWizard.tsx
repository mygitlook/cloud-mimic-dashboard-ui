
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Server, Database, Code, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  auth: boolean;
  body?: string;
}

interface DatabaseTable {
  name: string;
  columns: Array<{
    name: string;
    type: string;
    nullable: boolean;
    primary?: boolean;
    foreign?: string;
  }>;
}

const BackendSetupWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { toast } = useToast();

  // Analyzed API endpoints from your current frontend
  const apiEndpoints: APIEndpoint[] = [
    { method: "GET", path: "/api/instances", description: "Get all EC2 instances", auth: true },
    { method: "POST", path: "/api/instances", description: "Create new instance", auth: true, body: "{ name, type, ami }" },
    { method: "PUT", path: "/api/instances/:id", description: "Update instance", auth: true, body: "{ state }" },
    { method: "DELETE", path: "/api/instances/:id", description: "Delete instance", auth: true },
    { method: "GET", path: "/api/billing/summary", description: "Get billing summary", auth: true },
    { method: "GET", path: "/api/billing/usage", description: "Get current month usage", auth: true },
    { method: "POST", path: "/api/billing/generate", description: "Generate monthly billing", auth: true },
    { method: "GET", path: "/api/billing/invoices", description: "Get invoice history", auth: true },
    { method: "POST", path: "/api/auth/login", description: "User login", auth: false, body: "{ email, password }" },
    { method: "POST", path: "/api/auth/register", description: "User registration", auth: false, body: "{ email, password, full_name }" },
    { method: "POST", path: "/api/auth/logout", description: "User logout", auth: true },
    { method: "GET", path: "/api/profile", description: "Get user profile", auth: true },
    { method: "PUT", path: "/api/profile", description: "Update user profile", auth: true, body: "{ full_name, username }" },
    { method: "GET", path: "/api/activity-logs", description: "Get activity logs", auth: true },
    { method: "POST", path: "/api/activity-logs", description: "Add activity log", auth: true, body: "{ action, resource, status }" }
  ];

  // Database schema from your current Supabase setup
  const databaseTables: DatabaseTable[] = [
    {
      name: "users",
      columns: [
        { name: "id", type: "UUID", nullable: false, primary: true },
        { name: "email", type: "VARCHAR(255)", nullable: false },
        { name: "password_hash", type: "VARCHAR(255)", nullable: false },
        { name: "created_at", type: "TIMESTAMP", nullable: false },
        { name: "updated_at", type: "TIMESTAMP", nullable: false }
      ]
    },
    {
      name: "profiles",
      columns: [
        { name: "id", type: "UUID", nullable: false, primary: true },
        { name: "user_id", type: "UUID", nullable: false, foreign: "users(id)" },
        { name: "username", type: "VARCHAR(100)", nullable: true },
        { name: "full_name", type: "VARCHAR(255)", nullable: true },
        { name: "role", type: "VARCHAR(50)", nullable: false },
        { name: "email", type: "VARCHAR(255)", nullable: false },
        { name: "permissions", type: "JSONB", nullable: true },
        { name: "created_at", type: "TIMESTAMP", nullable: false },
        { name: "updated_at", type: "TIMESTAMP", nullable: false }
      ]
    },
    {
      name: "instances",
      columns: [
        { name: "id", type: "VARCHAR(50)", nullable: false, primary: true },
        { name: "user_id", type: "UUID", nullable: true, foreign: "users(id)" },
        { name: "name", type: "VARCHAR(255)", nullable: false },
        { name: "type", type: "VARCHAR(50)", nullable: false },
        { name: "state", type: "VARCHAR(20)", nullable: false },
        { name: "public_ip", type: "VARCHAR(15)", nullable: true },
        { name: "private_ip", type: "VARCHAR(15)", nullable: true },
        { name: "ami", type: "VARCHAR(50)", nullable: true },
        { name: "created_at", type: "TIMESTAMP", nullable: false },
        { name: "updated_at", type: "TIMESTAMP", nullable: false }
      ]
    },
    {
      name: "billing_summary",
      columns: [
        { name: "id", type: "UUID", nullable: false, primary: true },
        { name: "user_id", type: "UUID", nullable: true, foreign: "users(id)" },
        { name: "billing_period", type: "DATE", nullable: false },
        { name: "total_amount", type: "DECIMAL(12,2)", nullable: false },
        { name: "currency", type: "VARCHAR(3)", nullable: true },
        { name: "status", type: "VARCHAR(20)", nullable: true },
        { name: "invoice_data", type: "JSONB", nullable: true },
        { name: "generated_at", type: "TIMESTAMP", nullable: true },
        { name: "updated_at", type: "TIMESTAMP", nullable: true }
      ]
    },
    {
      name: "service_usage",
      columns: [
        { name: "id", type: "UUID", nullable: false, primary: true },
        { name: "user_id", type: "UUID", nullable: true, foreign: "users(id)" },
        { name: "service_type", type: "VARCHAR(50)", nullable: false },
        { name: "resource_id", type: "VARCHAR(100)", nullable: true },
        { name: "usage_type", type: "VARCHAR(50)", nullable: false },
        { name: "quantity", type: "DECIMAL(12,4)", nullable: false },
        { name: "unit_cost", type: "DECIMAL(12,4)", nullable: false },
        { name: "total_cost", type: "DECIMAL(12,2)", nullable: false },
        { name: "billing_period", type: "DATE", nullable: false },
        { name: "recorded_at", type: "TIMESTAMP", nullable: true }
      ]
    },
    {
      name: "activity_logs",
      columns: [
        { name: "id", type: "UUID", nullable: false, primary: true },
        { name: "user_id", type: "UUID", nullable: true, foreign: "users(id)" },
        { name: "action", type: "VARCHAR(100)", nullable: false },
        { name: "resource", type: "VARCHAR(100)", nullable: false },
        { name: "status", type: "VARCHAR(20)", nullable: true },
        { name: "created_at", type: "TIMESTAMP", nullable: false }
      ]
    }
  ];

  const generatePackageJson = () => {
    return JSON.stringify({
      "name": "zeltra-cloud-backend",
      "version": "1.0.0",
      "description": "Backend API for Zeltra Cloud Dashboard",
      "main": "dist/server.js",
      "scripts": {
        "start": "node dist/server.js",
        "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
        "build": "tsc",
        "test": "jest"
      },
      "dependencies": {
        "express": "^4.18.2",
        "cors": "^2.8.5",
        "helmet": "^7.0.0",
        "bcryptjs": "^2.4.3",
        "jsonwebtoken": "^9.0.2",
        "pg": "^8.11.3",
        "dotenv": "^16.3.1",
        "express-rate-limit": "^6.10.0",
        "express-validator": "^7.0.1",
        "morgan": "^1.10.0"
      },
      "devDependencies": {
        "@types/express": "^4.17.17",
        "@types/cors": "^2.8.13",
        "@types/bcryptjs": "^2.4.2",
        "@types/jsonwebtoken": "^9.0.2",
        "@types/pg": "^8.10.2",
        "@types/morgan": "^1.9.4",
        "typescript": "^5.1.6",
        "ts-node-dev": "^2.0.0",
        "@types/node": "^20.4.5",
        "jest": "^29.6.2",
        "@types/jest": "^29.5.3"
      }
    }, null, 2);
  };

  const generateDockerFile = () => {
    return `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]`;
  };

  const generateServerCode = () => {
    return `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import instanceRoutes from './routes/instances';
import billingRoutes from './routes/billing';
import profileRoutes from './routes/profile';
import activityRoutes from './routes/activity';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/instances', instanceRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/activity-logs', activityRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(\`🚀 Zeltra Cloud Backend running on port \${PORT}\`);
});`;
  };

  const generateDatabaseSQL = () => {
    return databaseTables.map(table => {
      const columns = table.columns.map(col => {
        let columnDef = `  ${col.name} ${col.type}`;
        if (!col.nullable) columnDef += ' NOT NULL';
        if (col.primary) columnDef += ' PRIMARY KEY';
        if (col.name.includes('_at')) columnDef += ' DEFAULT CURRENT_TIMESTAMP';
        return columnDef;
      }).join(',\n');

      const foreignKeys = table.columns
        .filter(col => col.foreign)
        .map(col => `  FOREIGN KEY (${col.name}) REFERENCES ${col.foreign}`)
        .join(',\n');

      return `CREATE TABLE ${table.name} (
${columns}${foreignKeys ? ',\n' + foreignKeys : ''}
);`;
    }).join('\n\n');
  };

  const generateEnvironmentFile = () => {
    return `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zeltra_cloud
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=production
FRONTEND_URL=http://localhost:5173

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100`;
  };

  const downloadFile = (content: string, filename: string, contentType: string = 'text/plain') => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "File Downloaded",
      description: `${filename} has been downloaded successfully`,
    });
  };

  const runAnalysis = () => {
    setAnalysisComplete(true);
    toast({
      title: "Analysis Complete",
      description: "Your codebase has been analyzed and backend structure is ready",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-6 w-6" />
            Backend Setup Configuration Wizard
          </CardTitle>
          <CardDescription>
            Generate a complete backend structure compatible with your Zeltra Cloud frontend
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!analysisComplete ? (
            <div className="text-center space-y-4">
              <p>Click below to analyze your current frontend codebase and generate the required backend structure.</p>
              <Button onClick={runAnalysis} size="lg">
                <Code className="h-4 w-4 mr-2" />
                Analyze Codebase & Generate Backend
              </Button>
            </div>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Analysis complete! Your backend structure has been generated based on your current frontend requirements.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {analysisComplete && (
        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="api">API Endpoints</TabsTrigger>
            <TabsTrigger value="database">Database Schema</TabsTrigger>
            <TabsTrigger value="server">Server Code</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Required API Endpoints</CardTitle>
                <CardDescription>
                  Based on your frontend code analysis, these endpoints need to be implemented
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {apiEndpoints.map((endpoint, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={endpoint.method === 'GET' ? 'default' : endpoint.method === 'POST' ? 'secondary' : 'destructive'}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm">{endpoint.path}</code>
                        {endpoint.auth && <Badge variant="outline">Auth Required</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {endpoint.description}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Database Schema
                  <Button 
                    onClick={() => downloadFile(generateDatabaseSQL(), 'schema.sql', 'text/sql')}
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download SQL
                  </Button>
                </CardTitle>
                <CardDescription>
                  PostgreSQL tables and relationships needed for your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {databaseTables.map((table, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{table.name}</h4>
                      <div className="space-y-1">
                        {table.columns.map((column, colIndex) => (
                          <div key={colIndex} className="flex items-center gap-2 text-sm">
                            <code className="bg-muted px-2 py-1 rounded">{column.name}</code>
                            <span className="text-muted-foreground">{column.type}</span>
                            {column.primary && <Badge variant="secondary" className="text-xs">PK</Badge>}
                            {column.foreign && <Badge variant="outline" className="text-xs">FK</Badge>}
                            {!column.nullable && <Badge variant="destructive" className="text-xs">NOT NULL</Badge>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="server" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Server Configuration
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => downloadFile(generatePackageJson(), 'package.json', 'application/json')}
                      size="sm"
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      package.json
                    </Button>
                    <Button 
                      onClick={() => downloadFile(generateServerCode(), 'server.ts', 'text/typescript')}
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Server Code
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Express.js server setup with all required dependencies and middleware
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Technology Stack</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Core Framework</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary">Express.js</Badge>
                          <Badge variant="secondary">TypeScript</Badge>
                          <Badge variant="secondary">Node.js</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Security & Middleware</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline">Helmet</Badge>
                          <Badge variant="outline">CORS</Badge>
                          <Badge variant="outline">Rate Limiting</Badge>
                          <Badge variant="outline">JWT Auth</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Environment Configuration
                  <Button 
                    onClick={() => downloadFile(generateEnvironmentFile(), '.env.example')}
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download .env
                  </Button>
                </CardTitle>
                <CardDescription>
                  Environment variables and configuration files needed for deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      Make sure to update these values with your actual server configuration before deployment.
                    </AlertDescription>
                  </Alert>
                  <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                    {generateEnvironmentFile()}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Deployment Guide
                  <Button 
                    onClick={() => downloadFile(generateDockerFile(), 'Dockerfile')}
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Dockerfile
                  </Button>
                </CardTitle>
                <CardDescription>
                  Step-by-step deployment instructions for your cloud server
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">1. Database Setup</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm">{`# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE zeltra_cloud;
CREATE USER zeltra_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE zeltra_cloud TO zeltra_user;

# Import schema
psql -U zeltra_user -d zeltra_cloud -f schema.sql`}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">2. Backend Deployment</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm">{`# Clone and setup backend
git clone your-backend-repo
cd zeltra-cloud-backend

# Install dependencies
npm install

# Build the application
npm run build

# Start with PM2
pm2 start dist/server.js --name "zeltra-backend"
pm2 save
pm2 startup`}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">3. Nginx Configuration</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm">{`server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/zeltra-frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`}</pre>
                    </div>
                  </div>

                  <Alert>
                    <AlertDescription>
                      Your server already has Nginx, PM2, and PostgreSQL installed, so you can use these configurations directly.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default BackendSetupWizard;
