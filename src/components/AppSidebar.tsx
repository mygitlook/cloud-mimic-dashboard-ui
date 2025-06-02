
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
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  activeService: string;
  setActiveService: (service: string) => void;
  onSignOut: () => void;
  userEmail?: string;
}

export function AppSidebar({ activeService, setActiveService, onSignOut, userEmail }: AppSidebarProps) {
  const serviceGroups = [
    {
      category: "Compute",
      color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      services: [
        { id: "ec2", name: "EC2", icon: Server },
        { id: "lambda", name: "Lambda", icon: Code },
      ]
    },
    {
      category: "Security",
      color: "bg-red-100 text-red-800 hover:bg-red-200",
      services: [
        { id: "iam", name: "IAM", icon: Users },
        { id: "vpc", name: "VPC", icon: Shield },
        { id: "waf", name: "WAF", icon: ShieldCheck },
      ]
    },
    {
      category: "Storage",
      color: "bg-green-100 text-green-800 hover:bg-green-200",
      services: [
        { id: "s3", name: "S3", icon: HardDrive },
        { id: "backup", name: "Backup", icon: Archive },
        { id: "archive", name: "Glacier", icon: Archive },
      ]
    },
    {
      category: "Database",
      color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      services: [
        { id: "rds", name: "RDS", icon: Database },
      ]
    },
    {
      category: "Networking",
      color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      services: [
        { id: "cdn", name: "CloudFront", icon: Globe },
        { id: "elb", name: "Load Balancer", icon: Scale },
        { id: "data-transfer", name: "Data Transfer", icon: RefreshCw },
      ]
    },
    {
      category: "Management",
      color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
      services: [
        { id: "cloudformation", name: "CloudFormation", icon: BarChart3 },
        { id: "monitoring", name: "CloudWatch", icon: BarChart3 },
        { id: "deployment", name: "Deployment", icon: Rocket },
      ]
    },
    {
      category: "Cost Management",
      color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      services: [
        { id: "billing", name: "Billing", icon: CreditCard },
      ]
    },
    {
      category: "Machine Learning",
      color: "bg-pink-100 text-pink-800 hover:bg-pink-200",
      services: [
        { id: "ml", name: "SageMaker", icon: Bot },
      ]
    },
    {
      category: "Support",
      color: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      services: [
        { id: "support", name: "Support", icon: LifeBuoy },
      ]
    }
  ];

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Cloud className="h-8 w-8 text-[#FF9900]" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">Zeltra Cloud</h1>
            <p className="text-xs text-gray-500">Cloud Management</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        {serviceGroups.map((group) => (
          <SidebarGroup key={group.category}>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              {group.category}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.services.map((service) => {
                  const Icon = service.icon;
                  const isActive = activeService === service.id;
                  return (
                    <SidebarMenuItem key={service.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveService(service.id)}
                        className={`w-full justify-start rounded-md transition-colors ${
                          isActive 
                            ? "bg-[#FF9900] text-white hover:bg-[#e8890a]" 
                            : `${group.color} border-0`
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        <span className="font-medium">{service.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700 truncate">{userEmail}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSignOut}
            className="text-gray-500 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
