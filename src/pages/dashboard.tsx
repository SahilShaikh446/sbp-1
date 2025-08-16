"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Menu,
  Search,
  Bell,
  User,
  LayoutDashboard,
  UserPlus,
  Mail,
  BarChart3,
  ChevronRight,
  Home,
  Settings,
  LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

("use client");

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  {
    title: "Total Reports",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: FileText,
    color: "blue",
  },
  {
    title: "Active Users",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "green",
  },
  {
    title: "Messages",
    value: "456",
    change: "-2.1%",
    trend: "down",
    icon: Mail,
    color: "orange",
  },
  {
    title: "Analytics",
    value: "98.5%",
    change: "+5.4%",
    trend: "up",
    icon: BarChart3,
    color: "purple",
  },
];

const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  green: {
    bg: "bg-green-50",
    icon: "text-green-600",
    badge: "bg-green-100 text-green-700",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    badge: "bg-purple-100 text-purple-700",
  },
};

function DashboardStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
        const colors = colorClasses[stat.color as keyof typeof colorClasses];

        return (
          <Card
            key={stat.title}
            className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <Icon className={`h-4 w-4 ${colors.icon}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <Badge
                    variant="secondary"
                    className={`mt-1 ${colors.badge} flex items-center gap-1`}
                  >
                    <TrendIcon className="h-3 w-3" />
                    {stat.change}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <div
              className={`absolute bottom-0 left-0 right-0 h-1 ${colors.bg.replace(
                "50",
                "200"
              )}`}
            />
          </Card>
        );
      })}
    </div>
  );
}

interface EnhancedNavbarProps {
  onMenuClick?: () => void;
}

function EnhancedNavbar({ onMenuClick }: EnhancedNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const username = "John Doe";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden hover:bg-blue-50"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OK</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-gray-900 text-lg">OK AGENCIES</h1>
                <p className="text-xs text-gray-500 -mt-1">
                  Business Management Platform
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 transition-all duration-200"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Greeting */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              {getGreeting()}, {username.split(" ")[0]}!
            </span>
          </div>

          {/* Notifications */}
          <DropdownMenu modal={true}>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-blue-50"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 hover:bg-red-500 text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3 border-b">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-500">
                  You have 3 unread messages
                </p>
              </div>
              <DropdownMenuItem className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">New report generated</p>
                    <p className="text-xs text-gray-500">
                      Oil filtration report is ready
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">System update</p>
                    <p className="text-xs text-gray-500">
                      Dashboard has been updated
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu modal={true}>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-blue-50 px-3"
              >
                <Avatar className="h-8 w-8 ring-2 ring-blue-100">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                    {username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  KK
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-3 border-b">
                <p className="font-medium text-gray-900">{username}</p>
                <p className="text-sm text-gray-500">john.doe@okagencies.com</p>
              </div>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
const sidebarItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Masters",
    href: "/masters",
    icon: UserPlus,
  },
  {
    label: "OIL Filteration Report",
    href: "/oil-report",
    icon: FileText,
  },
  {
    label: "Contact Us",
    href: "/contact-us",
    icon: Mail,
  },
  {
    label: "ABC Report",
    href: "/abc-report",
    icon: BarChart3,
  },
];

interface EnhancedSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

function EnhancedSidebar({ isOpen, onClose }: EnhancedSidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Main Menu
              </h2>
              <div className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-11 px-3 text-left font-medium transition-all duration-200",
                        item.active
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-r-2 border-blue-600"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                        hoveredItem === item.href &&
                          !item.active &&
                          "bg-gray-50 text-gray-900"
                      )}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={onClose}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          item.active ? "text-blue-600" : "text-gray-400"
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                      {item.active && (
                        <ChevronRight className="ml-auto h-4 w-4 text-blue-600" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-10 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <Home className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Home</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-10 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Settings</span>
                </Button>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

import { Clock, CheckCircle, AlertCircle, Info } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "report",
    title: "Oil Filtration Report Generated",
    description: "Monthly report for Client ABC completed",
    time: "2 minutes ago",
    status: "completed",
    user: "John Doe",
    icon: FileText,
  },
  {
    id: 2,
    type: "user",
    title: "New User Registration",
    description: "Sarah Johnson joined as Admin",
    time: "15 minutes ago",
    status: "info",
    user: "System",
    icon: User,
  },
  {
    id: 3,
    type: "message",
    title: "Contact Form Submission",
    description: "New inquiry from potential client",
    time: "1 hour ago",
    status: "pending",
    user: "Contact Form",
    icon: Mail,
  },
  {
    id: 4,
    type: "report",
    title: "ABC Report Updated",
    description: "Quarterly analysis data refreshed",
    time: "3 hours ago",
    status: "completed",
    user: "Mike Wilson",
    icon: FileText,
  },
];

const statusConfig = {
  completed: {
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
    iconColor: "text-green-600",
  },
  pending: {
    color: "bg-orange-100 text-orange-700",
    icon: AlertCircle,
    iconColor: "text-orange-600",
  },
  info: {
    color: "bg-blue-100 text-blue-700",
    icon: Info,
    iconColor: "text-blue-600",
  },
};

function RecentActivity() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Clock className="h-5 w-5 text-gray-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          const StatusIcon =
            statusConfig[activity.status as keyof typeof statusConfig].icon;
          const statusColor =
            statusConfig[activity.status as keyof typeof statusConfig].color;
          const iconColor =
            statusConfig[activity.status as keyof typeof statusConfig]
              .iconColor;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <Icon className="h-5 w-5 text-gray-600" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 text-sm">
                    {activity.title}
                  </h4>
                  <StatusIcon className={`h-4 w-4 ${iconColor}`} />
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-gray-200 text-gray-600">
                        {activity.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500">
                      {activity.user}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${statusColor}`}
                  >
                    {activity.time}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  return (
    <main className="p-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            <Plus className="h-4 w-4" />
            New Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart Card */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  Chart visualization would go here
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Connect your analytics to see performance data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivity />
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <FileText className="h-5 w-5 text-green-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 bg-transparent"
            >
              <FileText className="h-5 w-5 text-blue-600" />
              Generate Oil Report
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 bg-transparent"
            >
              <Users className="h-5 w-5 text-green-600" />
              Manage Users
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 bg-transparent"
            >
              <Calendar className="h-5 w-5 text-purple-600" />
              Schedule Meeting
            </Button>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">
                  Operational
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Services</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">
                  Operational
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Report Generation</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-700">
                  Maintenance
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Email Service</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">
                  Operational
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
