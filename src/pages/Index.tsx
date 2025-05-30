
import { useState, useEffect } from "react";
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
  Settings,
  Cloud,
  Network
} from "lucide-react";
import AWSHeader from "@/components/AWSHeader";
import EC2Dashboard from "@/components/EC2Dashboard";
import S3Dashboard from "@/components/S3Dashboard";
import RDSDashboard from "@/components/RDSDashboard";
import BillingDashboard from "@/components/BillingDashboard";
import LambdaDashboard from "@/components/LambdaDashboard";
import IAMDashboard from "@/components/IAMDashboard";
import CloudFormationDashboard from "@/components/CloudFormationDashboard";
import DeploymentGuide from "@/components/DeploymentGuide";
import VPCDashboard from "@/components/VPCDashboard";
import ElasticLoadBalancerDashboard from "@/components/ElasticLoadBalancerDashboard";

const Index = () => {
  const [activeService, setActiveService] = useState("dashboard");
  const [ec2Stats, setEc2Stats] = useState({ total: 0, running: 0, stopped: 0, cost: 0 });

  // Load EC2 instances from localStorage and calculate stats
  useEffect(() => {
    const updateEC2Stats = () => {
      const savedInstances = localStorage.getItem('ec2-instances');
      if (savedInstances) {
        const instances = JSON.parse(savedInstances);
        const running = instances.filter((i: any) => i.state === "running").length;
        const stopped = instances.filter((i: any) => i.state === "stopped").length;
        
        // Calculate cost based on instance types and running status
        const cost = instances.reduce((total: number, instance: any) => {
          if (instance.state === "running") {
            const hourlyRates: { [key: string]: number } = {
              "t3.micro": 0.0104,
              "t3.small": 0.0208,
              "t3.medium": 0.0416,
              "t3.large": 0.0832,
              "m5.large": 0.096,
              "c5.large": 0.085
            };
            return total + (hourlyRates[instance.type] || 0.05) * 24 * 30; // Monthly cost
          }
          return total;
        }, 0);

        setEc2Stats({
          total: instances.length,
          running,
          stopped,
          cost: parseFloat(cost.toFixed(2))
        });
      }
    };

    updateEC2Stats();
    
    // Listen for storage changes to update stats in real-time
    const handleStorageChange = () => updateEC2Stats();
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when instances are modified within the same tab
    const handleInstanceUpdate = () => updateEC2Stats();
    window.addEventListener('ec2-instances-updated', handleInstanceUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ec2-instances-updated', handleInstanceUpdate);
    };
  }, [activeService]);

  const services = [
    { id: "ec2", name: "EC2", icon: Server, description: "Virtual Servers in the Cloud", status: "running", instances: ec2Stats.total },
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
              <div className="flex items-center justify-between mt-2">
                <Badge variant={service.status === "running" ? "default" : "secondary"}>
                  {service.status}
                </Badge>
                {service.id === "ec2" && ec2Stats.cost > 0 && (
                  <span className="text-xs text-green-600 font-medium">${ec2Stats.cost}/mo</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EC2 Instances</CardTitle>
            <Server className="h-4 w-4 text-[#FF9900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ec2Stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {ec2Stats.running} running, {ec2Stats.stopped} stopped
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EC2 Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${ec2Stats.cost}</div>
            <p className="text-xs text-muted-foreground">Monthly estimate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847 GB</div>
            <p className="text-xs text-muted-foreground">Across all services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(247.83 + ec2Stats.cost).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
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
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">EC2 Instances</span>
                <span className="font-bold">${ec2Stats.cost}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">S3 Storage</span>
                <span className="text-sm text-muted-foreground">$23.45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">RDS Database</span>
                <span className="text-sm text-muted-foreground">$89.20</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Other Services</span>
                <span className="text-sm text-muted-foreground">$135.18</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total This Month</span>
                  <span className="font-bold text-lg">${(247.83 + ec2Stats.cost).toFixed(2)}</span>
                </div>
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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <AWSHeader />
      
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-white shadow-sm border-r">
          <div className="p-3 lg:p-4">
            <h2 className="font-semibold text-gray-900 mb-4 text-sm lg:text-base">AWS Services</h2>
            <nav className="space-y-1 lg:space-y-2">
              <Button
                variant={activeService === "dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start text-xs lg:text-sm"
                onClick={() => setActiveService("dashboard")}
              >
                <BarChart3 className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                Dashboard
              </Button>
              
              <div className="pt-2 lg:pt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
                  Compute
                </h3>
                <Button
                  variant={activeService === "ec2" ? "secondary" : "ghost"}
                  className="w-full justify-start text-xs lg:text-sm"
                  onClick={() => setActiveService("ec2")}
                >
                  <Server className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  EC2
                </Button>
                <Button
                  variant={activeService === "lambda" ? "secondary" : "ghost"}
                  className="w-full justify-start text-xs lg:text-sm"
                  onClick={() => setActiveService("lambda")}
                >
                  <Zap className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Lambda
                </Button>
              </div>

              <div className="pt-2 lg:pt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
                  Storage
                </h3>
                <Button
                  variant={activeService === "s3" ? "secondary" : "ghost"}
                  className="w-full justify-start text-xs lg:text-sm"
                  onClick={() => setActiveService("s3")}
                >
                  <HardDrive className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  S3
                </Button>
              </div>

              <div className="pt-2 lg:pt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
                  Database
                </h3>
                <Button
                  variant={activeService === "rds" ? "secondary" : "ghost"}
                  className="w-full justify-start text-xs lg:text-sm"
                  onClick={() => setActiveService("rds")}
                >
                  <Database className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  RDS
                </Button>
              </div>

              <div className="pt-2 lg:pt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
                  Networking
                </h3>
                <Button
                  variant={activeService === "vpc" ? "secondary" : "ghost"}
                  className="w-full justify-start text-xs lg:text-sm"
                  onClick={() => setActiveService("vpc")}
                >
                  <Globe className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  VPC
                </Button>
                <Button
                  variant={activeService === "elb" ? "secondary" : "ghost"}
                  className="w-full justify-start text-xs lg:text-sm"
                  onClick={() => setActiveService("elb")}
                >
                  <Network className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Load Balancer
                </Button>
              </div>

              <div className="pt-2 lg:pt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
                  Management
                </h3>
                <Button
                  variant={activeService === "billing" ? "secondary" : "ghost"}
                  className="w-full justify-start text-xs lg:text-sm"
                  onClick={() => setActiveService("billing")}
                >
                  <DollarSign className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Billing
                </Button>
                <Button
                  variant={activeService === "iam" ? "secondary" : "ghost"}
                  className="w-full justify-start text-xs lg:text-sm"
                  onClick={() => setActiveService("iam")}
                >
                  <Users className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  IAM
                </Button>
                <Button
                  variant={activeService === "cloudformation" ? "secondary" : "ghost"}
                  className="w-full justify-start text-xs lg:text-sm"
                  onClick={() => setActiveService("cloudformation")}
                >
                  <FileText className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  CloudFormation
                </Button>
              </div>

              <div className="pt-2 lg:pt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
                  Tools
                </h3>
                <Button
                  variant={activeService === "deployment" ? "secondary" : "ghost"}
                  className="w-full justify-start text-xs lg:text-sm"
                  onClick={() => setActiveService("deployment")}
                >
                  <Cloud className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Deployment Guide
                </Button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-3 lg:p-6 min-w-0">
          {activeService === "dashboard" && renderDashboard()}
          {activeService === "ec2" && <EC2Dashboard />}
          {activeService === "s3" && <S3Dashboard />}
          {activeService === "rds" && <RDSDashboard />}
          {activeService === "billing" && <BillingDashboard />}
          {activeService === "lambda" && <LambdaDashboard />}
          {activeService === "iam" && <IAMDashboard />}
          {activeService === "cloudformation" && <CloudFormationDashboard />}
          {activeService === "vpc" && <VPCDashboard />}
          {activeService === "elb" && <ElasticLoadBalancerDashboard />}
          {activeService === "deployment" && <DeploymentGuide />}
        </div>
      </div>
    </div>
  );
};

export default Index;
