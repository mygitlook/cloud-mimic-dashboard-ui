import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Server, 
  Plus, 
  Play, 
  Square, 
  RotateCcw,
  Trash2,
  Settings,
  Activity,
  HardDrive,
  Monitor,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockBackend } from "@/utils/mockBackend";

interface Instance {
  id: string;
  name: string;
  type: string;
  state: "running" | "stopped" | "rebooting";
  publicIP: string;
  privateIP: string;
  launchTime: string;
  ami: string;
}

const EC2Dashboard = () => {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  const loadInstances = async () => {
    try {
      setIsLoading(true);
      const loadedInstances = await mockBackend.getInstances();
      setInstances(loadedInstances);
    } catch (error) {
      console.error('Failed to load instances:', error);
      const savedInstances = localStorage.getItem('ec2-instances');
      if (savedInstances) {
        setInstances(JSON.parse(savedInstances));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInstances();
  }, []);

  const rebootInstance = async (instanceId: string) => {
    try {
      // Update instance state to rebooting
      const updatedInstances = instances.map(instance => 
        instance.id === instanceId 
          ? { ...instance, state: "rebooting" as const }
          : instance
      );
      setInstances(updatedInstances);
      
      await mockBackend.updateInstance(instanceId, { state: "rebooting" });
      
      toast({
        title: "Instance Rebooting",
        description: `Instance ${instanceId} is being rebooted...`,
      });

      // Simulate reboot process (3 seconds)
      setTimeout(async () => {
        const finalInstances = instances.map(instance => 
          instance.id === instanceId 
            ? { ...instance, state: "running" as const }
            : instance
        );
        setInstances(finalInstances);
        
        await mockBackend.updateInstance(instanceId, { state: "running" });
        
        toast({
          title: "Reboot Complete",
          description: `Instance ${instanceId} has been successfully rebooted.`,
        });

        // Add to recent activity
        const activity = {
          action: "Rebooted VM instance",
          resource: instanceId,
          time: new Date().toISOString(),
          status: "success"
        };
        
        const savedActivities = localStorage.getItem('recent-activities') || '[]';
        const activities = JSON.parse(savedActivities);
        activities.unshift(activity);
        activities.splice(10); // Keep only last 10 activities
        localStorage.setItem('recent-activities', JSON.stringify(activities));
        
        // Trigger custom event for activity update
        window.dispatchEvent(new CustomEvent('activity-updated'));
      }, 3000);
      
    } catch (error) {
      console.error('Failed to reboot instance:', error);
      toast({
        title: "Reboot Failed",
        description: "Failed to reboot the instance. Please try again.",
        variant: "destructive",
      });
    }
  };

  const createInstance = async (instanceData: any) => {
    try {
      const newInstance: Instance = {
        id: `i-${Math.random().toString(36).substr(2, 17)}`,
        name: instanceData.name,
        type: instanceData.type,
        state: "running",
        publicIP: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        privateIP: `10.0.1.${Math.floor(Math.random() * 255)}`,
        launchTime: new Date().toISOString(), // Real timestamp
        ami: "ami-12345"
      };

      await mockBackend.addInstance(newInstance);
      const updatedInstances = await mockBackend.getInstances();
      setInstances(updatedInstances);

      // Add to recent activity
      const activity = {
        action: "Launched VM instance",
        resource: newInstance.id,
        time: new Date().toISOString(),
        status: "success"
      };
      
      const savedActivities = localStorage.getItem('recent-activities') || '[]';
      const activities = JSON.parse(savedActivities);
      activities.unshift(activity);
      activities.splice(10);
      localStorage.setItem('recent-activities', JSON.stringify(activities));
      
      window.dispatchEvent(new CustomEvent('activity-updated'));
      window.dispatchEvent(new CustomEvent('ec2-instances-updated'));

      toast({
        title: "Instance Created",
        description: `Virtual Machine ${newInstance.name} has been launched successfully.`,
      });

      setShowCreateDialog(false);
    } catch (error) {
      console.error('Failed to create instance:', error);
      toast({
        title: "Creation Failed", 
        description: "Failed to create the instance. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteInstance = async (instanceId: string) => {
    try {
      await mockBackend.deleteInstance(instanceId);
      const updatedInstances = await mockBackend.getInstances();
      setInstances(updatedInstances);
      
      window.dispatchEvent(new CustomEvent('ec2-instances-updated'));
      
      toast({
        title: "Instance Deleted",
        description: `Instance ${instanceId} has been terminated.`,
      });
    } catch (error) {
      console.error('Failed to delete instance:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete the instance. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (state: string) => {
    switch (state) {
      case "running": return "bg-green-100 text-green-800";
      case "stopped": return "bg-red-100 text-red-800";
      case "rebooting": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const [newInstance, setNewInstance] = useState({
    name: "",
    type: "virtual-pc",
    ami: "ami-12345"
  });

  const instanceTypes = [
    { id: "virtual-pc", name: "Virtual PC", specs: "4 vCPU, 16 GB RAM", cost: "£0.09736/hour (£70.10/month)" },
    { id: "t3.micro", name: "t3.micro", specs: "1 vCPU, 1 GB RAM", cost: "£0.0085/hour" },
    { id: "t3.small", name: "t3.small", specs: "1 vCPU, 2 GB RAM", cost: "£0.017/hour" },
    { id: "t3.medium", name: "t3.medium", specs: "2 vCPU, 4 GB RAM", cost: "£0.034/hour" },
    { id: "t3.large", name: "t3.large", specs: "2 vCPU, 8 GB RAM", cost: "£0.068/hour" }
  ];

  const runningInstances = instances.filter(i => i.state === "running").length;
  const stoppedInstances = instances.filter(i => i.state === "stopped").length;
  const rebootingInstances = instances.filter(i => i.state === "rebooting").length;

  const totalCost = instances.reduce((total, instance) => {
    if (instance.state === "running") {
      const hourlyRates: { [key: string]: number } = {
        "t3.micro": 0.0085,
        "t3.small": 0.017,
        "t3.medium": 0.034,
        "t3.large": 0.068,
        "m5.large": 0.079,
        "c5.large": 0.070,
        "virtual-pc": 0.09736
      };
      const hourlyRate = hourlyRates[instance.type] || 0.041;
      return total + (hourlyRate * 24 * 30);
    }
    return total;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Virtual Machines (EC2)</h1>
          <p className="text-gray-600">Manage your virtual compute instances</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF9900] hover:bg-[#e8890a]">
              <Plus className="h-4 w-4 mr-2" />
              Launch Instance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Launch New Instance</DialogTitle>
              <DialogDescription>
                Create a new virtual machine instance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instanceName">Instance Name</Label>
                <Input
                  id="instanceName"
                  placeholder="my-instance"
                  value={newInstance.name}
                  onChange={(e) => setNewInstance({...newInstance, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instanceType">Instance Type</Label>
                <Select onValueChange={(value) => setNewInstance({...newInstance, type: value})} defaultValue="virtual-pc">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {instanceTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-gray-500">{type.specs}</div>
                          <div className="text-xs text-green-600">{type.cost}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => createInstance(newInstance)}
                className="bg-[#FF9900] hover:bg-[#e8890a]"
                disabled={!newInstance.name}
              >
                Launch Instance
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instances</CardTitle>
            <Server className="h-4 w-4 text-[#FF9900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{instances.length}</div>
            <p className="text-xs text-muted-foreground">Virtual machines</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <Play className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{runningInstances}</div>
            <p className="text-xs text-muted-foreground">Active instances</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stopped</CardTitle>
            <Square className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stoppedInstances}</div>
            <p className="text-xs text-muted-foreground">Stopped instances</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Estimated cost</p>
          </CardContent>
        </Card>
      </div>

      {/* Instances Table */}
      <Card>
        <CardHeader>
          <CardTitle>Instances</CardTitle>
          <CardDescription>Your virtual machine instances</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading instances...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instance ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Public IP</TableHead>
                  <TableHead>Launch Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instances.map((instance) => (
                  <TableRow key={instance.id}>
                    <TableCell className="font-mono text-sm">{instance.id}</TableCell>
                    <TableCell className="font-medium">{instance.name}</TableCell>
                    <TableCell>{instance.type}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(instance.state)}>
                        {instance.state}
                      </Badge>
                    </TableCell>
                    <TableCell>{instance.publicIP}</TableCell>
                    <TableCell className="text-sm">{formatTime(instance.launchTime)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => rebootInstance(instance.id)}
                          disabled={instance.state === "rebooting"}
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600"
                          onClick={() => deleteInstance(instance.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EC2Dashboard;
