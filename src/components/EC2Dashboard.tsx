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
  Play, 
  Square, 
  RotateCcw, 
  Trash2, 
  Plus,
  DollarSign,
  Activity,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Instance {
  id: string;
  name: string;
  type: string;
  state: "running" | "stopped";
  publicIP: string;
  privateIP: string;
  launchTime: string;
  ami: string;
}

const EC2Dashboard = () => {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [isLaunchDialogOpen, setIsLaunchDialogOpen] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState("");
  const [selectedInstanceType, setSelectedInstanceType] = useState("");
  const [selectedAMI, setSelectedAMI] = useState("");
  const { toast } = useToast();

  const instanceTypes = [
    { id: "t3.micro", name: "t3.micro", specs: "1 vCPU, 1 GB RAM", hourlyRate: 0.0085 },
    { id: "t3.small", name: "t3.small", specs: "1 vCPU, 2 GB RAM", hourlyRate: 0.017 },
    { id: "t3.medium", name: "t3.medium", specs: "2 vCPUs, 4 GB RAM", hourlyRate: 0.034 },
    { id: "t3.large", name: "t3.large", specs: "2 vCPUs, 8 GB RAM", hourlyRate: 0.068 },
    { id: "m5.large", name: "m5.large", specs: "2 vCPUs, 8 GB RAM", hourlyRate: 0.079 },
    { id: "c5.large", name: "c5.large", specs: "2 vCPUs, 4 GB RAM", hourlyRate: 0.070 },
    { id: "virtual-pc", name: "Virtual PC", specs: "4 vCPUs, 16 GB RAM", hourlyRate: 2.92 } // £70.10 per month / 24 hours / 30 days
  ];

  const amis = [
    { id: "ami-12345", name: "Ubuntu Server 22.04 LTS", description: "64-bit (x86)" },
    { id: "ami-67890", name: "Amazon Linux 2023", description: "64-bit (x86)" },
    { id: "ami-11111", name: "Windows Server 2022", description: "64-bit (x86)" },
    { id: "ami-22222", name: "Red Hat Enterprise Linux 9", description: "64-bit (x86)" },
    { id: "ami-33333", name: "SUSE Linux Enterprise Server 15", description: "64-bit (x86)" }
  ];

  useEffect(() => {
    loadInstances();
  }, []);

  const loadInstances = () => {
    const savedInstances = localStorage.getItem('ec2-instances');
    if (savedInstances) {
      setInstances(JSON.parse(savedInstances));
    } else {
      // Default instances
      const defaultInstances: Instance[] = [
        {
          id: "i-1234567890abcdef0",
          name: "web-server-01",
          type: "t3.medium",
          state: "running",
          publicIP: "54.123.45.67",
          privateIP: "10.0.1.10",
          launchTime: "2024-01-15T10:30:00Z",
          ami: "ami-12345"
        },
        {
          id: "i-0987654321fedcba0",
          name: "database-server",
          type: "m5.large",
          state: "stopped",
          publicIP: "-",
          privateIP: "10.0.1.20",
          launchTime: "2024-01-10T14:20:00Z",
          ami: "ami-67890"
        },
        {
          id: "i-abcdef1234567890",
          name: "load-balancer",
          type: "c5.large",
          state: "running",
          publicIP: "52.87.123.45",
          privateIP: "10.0.1.30",
          launchTime: "2024-01-12T09:15:00Z",
          ami: "ami-11111"
        }
      ];
      setInstances(defaultInstances);
      saveInstances(defaultInstances);
    }
  };

  const saveInstances = (instanceList: Instance[]) => {
    localStorage.setItem('ec2-instances', JSON.stringify(instanceList));
    // Dispatch custom event to update dashboard stats
    window.dispatchEvent(new CustomEvent('ec2-instances-updated'));
  };

  const calculateMonthlyCost = (type: string, state: string) => {
    if (state !== "running") return 0;
    const instanceType = instanceTypes.find(t => t.id === type);
    return instanceType ? instanceType.hourlyRate * 24 * 30 : 0;
  };

  const launchInstance = () => {
    if (!newInstanceName || !selectedInstanceType || !selectedAMI) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newInstance: Instance = {
      id: `i-${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 8)}`,
      name: newInstanceName,
      type: selectedInstanceType,
      state: "running",
      publicIP: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      privateIP: `10.0.1.${Math.floor(Math.random() * 255)}`,
      launchTime: new Date().toISOString(),
      ami: selectedAMI
    };

    const updatedInstances = [...instances, newInstance];
    setInstances(updatedInstances);
    saveInstances(updatedInstances);

    toast({
      title: "Instance Launched",
      description: `${newInstanceName} has been launched successfully`,
    });

    setIsLaunchDialogOpen(false);
    setNewInstanceName("");
    setSelectedInstanceType("");
    setSelectedAMI("");
  };

  const startInstance = (id: string) => {
    const updatedInstances = instances.map(instance =>
      instance.id === id ? { ...instance, state: "running" as const } : instance
    );
    setInstances(updatedInstances);
    saveInstances(updatedInstances);
    
    const instance = instances.find(i => i.id === id);
    toast({
      title: "Instance Started",
      description: `${instance?.name} is now running`,
    });
  };

  const stopInstance = (id: string) => {
    const updatedInstances = instances.map(instance =>
      instance.id === id ? { ...instance, state: "stopped" as const } : instance
    );
    setInstances(updatedInstances);
    saveInstances(updatedInstances);
    
    const instance = instances.find(i => i.id === id);
    toast({
      title: "Instance Stopped",
      description: `${instance?.name} has been stopped`,
    });
  };

  const rebootInstance = (id: string) => {
    const instance = instances.find(i => i.id === id);
    toast({
      title: "Instance Rebooting",
      description: `${instance?.name} is being rebooted`,
    });
  };

  const terminateInstance = (id: string) => {
    const instance = instances.find(i => i.id === id);
    const updatedInstances = instances.filter(i => i.id !== id);
    setInstances(updatedInstances);
    saveInstances(updatedInstances);
    
    toast({
      title: "Instance Terminated",
      description: `${instance?.name} has been terminated`,
      variant: "destructive",
    });
  };

  const runningInstances = instances.filter(i => i.state === "running").length;
  const stoppedInstances = instances.filter(i => i.state === "stopped").length;
  const totalMonthlyCost = instances.reduce((sum, instance) => 
    sum + calculateMonthlyCost(instance.type, instance.state), 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Virtual Machines (EC2)</h1>
          <p className="text-gray-600">Launch and manage virtual server instances</p>
        </div>
        <Dialog open={isLaunchDialogOpen} onOpenChange={setIsLaunchDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2563eb] hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Launch Instance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Launch New Instance</DialogTitle>
              <DialogDescription>
                Configure your new virtual machine instance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="instance-name">Instance Name</Label>
                <Input
                  id="instance-name"
                  value={newInstanceName}
                  onChange={(e) => setNewInstanceName(e.target.value)}
                  placeholder="Enter instance name"
                />
              </div>
              <div>
                <Label htmlFor="instance-type">Instance Type</Label>
                <Select value={selectedInstanceType} onValueChange={setSelectedInstanceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select instance type" />
                  </SelectTrigger>
                  <SelectContent>
                    {instanceTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-gray-500">
                            {type.specs} - £{type.hourlyRate.toFixed(4)}/hour
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ami">Amazon Machine Image (AMI)</Label>
                <Select value={selectedAMI} onValueChange={setSelectedAMI}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AMI" />
                  </SelectTrigger>
                  <SelectContent>
                    {amis.map((ami) => (
                      <SelectItem key={ami.id} value={ami.id}>
                        <div>
                          <div className="font-medium">{ami.name}</div>
                          <div className="text-xs text-gray-500">{ami.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={launchInstance} className="w-full">
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
            <Server className="h-4 w-4 text-[#2563eb]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{instances.length}</div>
            <p className="text-xs text-muted-foreground">
              {runningInstances} running, {stoppedInstances} stopped
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
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
            <p className="text-xs text-muted-foreground">Inactive instances</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{totalMonthlyCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Estimated cost</p>
          </CardContent>
        </Card>
      </div>

      {/* Instances Table */}
      <Card>
        <CardHeader>
          <CardTitle>Instance Overview</CardTitle>
          <CardDescription>Manage your virtual machine instances</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Instance ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Public IP</TableHead>
                <TableHead>Private IP</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instances.map((instance) => (
                <TableRow key={instance.id}>
                  <TableCell className="font-medium">{instance.name}</TableCell>
                  <TableCell>{instance.id}</TableCell>
                  <TableCell>{instance.type}</TableCell>
                  <TableCell>
                    <Badge variant={instance.state === "running" ? "default" : "secondary"}>
                      {instance.state}
                    </Badge>
                  </TableCell>
                  <TableCell>{instance.publicIP}</TableCell>
                  <TableCell>{instance.privateIP}</TableCell>
                  <TableCell>£{calculateMonthlyCost(instance.type, instance.state).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {instance.state === "stopped" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startInstance(instance.id)}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => stopInstance(instance.id)}
                        >
                          <Square className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rebootInstance(instance.id)}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => terminateInstance(instance.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EC2Dashboard;
