
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  CreditCard,
  AlertTriangle,
  BarChart3
} from "lucide-react";

const BillingDashboard = () => {
  const currentMonthCost = 247.83;
  const lastMonthCost = 189.42;
  const forecastedCost = 312.45;
  const budgetLimit = 300.00;
  const budgetUsed = (currentMonthCost / budgetLimit) * 100;

  const costByService = [
    { service: "EC2-Instance", cost: 127.45, percentage: 51.4, change: "+12.3%" },
    { service: "RDS", cost: 67.20, percentage: 27.1, change: "+5.7%" },
    { service: "S3", cost: 23.80, percentage: 9.6, change: "-2.1%" },
    { service: "Lambda", cost: 12.45, percentage: 5.0, change: "+23.4%" },
    { service: "CloudFront", cost: 8.93, percentage: 3.6, change: "+1.2%" },
    { service: "Route 53", cost: 5.00, percentage: 2.0, change: "0%" },
    { service: "CloudWatch", cost: 3.00, percentage: 1.2, change: "+8.5%" }
  ];

  const costByRegion = [
    { region: "us-east-1", cost: 156.78, percentage: 63.3 },
    { region: "us-west-2", cost: 45.32, percentage: 18.3 },
    { region: "eu-west-1", cost: 28.90, percentage: 11.7 },
    { region: "ap-southeast-1", cost: 16.83, percentage: 6.8 }
  ];

  const dailyCosts = [
    { date: "2024-01-01", cost: 8.12 },
    { date: "2024-01-02", cost: 7.89 },
    { date: "2024-01-03", cost: 9.45 },
    { date: "2024-01-04", cost: 8.76 },
    { date: "2024-01-05", cost: 10.23 },
    { date: "2024-01-06", cost: 9.87 },
    { date: "2024-01-07", cost: 8.54 },
    { date: "2024-01-08", cost: 11.32 },
    { date: "2024-01-09", cost: 9.98 },
    { date: "2024-01-10", cost: 8.43 }
  ];

  const bills = [
    { month: "January 2024", amount: 247.83, status: "current", dueDate: "2024-02-01" },
    { month: "December 2023", amount: 189.42, status: "paid", dueDate: "2024-01-01" },
    { month: "November 2023", amount: 203.17, status: "paid", dueDate: "2023-12-01" },
    { month: "October 2023", amount: 176.95, status: "paid", dueDate: "2023-11-01" },
    { month: "September 2023", amount: 164.23, status: "paid", dueDate: "2023-10-01" }
  ];

  const costAlerts = [
    { 
      type: "Budget Alert", 
      message: "You have exceeded 80% of your monthly budget ($300)",
      severity: "warning",
      date: "2024-01-28"
    },
    {
      type: "Cost Spike",
      message: "EC2 costs increased by 15% compared to last week",
      severity: "info", 
      date: "2024-01-27"
    },
    {
      type: "Forecast Alert",
      message: "Projected to exceed budget by $12.45 this month",
      severity: "warning",
      date: "2024-01-26"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "current": return "bg-yellow-100 text-yellow-800";
      case "paid": return "bg-green-100 text-green-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      case "info": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Billing & Cost Management</h1>
        <p className="text-gray-600">Monitor and manage your AWS costs</p>
      </div>

      {/* Cost Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-[#FF9900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonthCost}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +30.8% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Month</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${lastMonthCost}</div>
            <p className="text-xs text-muted-foreground">December 2023</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecasted</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${forecastedCost}</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              Above budget by $12.45
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Usage</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetUsed.toFixed(1)}%</div>
            <Progress value={budgetUsed} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">${budgetLimit} monthly budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Cost Overview</TabsTrigger>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="budgets">Budgets & Alerts</TabsTrigger>
          <TabsTrigger value="reports">Cost Explorer</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost by Service */}
            <Card>
              <CardHeader>
                <CardTitle>Cost by Service</CardTitle>
                <CardDescription>Current month breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costByService.map((item) => (
                    <div key={item.service} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{item.service}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold">${item.cost}</span>
                            <Badge variant={item.change.startsWith('+') ? "destructive" : "default"} className="text-xs">
                              {item.change}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                        <span className="text-xs text-muted-foreground">{item.percentage}% of total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cost by Region */}
            <Card>
              <CardHeader>
                <CardTitle>Cost by Region</CardTitle>
                <CardDescription>Geographic distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costByRegion.map((item) => (
                    <div key={item.region} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{item.region}</span>
                          <span className="text-sm font-bold">${item.cost}</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                        <span className="text-xs text-muted-foreground">{item.percentage}% of total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Cost Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Cost Trend</CardTitle>
              <CardDescription>Last 10 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Daily Cost</TableHead>
                    <TableHead>Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyCosts.map((day, index) => {
                    const previousDay = dailyCosts[index - 1];
                    const change = previousDay ? ((day.cost - previousDay.cost) / previousDay.cost * 100).toFixed(1) : 0;
                    return (
                      <TableRow key={day.date}>
                        <TableCell>{day.date}</TableCell>
                        <TableCell>${day.cost}</TableCell>
                        <TableCell>
                          {previousDay && (
                            <Badge variant={parseFloat(change) > 0 ? "destructive" : "default"}>
                              {parseFloat(change) > 0 ? '+' : ''}{change}%
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your AWS bills</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Billing Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills.map((bill) => (
                    <TableRow key={bill.month}>
                      <TableCell className="font-medium">{bill.month}</TableCell>
                      <TableCell>${bill.amount}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(bill.status)}>
                          {bill.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{bill.dueDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                          <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                          {bill.status === "current" && (
                            <button className="text-green-600 hover:text-green-800 text-sm">Pay Now</button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Status</CardTitle>
                <CardDescription>Monthly budget monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Monthly Budget</span>
                  <span className="text-lg font-bold">${budgetLimit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Spent</span>
                  <span className="text-lg font-bold">${currentMonthCost}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Remaining</span>
                  <span className={`text-lg font-bold ${budgetLimit - currentMonthCost < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${(budgetLimit - currentMonthCost).toFixed(2)}
                  </span>
                </div>
                <Progress value={budgetUsed} className="h-4" />
                <p className="text-xs text-muted-foreground">
                  {budgetUsed.toFixed(1)}% of budget used
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Alerts</CardTitle>
                <CardDescription>Recent notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {costAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                      <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-500" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{alert.type}</span>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Explorer</CardTitle>
              <CardDescription>Analyze your AWS costs and usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Cost Explorer</h3>
                <p className="text-gray-600 mb-4">
                  Dive deep into your cost and usage data with interactive charts and reports
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">• View costs by service, account, or tag</p>
                  <p className="text-sm text-gray-500">• Analyze trends over time</p>
                  <p className="text-sm text-gray-500">• Create custom reports</p>
                  <p className="text-sm text-gray-500">• Set up automated reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingDashboard;
