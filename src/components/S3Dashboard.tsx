
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  HardDrive, 
  Plus, 
  Upload, 
  Download, 
  Trash2,
  Folder,
  File,
  Globe,
  Lock,
  Settings
} from "lucide-react";

const S3Dashboard = () => {
  const [buckets, setBuckets] = useState([
    {
      name: "my-app-assets",
      region: "us-east-1",
      created: "2024-01-10",
      size: "2.4 GB",
      objects: 1247,
      public: false,
      versioning: true
    },
    {
      name: "backup-storage-2024",
      region: "us-west-2", 
      created: "2024-01-15",
      size: "15.7 GB",
      objects: 89,
      public: false,
      versioning: false
    },
    {
      name: "static-website",
      region: "us-east-1",
      created: "2024-01-08",
      size: "156 MB",
      objects: 523,
      public: true,
      versioning: false
    },
    {
      name: "data-lake-raw",
      region: "eu-west-1",
      created: "2024-01-12",
      size: "47.2 GB",
      objects: 3456,
      public: false,
      versioning: true
    }
  ]);

  const [selectedBucket, setSelectedBucket] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newBucket, setNewBucket] = useState({
    name: "",
    region: "us-east-1",
    versioning: false,
    encryption: "AES256",
    publicAccess: false
  });

  const [bucketContents] = useState([
    {
      name: "documents/",
      type: "folder",
      size: "-",
      modified: "2024-01-20 10:30 AM",
      storageClass: "-"
    },
    {
      name: "images/",
      type: "folder", 
      size: "-",
      modified: "2024-01-19 03:45 PM",
      storageClass: "-"
    },
    {
      name: "config.json",
      type: "file",
      size: "2.3 KB",
      modified: "2024-01-18 11:20 AM",
      storageClass: "Standard"
    },
    {
      name: "backup.zip",
      type: "file",
      size: "45.7 MB",
      modified: "2024-01-17 09:15 AM",
      storageClass: "Standard-IA"
    },
    {
      name: "logs.txt",
      type: "file",
      size: "124 KB",
      modified: "2024-01-16 06:30 PM",
      storageClass: "Standard"
    }
  ]);

  const regions = [
    "us-east-1", "us-east-2", "us-west-1", "us-west-2",
    "eu-west-1", "eu-west-2", "eu-central-1",
    "ap-southeast-1", "ap-southeast-2", "ap-northeast-1"
  ];

  const handleCreateBucket = () => {
    const newBucketData = {
      name: newBucket.name,
      region: newBucket.region,
      created: new Date().toISOString().split('T')[0],
      size: "0 B",
      objects: 0,
      public: newBucket.publicAccess,
      versioning: newBucket.versioning
    };

    setBuckets([...buckets, newBucketData]);
    setShowCreateDialog(false);
    setNewBucket({
      name: "",
      region: "us-east-1", 
      versioning: false,
      encryption: "AES256",
      publicAccess: false
    });
  };

  const totalBuckets = buckets.length;
  const totalObjects = buckets.reduce((sum, bucket) => sum + bucket.objects, 0);
  const totalSize = buckets.reduce((sum, bucket) => {
    const sizeNum = parseFloat(bucket.size);
    const unit = bucket.size.split(' ')[1];
    let bytes = sizeNum;
    
    if (unit === 'KB') bytes *= 1024;
    else if (unit === 'MB') bytes *= 1024 * 1024;
    else if (unit === 'GB') bytes *= 1024 * 1024 * 1024;
    
    return sum + bytes;
  }, 0);

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const monthlyCost = (totalSize / (1024 * 1024 * 1024) * 0.023).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">S3 Management Console</h1>
          <p className="text-gray-600">Amazon Simple Storage Service</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#FF9900] hover:bg-[#e8890a]">
                <Plus className="h-4 w-4 mr-2" />
                Create Bucket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Bucket</DialogTitle>
                <DialogDescription>
                  Create a new S3 bucket to store your objects
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bucketName">Bucket Name</Label>
                  <Input
                    id="bucketName"
                    placeholder="Enter bucket name (must be globally unique)"
                    value={newBucket.name}
                    onChange={(e) => setNewBucket({...newBucket, name: e.target.value})}
                  />
                  <p className="text-xs text-gray-500">
                    Bucket names must be between 3-63 characters, lowercase letters, numbers, and hyphens only
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">AWS Region</Label>
                  <Select onValueChange={(value) => setNewBucket({...newBucket, region: value})} defaultValue="us-east-1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Bucket Settings</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="versioning"
                        checked={newBucket.versioning}
                        onChange={(e) => setNewBucket({...newBucket, versioning: e.target.checked})}
                      />
                      <Label htmlFor="versioning">Enable versioning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="publicAccess"
                        checked={newBucket.publicAccess}
                        onChange={(e) => setNewBucket({...newBucket, publicAccess: e.target.checked})}
                      />
                      <Label htmlFor="publicAccess">Enable public access (not recommended)</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="encryption">Default Encryption</Label>
                  <Select onValueChange={(value) => setNewBucket({...newBucket, encryption: value})} defaultValue="AES256">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AES256">AES-256 (S3 Managed)</SelectItem>
                      <SelectItem value="KMS">AWS KMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateBucket}
                  className="bg-[#FF9900] hover:bg-[#e8890a]"
                  disabled={!newBucket.name || newBucket.name.length < 3}
                >
                  Create Bucket
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
            <CardTitle className="text-sm font-medium">Total Buckets</CardTitle>
            <HardDrive className="h-4 w-4 text-[#FF9900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBuckets}</div>
            <p className="text-xs text-muted-foreground">Across all regions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Objects</CardTitle>
            <File className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalObjects.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Files and folders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <Settings className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatSize(totalSize)}</div>
            <p className="text-xs text-muted-foreground">Storage used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <Globe className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyCost}</div>
            <p className="text-xs text-muted-foreground">Estimated</p>
          </CardContent>
        </Card>
      </div>

      {/* Buckets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Buckets</CardTitle>
          <CardDescription>Manage your S3 buckets</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Objects</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Versioning</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buckets.map((bucket, index) => (
                <TableRow key={index} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedBucket(bucket)}>
                  <TableCell className="font-medium">{bucket.name}</TableCell>
                  <TableCell>{bucket.region}</TableCell>
                  <TableCell>{bucket.created}</TableCell>
                  <TableCell>{bucket.size}</TableCell>
                  <TableCell>{bucket.objects.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={bucket.public ? "destructive" : "secondary"}>
                      {bucket.public ? <Globe className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                      {bucket.public ? "Public" : "Private"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={bucket.versioning ? "default" : "outline"}>
                      {bucket.versioning ? "Enabled" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Upload className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
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

      {/* Bucket Contents (shown when bucket is selected) */}
      {selectedBucket && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Bucket: {selectedBucket.name}</CardTitle>
                <CardDescription>Objects in this bucket</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button size="sm" variant="outline">
                  <Folder className="h-4 w-4 mr-2" />
                  Create Folder
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedBucket(null)}>
                  Close
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Storage Class</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bucketContents.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="flex items-center">
                      {item.type === "folder" ? (
                        <Folder className="h-4 w-4 mr-2 text-blue-500" />
                      ) : (
                        <File className="h-4 w-4 mr-2 text-gray-500" />
                      )}
                      {item.name}
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.modified}</TableCell>
                    <TableCell>{item.storageClass}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
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
      )}
    </div>
  );
};

export default S3Dashboard;
