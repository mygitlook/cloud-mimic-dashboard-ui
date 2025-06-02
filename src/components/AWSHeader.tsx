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
  // Component kept for backward compatibility but deprecated
  // Now using AppSidebar instead
  return null;
};

export default AWSHeader;
