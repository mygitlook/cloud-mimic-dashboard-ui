import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, 
  Plus, 
  Play, 
  Square, 
  RotateCcw, 
  Trash2,
  Monitor,
  HardDrive,
  Cpu,
  Activity
} from "lucide-react";

const EC2Dashboard = () => {
  // Load instances from localStorage on component mount
  const [instances, setInstances] = useState(() => {
    const savedInstances = localStorage.getItem('ec2-instances');
    return savedInstances ? JSON.parse(savedInstances) : [
      {
        id: "i-0123456789abcdef0",
        name: "Web Server 1",
        type: "t3.medium",
        state: "running",
        az: "us-east-1a",
        publicIp: "54.123.45.67",
        privateIp: "10.0.1.100",
        launchTime: "2024-01-15 10:30 AM",
        keyPair: "my-key-pair",
        securityGroup: "web-sg"
      },
      {
        id: "i-0987654321fedcba0",
        name: "Database Server",
        type: "t3.large",
        state: "stopped",
        az: "us-east-1b",
        publicIp: "-",
        privateIp: "10.0.2.50",
        launchTime: "2024-01-14 02:15 PM",
        keyPair: "db-key-pair",
        securityGroup: "db-sg"
      },
      {
        id: "i-0246813579bdfeca0",
        name: "Load Balancer",
        type: "t3.small",
        state: "running",
        az: "us-east-1c",
        publicIp: "34.123.45.89",
        privateIp: "10.0.3.25",
        launchTime: "2024-01-16 08:45 AM",
        keyPair: "lb-key-pair",
        securityGroup: "lb-sg"
      }
    ];
  });

  // Save instances to localStorage whenever instances change
  useEffect(() => {
    localStorage.setItem('ec2-instances', JSON.stringify(instances));
  }, [instances]);

  const [showLaunchDialog, setShowLaunchDialog] = useState(false);
  const [newInstance, setNewInstance] = useState({
    name: "",
    ami: "",
    instanceType: "",
    keyPair: "",
    securityGroup: "",
    subnet: ""
  });

  const instanceTypes = [
    { value: "t3.micro", label: "t3.micro (1 vCPU, 1 GiB RAM) - $0.0104/hour", specs: "1 vCPU, 1 GiB RAM" },
    { value: "t3.small", label: "t3.small (2 vCPUs, 2 GiB RAM) - $0.0208/hour", specs: "2 vCPUs, 2 GiB RAM" },
    { value: "t3.medium", label: "t3.medium (2 vCPUs, 4 GiB RAM) - $0.0416/hour", specs: "2 vCPUs, 4 GiB RAM" },
    { value: "t3.large", label: "t3.large (2 vCPUs, 8 GiB RAM) - $0.0832/hour", specs: "2 vCPUs, 8 GiB RAM" },
    { value: "m5.large", label: "m5.large (2 vCPUs, 8 GiB RAM) - $0.096/hour", specs: "2 vCPUs, 8 GiB RAM" },
    { value: "c5.large", label: "c5.large (2 vCPUs, 4 GiB RAM) - $0.085/hour", specs: "2 vCPUs, 4 GiB RAM" },
  ];

  const amis = [
    { value: "ami-0abcdef1234567890", label: "Amazon Linux 2023 AMI", description: "Amazon Linux 2023 AMI 2023.2.20231113.0 x86_64 HVM kernel-6.1" },
    { value: "ami-0987654321098765a", label: "Ubuntu Server 22.04 LTS", description: "Ubuntu Server 22.04 LTS (HVM), SSD Volume Type" },
    { value: "ami-0123456789abcdef1", label: "Windows Server 2022", description: "Microsoft Windows Server 2022 Base" },
    { value: "ami-0fedcba987654321b", label: "Red Hat Enterprise Linux 9", description: "Red Hat Enterprise Linux 9 (HVM), SSD Volume Type" },
  ];

  const handleLaunchInstance = () => {
    const newInstanceData = {
      id: `i-${Math.random().toString(36).substr(2, 17)}`,
      name: newInstance.name || "Unnamed Instance",
      type: newInstance.instanceType,
      state: "pending",
      az: "us-east-1a",
      publicIp: "-",
      privateIp: `10.0.1.${Math.floor(Math.random() * 255)}`,
      launchTime: new Date().toLocaleString(),
      keyPair: newInstance.keyPair,
      securityGroup: newInstance.securityGroup
    };

    setInstances([...instances, newInstanceData]);
    setShowLaunchDialog(false);
    setNewInstance({
      name: "",
      ami: "",
      instanceType: "",
      keyPair: "",
      securityGroup: "",
      subnet: ""
    });

    // Simulate instance starting up
    setTimeout(() => {
      setInstances(prev => prev.map(instance => 
        instance.id === newInstanceData.id 
          ? { ...instance, state: "running", publicIp: `54.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` }
          : instance
      ));
    }, 3000);
  };

  const handleInstanceAction = (instanceId: string, action: 'start' | 'stop' | 'reboot' | 'terminate') => {
    setInstances(prev => prev.map(instance => {
      if (instance.id === instanceId) {
        switch (action) {
          case 'start':
            return { ...instance, state: 'running', publicIp: `54.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` };
          case 'stop':
            return { ...instance, state: 'stopped', publicIp: '-' };
          case 'reboot':
            return { ...instance, state: 'rebooting' };
          case 'terminate':
            return null; // Will be filtered out
          default:
            return instance;
        }
      }
      return instance;
    }).filter(Boolean) as typeof instances);

    // Simulate state changes
    if (action === 'reboot') {
      setTimeout(() => {
        setInstances(prev => prev.map(instance => 
          instance.id === instanceId ? { ...instance, state: 'running' } : instance
        ));
      }, 2000);
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case "running": return "bg-green-100 text-green-800";
      case "stopped": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "stopping": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const runningInstances = instances.filter(i => i.state === "running").length;
  const stoppedInstances = instances.filter(i => i.state === "stopped").length;
  const totalInstances = instances.length;

  return (
    <div className="space-y-4 p-4 max-w-full overflow-x-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">EC2 Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base">Amazon Elastic Compute Cloud</p>
        </div>
        <Dialog open={showLaunchDialog} onOpenChange={setShowLaunchDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF9900] hover:bg-[#e8890a]">
              <Plus className="h-4 w-4 mr-2" />
              Launch Instance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Launch an Instance</DialogTitle>
              <DialogDescription>
                Configure your new EC2 instance with the options below
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="basics" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="instance">Instance Type</TabsTrigger>
                <TabsTrigger value="network">Network</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basics" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter instance name"
                      value={newInstance.name}
                      onChange={(e) => setNewInstance({...newInstance, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ami">Amazon Machine Image (AMI)</Label>
                    <Select onValueChange={(value) => setNewInstance({...newInstance, ami: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an AMI" />
                      </SelectTrigger>
                      <SelectContent>
                        {amis.map((ami) => (
                          <SelectItem key={ami.value} value={ami.value}>
                            <div>
                              <div className="font-medium">{ami.label}</div>
                              <div className="text-xs text-gray-500">{ami.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="instance" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instanceType">Instance Type</Label>
                  <Select onValueChange={(value) => setNewInstance({...newInstance, instanceType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select instance type" />
                    </SelectTrigger>
                    <SelectContent>
                      {instanceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.value}</div>
                            <div className="text-xs text-gray-500">{type.specs}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center">
                        <Cpu className="h-4 w-4 mr-2" />
                        vCPUs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center">
                        <HardDrive className="h-4 w-4 mr-2" />
                        Memory
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4 GiB</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="network" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyPair">Key Pair</Label>
                    <Select onValueChange={(value) => setNewInstance({...newInstance, keyPair: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select key pair" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="my-key-pair">my-key-pair</SelectItem>
                        <SelectItem value="prod-key-pair">prod-key-pair</SelectItem>
                        <SelectItem value="dev-key-pair">dev-key-pair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="securityGroup">Security Group</Label>
                    <Select onValueChange={(value) => setNewInstance({...newInstance, securityGroup: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select security group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">default</SelectItem>
                        <SelectItem value="web-sg">web-sg</SelectItem>
                        <SelectItem value="db-sg">db-sg</SelectItem>
                        <SelectItem value="ssh-sg">ssh-sg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="storage" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Root Volume</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Volume Type</Label>
                        <Select defaultValue="gp3">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gp3">General Purpose SSD (gp3)</SelectItem>
                            <SelectItem value="gp2">General Purpose SSD (gp2)</SelectItem>
                            <SelectItem value="io1">Provisioned IOPS SSD (io1)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Size (GiB)</Label>
                        <Input defaultValue="8" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>IOPS</Label>
                        <Input defaultValue="3000" type="number" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowLaunchDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleLaunchInstance}
                className="bg-[#FF9900] hover:bg-[#e8890a]"
                disabled={!newInstance.ami || !newInstance.instanceType}
              >
                Launch Instance
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instances</CardTitle>
            <Server className="h-4 w-4 text-[#FF9900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInstances}</div>
            <p className="text-xs text-muted-foreground">Across all regions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{runningInstances}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stopped</CardTitle>
            <Square className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stoppedInstances}</div>
            <p className="text-xs text-muted-foreground">Not running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <Monitor className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$127.45</div>
            <p className="text-xs text-muted-foreground">Estimated</p>
          </CardContent>
        </Card>
      </div>

      {/* Instances Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Instances</CardTitle>
          <CardDescription>Manage your EC2 instances</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Instance ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>AZ</TableHead>
                  <TableHead>Public IP</TableHead>
                  <TableHead>Private IP</TableHead>
                  <TableHead>Launch Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instances.map((instance) => (
                  <TableRow key={instance.id}>
                    <TableCell className="font-medium">{instance.name}</TableCell>
                    <TableCell className="font-mono text-xs sm:text-sm">{instance.id}</TableCell>
                    <TableCell>{instance.type}</TableCell>
                    <TableCell>
                      <Badge className={getStateColor(instance.state)}>
                        {instance.state}
                      </Badge>
                    </TableCell>
                    <TableCell>{instance.az}</TableCell>
                    <TableCell className="font-mono text-xs sm:text-sm">{instance.publicIp}</TableCell>
                    <TableCell className="font-mono text-xs sm:text-sm">{instance.privateIp}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{instance.launchTime}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleInstanceAction(instance.id, 'start')}
                          disabled={instance.state === 'running'}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleInstanceAction(instance.id, 'stop')}
                          disabled={instance.state === 'stopped'}
                        >
                          <Square className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleInstanceAction(instance.id, 'reboot')}
                          disabled={instance.state !== 'running'}
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600"
                          onClick={() => handleInstanceAction(instance.id, 'terminate')}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EC2Dashboard;
