
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
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Plus, 
  Shield, 
  Key,
  UserPlus,
  Settings,
  Trash2,
  Lock,
  Loader2
} from "lucide-react";
import { iamService, IAMUser, IAMGroup, IAMPolicy } from "@/utils/iamService";

const IAMDashboard = () => {
  const [users, setUsers] = useState<IAMUser[]>([]);
  const [groups, setGroups] = useState<IAMGroup[]>([]);
  const [policies, setPolicies] = useState<IAMPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [showCreatePolicyDialog, setShowCreatePolicyDialog] = useState(false);
  const { toast } = useToast();

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    groups: [] as string[],
    console_access: true,
    programmatic_access: false
  });

  const [newPolicy, setNewPolicy] = useState({
    name: "",
    description: "",
    policy_document: "",
    effect: "Allow",
    actions: "",
    resources: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, groupsData, policiesData] = await Promise.all([
        iamService.getIAMUsers(),
        iamService.getIAMGroups(),
        iamService.getIAMPolicies()
      ]);
      
      setUsers(usersData);
      setGroups(groupsData);
      setPolicies(policiesData);
    } catch (error: any) {
      toast({
        title: "Error loading IAM data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      if (!newUser.username || !newUser.email || !newUser.password) {
        toast({
          title: "Validation Error",
          description: "Username, email, and password are required",
          variant: "destructive",
        });
        return;
      }

      const createdUser = await iamService.createIAMUser({
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        full_name: newUser.full_name,
        console_access: newUser.console_access,
        programmatic_access: newUser.programmatic_access,
        groups: newUser.groups
      });

      setUsers([createdUser, ...users]);
      setShowCreateUserDialog(false);
      setNewUser({
        username: "",
        email: "",
        password: "",
        full_name: "",
        groups: [],
        console_access: true,
        programmatic_access: false
      });

      toast({
        title: "User Created",
        description: `IAM user ${createdUser.username} has been created successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error creating user",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreatePolicy = async () => {
    try {
      if (!newPolicy.name) {
        toast({
          title: "Validation Error",
          description: "Policy name is required",
          variant: "destructive",
        });
        return;
      }

      let policyDocument;
      if (newPolicy.policy_document) {
        try {
          policyDocument = JSON.parse(newPolicy.policy_document);
        } catch {
          toast({
            title: "Invalid JSON",
            description: "Policy document must be valid JSON",
            variant: "destructive",
          });
          return;
        }
      } else {
        // Generate policy document from simple inputs
        policyDocument = {
          Version: "2012-10-17",
          Statement: [{
            Effect: newPolicy.effect,
            Action: newPolicy.actions.split(',').map(a => a.trim()),
            Resource: newPolicy.resources.split(',').map(r => r.trim())
          }]
        };
      }

      const createdPolicy = await iamService.createIAMPolicy({
        name: newPolicy.name,
        description: newPolicy.description,
        policy_document: policyDocument
      });

      setPolicies([createdPolicy, ...policies]);
      setShowCreatePolicyDialog(false);
      setNewPolicy({
        name: "",
        description: "",
        policy_document: "",
        effect: "Allow",
        actions: "",
        resources: ""
      });

      toast({
        title: "Policy Created",
        description: `Policy ${createdPolicy.name} has been created successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error creating policy",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    try {
      await iamService.deleteIAMUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      toast({
        title: "User Deleted",
        description: `IAM user ${username} has been deleted`,
      });
    } catch (error: any) {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-red-100 text-red-800";
      case "suspended": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const activeUsers = users.filter(u => u.status === "active").length;
  const mfaEnabledUsers = users.filter(u => u.mfa_enabled).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">IAM Dashboard</h1>
          <p className="text-gray-600">Identity and Access Management</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#FF9900] hover:bg-[#e8890a]">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add IAM User</DialogTitle>
                <DialogDescription>
                  Create a new IAM user with specific permissions
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">User Details</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  <TabsTrigger value="review">Review</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="Enter username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="user@company.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={newUser.full_name}
                      onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="consoleAccess"
                        checked={newUser.console_access}
                        onChange={(e) => setNewUser({...newUser, console_access: e.target.checked})}
                      />
                      <label htmlFor="consoleAccess" className="text-sm">Console Access</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="programmaticAccess"
                        checked={newUser.programmatic_access}
                        onChange={(e) => setNewUser({...newUser, programmatic_access: e.target.checked})}
                      />
                      <label htmlFor="programmaticAccess" className="text-sm">Programmatic Access</label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Add user to groups</h3>
                      <div className="space-y-2">
                        {groups.map((group) => (
                          <div key={group.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={group.name}
                              checked={newUser.groups.includes(group.name)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewUser({...newUser, groups: [...newUser.groups, group.name]});
                                } else {
                                  setNewUser({...newUser, groups: newUser.groups.filter(g => g !== group.name)});
                                }
                              }}
                            />
                            <label htmlFor={group.name} className="text-sm">
                              {group.name} - {group.description}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="review" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">User Details</h3>
                      <p className="text-sm text-gray-600">Username: {newUser.username}</p>
                      <p className="text-sm text-gray-600">Email: {newUser.email}</p>
                      <p className="text-sm text-gray-600">Full Name: {newUser.full_name}</p>
                      <p className="text-sm text-gray-600">Console Access: {newUser.console_access ? 'Yes' : 'No'}</p>
                      <p className="text-sm text-gray-600">Programmatic Access: {newUser.programmatic_access ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Groups</h3>
                      <p className="text-sm text-gray-600">{newUser.groups.join(", ") || "None"}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateUserDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateUser}
                  className="bg-[#FF9900] hover:bg-[#e8890a]"
                  disabled={!newUser.username || !newUser.email || !newUser.password}
                >
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreatePolicyDialog} onOpenChange={setShowCreatePolicyDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Create Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create Policy</DialogTitle>
                <DialogDescription>
                  Create a custom IAM policy with specific permissions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policyName">Policy Name</Label>
                    <Input
                      id="policyName"
                      placeholder="MyCustomPolicy"
                      value={newPolicy.name}
                      onChange={(e) => setNewPolicy({...newPolicy, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="effect">Effect</Label>
                    <Select onValueChange={(value) => setNewPolicy({...newPolicy, effect: value})} defaultValue="Allow">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Allow">Allow</SelectItem>
                        <SelectItem value="Deny">Deny</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Policy description"
                    value={newPolicy.description}
                    onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actions">Actions (comma-separated)</Label>
                  <Input
                    id="actions"
                    placeholder="s3:GetObject, s3:PutObject"
                    value={newPolicy.actions}
                    onChange={(e) => setNewPolicy({...newPolicy, actions: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resources">Resources (comma-separated)</Label>
                  <Input
                    id="resources"
                    placeholder="arn:aws:s3:::my-bucket/*"
                    value={newPolicy.resources}
                    onChange={(e) => setNewPolicy({...newPolicy, resources: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreatePolicyDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreatePolicy}
                  className="bg-[#FF9900] hover:bg-[#e8890a]"
                  disabled={!newPolicy.name}
                >
                  Create Policy
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-[#FF9900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">IAM users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MFA Enabled</CardTitle>
            <Lock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mfaEnabledUsers}</div>
            <p className="text-xs text-muted-foreground">Multi-factor auth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Policies</CardTitle>
            <Key className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.length}</div>
            <p className="text-xs text-muted-foreground">Total policies</p>
          </CardContent>
        </Card>
      </div>

      {/* Users and Policies Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage IAM users</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>MFA</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{user.username}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                        {user.groups && user.groups.length > 0 && (
                          <div className="text-xs text-blue-600">
                            Groups: {user.groups.join(", ")}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.mfa_enabled ? "default" : "outline"}>
                        {user.mfa_enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user.id, user.username)}
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

        <Card>
          <CardHeader>
            <CardTitle>Policies</CardTitle>
            <CardDescription>Manage IAM policies</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{policy.name}</div>
                        {policy.description && (
                          <div className="text-xs text-gray-500">{policy.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={policy.policy_type === "AWS Managed" ? "default" : "secondary"}>
                        {policy.policy_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                        {policy.policy_type === "Customer Managed" && (
                          <Button size="sm" variant="outline" className="text-red-600">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IAMDashboard;
