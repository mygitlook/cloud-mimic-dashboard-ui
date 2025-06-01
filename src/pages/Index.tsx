
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AWSHeader from "@/components/AWSHeader";
import EC2Dashboard from "@/components/EC2Dashboard";
import IAMDashboard from "@/components/IAMDashboard";
import S3Dashboard from "@/components/S3Dashboard";
import RDSDashboard from "@/components/RDSDashboard";
import LambdaDashboard from "@/components/LambdaDashboard";
import VPCDashboard from "@/components/VPCDashboard";
import CloudFormationDashboard from "@/components/CloudFormationDashboard";
import MonitoringDashboard from "@/components/MonitoringDashboard";
import BillingDashboard from "@/components/BillingDashboard";
import CDNDashboard from "@/components/CDNDashboard";
import WAFDashboard from "@/components/WAFDashboard";
import ElasticLoadBalancerDashboard from "@/components/ElasticLoadBalancerDashboard";
import DataTransferDashboard from "@/components/DataTransferDashboard";
import BackupStorageDashboard from "@/components/BackupStorageDashboard";
import ArchiveStorageDashboard from "@/components/ArchiveStorageDashboard";
import PremiumSupportDashboard from "@/components/PremiumSupportDashboard";
import MachineLearningDashboard from "@/components/MachineLearningDashboard";
import DeploymentGuide from "@/components/DeploymentGuide";

const Index = () => {
  const [activeService, setActiveService] = useState("ec2");
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth page
  }

  const renderDashboard = () => {
    switch (activeService) {
      case "ec2": return <EC2Dashboard />;
      case "iam": return <IAMDashboard />;
      case "s3": return <S3Dashboard />;
      case "rds": return <RDSDashboard />;
      case "lambda": return <LambdaDashboard />;
      case "vpc": return <VPCDashboard />;
      case "cloudformation": return <CloudFormationDashboard />;
      case "monitoring": return <MonitoringDashboard />;
      case "billing": return <BillingDashboard />;
      case "cdn": return <CDNDashboard />;
      case "waf": return <WAFDashboard />;
      case "elb": return <ElasticLoadBalancerDashboard />;
      case "data-transfer": return <DataTransferDashboard />;
      case "backup": return <BackupStorageDashboard />;
      case "archive": return <ArchiveStorageDashboard />;
      case "support": return <PremiumSupportDashboard />;
      case "ml": return <MachineLearningDashboard />;
      case "deployment": return <DeploymentGuide />;
      default: return <EC2Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AWSHeader 
        activeService={activeService} 
        setActiveService={setActiveService}
        onSignOut={signOut}
        userEmail={user.email}
      />
      <main className="flex-1 p-6">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Index;
