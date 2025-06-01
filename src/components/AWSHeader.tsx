
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Cloud, 
  Server, 
  Users, 
  Database, 
  HardDrive,
  Code,
  Shield,
  BarChart3,
  CreditCard,
  Globe,
  ShieldCheck,
  Scale,
  RefreshCw,
  Archive,
  LifeBuoy,
  Bot,
  Rocket,
  LogOut,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AWSHeaderProps {
  activeService: string;
  setActiveService: (service: string) => void;
  onSignOut: () => void;
  userEmail?: string;
}

const AWSHeader = ({ activeService, setActiveService, onSignOut, userEmail }: AWSHeaderProps) => {
  const [showAllServices, setShowAllServices] = useState(false);

  const services = [
    { id: "ec2", name: "EC2", icon: Server, category: "Compute" },
    { id: "iam", name: "IAM", icon: Users, category: "Security" },
    { id: "s3", name: "S3", icon: HardDrive, category: "Storage" },
    { id: "rds", name: "RDS", icon: Database, category: "Database" },
    { id: "lambda", name: "Lambda", icon: Code, category: "Compute" },
    { id: "vpc", name: "VPC", icon: Shield, category: "Networking" },
    { id: "cloudformation", name: "CloudFormation", icon: BarChart3, category: "Management" },
    { id: "monitoring", name: "CloudWatch", icon: BarChart3, category: "Management" },
    { id: "billing", name: "Billing", icon: CreditCard, category: "Cost Management" },
    { id: "cdn", name: "CloudFront", icon: Globe, category: "Networking" },
    { id: "waf", name: "WAF", icon: ShieldCheck, category: "Security" },
    { id: "elb", name: "Load Balancer", icon: Scale, category: "Networking" },
    { id: "data-transfer", name: "Data Transfer", icon: RefreshCw, category: "Networking" },
    { id: "backup", name: "Backup", icon: Archive, category: "Storage" },
    { id: "archive", name: "Glacier", icon: Archive, category: "Storage" },
    { id: "support", name: "Support", icon: LifeBuoy, category: "Support" },
    { id: "ml", name: "SageMaker", icon: Bot, category: "Machine Learning" },
    { id: "deployment", name: "Deployment", icon: Rocket, category: "Management" },
  ];

  const displayedServices = showAllServices ? services : services.slice(0, 8);

  const getServiceIcon = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.icon : Server;
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : serviceId.toUpperCase();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Cloud className="h-8 w-8 text-[#FF9900]" />
            <span className="text-xl font-bold text-gray-900">Zeltra Connect</span>
          </div>
          <Badge variant="outline" className="text-xs">
            AWS Cloud Management
          </Badge>
        </div>

        {/* Service Navigation */}
        <div className="flex items-center space-x-1">
          {displayedServices.map((service) => {
            const Icon = service.icon;
            const isActive = activeService === service.id;
            return (
              <Button
                key={service.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveService(service.id)}
                className={`flex items-center space-x-1 ${
                  isActive 
                    ? "bg-[#FF9900] text-white hover:bg-[#e8890a]" 
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{service.name}</span>
              </Button>
            );
          })}
          
          {!showAllServices && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllServices(true)}
              className="text-gray-700 hover:text-gray-900"
            >
              <span className="text-xs">+{services.length - 8} more</span>
            </Button>
          )}
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">{userEmail}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Service Indicator */}
      <div className="mt-4 flex items-center space-x-2">
        {(() => {
          const Icon = getServiceIcon(activeService);
          return (
            <>
              <Icon className="h-5 w-5 text-[#FF9900]" />
              <span className="text-lg font-semibold text-gray-900">
                {getServiceName(activeService)}
              </span>
              <Badge variant="secondary" className="text-xs">
                {services.find(s => s.id === activeService)?.category || "Service"}
              </Badge>
            </>
          );
        })()}
      </div>
    </header>
  );
};

export default AWSHeader;
