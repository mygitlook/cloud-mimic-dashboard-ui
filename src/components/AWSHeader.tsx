
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Bell, 
  Search, 
  User, 
  Globe, 
  ChevronDown,
  HelpCircle,
  CreditCard,
  LifeBuoy,
  Settings,
  LogOut
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const AWSHeader = () => {
  const [region, setRegion] = useState("us-east-1");
  const { toast } = useToast();

  const regions = [
    { id: "us-east-1", name: "US East (N. Virginia)", flag: "🇺🇸" },
    { id: "us-west-2", name: "US West (Oregon)", flag: "🇺🇸" },
    { id: "eu-west-1", name: "Europe (Ireland)", flag: "🇮🇪" },
    { id: "ap-southeast-1", name: "Asia Pacific (Singapore)", flag: "🇸🇬" },
  ];

  const handleProfileAction = (action: string) => {
    switch (action) {
      case 'account':
        toast({
          title: "My Account",
          description: "Redirecting to account settings...",
        });
        break;
      case 'billing':
        toast({
          title: "Billing Dashboard",
          description: "Opening billing dashboard...",
        });
        // In a real app, this would navigate to billing
        break;
      case 'support':
        toast({
          title: "Support Cases",
          description: "Opening support center...",
        });
        break;
      case 'switch-role':
        toast({
          title: "Switch Role",
          description: "Role switching interface would open here...",
        });
        break;
      case 'signout':
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out.",
        });
        // In a real app, this would handle logout
        break;
      default:
        break;
    }
  };

  const handleNotifications = () => {
    toast({
      title: "Notifications",
      description: "You have 3 unread notifications",
    });
  };

  const handleHelp = () => {
    toast({
      title: "AWS Support",
      description: "Opening AWS documentation and support resources...",
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Services */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#FF9900] rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">AWS</span>
            </div>
            <span className="font-semibold text-gray-900">Management Console</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm">
                Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <div className="p-2">
                <Input placeholder="Search services..." className="mb-2" />
                <div className="space-y-1">
                  <DropdownMenuItem>
                    <span className="font-medium">Recently used</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>EC2</DropdownMenuItem>
                  <DropdownMenuItem>S3</DropdownMenuItem>
                  <DropdownMenuItem>RDS</DropdownMenuItem>
                  <DropdownMenuItem>Lambda</DropdownMenuItem>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search for services, features, blogs, docs, and more"
              className="pl-10"
            />
          </div>
        </div>

        {/* Right side - User and settings */}
        <div className="flex items-center space-x-4">
          {/* Region Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm">
                <Globe className="h-4 w-4 mr-1" />
                {regions.find(r => r.id === region)?.flag} {region}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {regions.map((r) => (
                <DropdownMenuItem key={r.id} onClick={() => setRegion(r.id)}>
                  <span className="mr-2">{r.flag}</span>
                  <div>
                    <div className="font-medium">{r.id}</div>
                    <div className="text-xs text-gray-500">{r.name}</div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help */}
          <Button variant="ghost" size="sm" onClick={handleHelp}>
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative" onClick={handleNotifications}>
            <Bell className="h-4 w-4" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm">
                <User className="h-4 w-4 mr-1" />
                demo-user
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleProfileAction('account')}>
                <User className="mr-2 h-4 w-4" />
                My Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProfileAction('billing')}>
                <CreditCard className="mr-2 h-4 w-4" />
                My Billing Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProfileAction('support')}>
                <LifeBuoy className="mr-2 h-4 w-4" />
                My Support Cases
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProfileAction('switch-role')}>
                <Settings className="mr-2 h-4 w-4" />
                Switch Role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProfileAction('signout')}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AWSHeader;
