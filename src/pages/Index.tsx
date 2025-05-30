
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, 
  Database, 
  HardDrive, 
  Zap, 
  Users, 
  DollarSign, 
  Activity, 
  Globe,
  Shield,
  FileText,
  BarChart3,
  Settings
} from "lucide-react";
import AWSHeader from "@/components/AWSHeader";
import EC2Dashboard from "@/components/EC2Dashboard";
import S3Dashboard from "@/components/S3Dashboard";
import RDSDashboard from "@/components/RDSDashboard";
import BillingDashboard from "@/components/BillingDashboard";

const Index = () => {
  const [activeService, setActiveService] = useState("dashboard");

  const services = [
    { id: "ec2", name: "EC2", icon: Server, description: "Virtual Servers in the Cloud", status: "running", instances: 3 },
    { id: "s3", name: "S3", icon: HardDrive, description: "Scalable Storage in the Cloud", status: "active", buckets: 8 },
    { id: "rds", name: "RDS", icon: Database, description: "Managed Relational Database", status: "running", databases: 2 },
    { id: "lambda", name: "Lambda", icon: Zap, description: "Serverless Computing", status: "active", functions: 12 },
    { id: "iam", name: "IAM", icon: Users, description: "Identity and Access Management", status: "configured", users: 5 },
    { id: "cloudformation", name: "CloudFormation", icon: FileText, description: "Infrastructure as Code", status: "active", stacks: 3 },
  ];

  const recentActivity = [
    { action: "Launched EC2 instance", resource: "i-0123456789abcdef0", time: "2 minutes ago", status: "success" },
    { action: "Created S3 bucket", resource: "my-app-bucket-2024", time: "15 minutes ago", status: "success" },
    { action: "Updated RDS instance", resource: "prod-database", time: "1 hour ago", status: "success" },
    { action: "Deployed Lambda function", resource: "data-processor", time: "3 hours ago", status: "success" },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Service Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveService(service.id)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{service.name}</CardTitle>
              <service.icon className="h-4 w-4 text-[#FF9900]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {service.instances && service.instances}
                {service.buckets && service.buckets}
                {service.databases && service.databases}
                {service.functions && service.functions}
                {service.users && service.users}
                {service.stacks && service.stacks}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
              <Badge variant={service.status === "running" ? "default" : "secondary"} className="mt-2">
                {service.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Cost Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.resource}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                    <Badge variant="outline" className="text-green-600">
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cost Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">This Month</span>
                <span className="font-bold text-lg">$247.83</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Last Month</span>
                <span className="text-sm text-muted-foreground">$189.42</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Forecasted</span>
                <span className="text-sm text-orange-600">$312.45</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setActiveService("billing")}
              >
                View Detailed Billing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AWSHeader />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-4">
            <h2 className="font-semibold text-gray-900 mb-4">AWS Services</h2>
            <nav className="space-y-2">
              <Button
                variant={activeService === "dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveService("dashboard")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              
              <div className="pt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Compute
                </h3>
                <Button
                  variant={activeService === "ec2" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveService("ec2")}
                >
                  <Server className="h-4 w-4 mr-2" />
                  EC2
                </Button>
                <Button
                  variant={activeService === "lambda" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveService("lambda")}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Lambda
                </Button>
              </div>

              <div className="pt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Storage
                </h3>
                <Button
                  variant={activeService === "s3" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveService("s3")}
                >
                  <HardDrive className="h-4 w-4 mr-2" />
                  S3
                </Button>
              </div>

              <div className="pt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Database
                </h3>
                <Button
                  variant={activeService === "rds" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveService("rds")}
                >
                  <Database className="h-4 w-4 mr-2" />
                  RDS
                </Button>
              </div>

              <div className="pt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Management
                </h3>
                <Button
                  variant={activeService === "billing" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveService("billing")}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Billing
                </Button>
                <Button
                  variant={activeService === "iam" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveService("iam")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  IAM
                </Button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeService === "dashboard" && renderDashboard()}
          {activeService === "ec2" && <EC2Dashboard />}
          {activeService === "s3" && <S3Dashboard />}
          {activeService === "rds" && <RDSDashboard />}
          {activeService === "billing" && <BillingDashboard />}
        </div>
      </div>
    </div>
  );
};

export default Index;
