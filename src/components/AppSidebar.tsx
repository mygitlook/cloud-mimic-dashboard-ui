
import * as React from "react"
import { useState } from "react"
import {
  Calendar,
  Home,
  Inbox,
  LayoutDashboard,
  Cpu,
  HardDrive,
  Database,
  Network,
  Shield,
  Users,
  CreditCard,
  BarChart3,
  Cloud,
  Lock,
  Zap,
  Globe,
  Archive,
  MonitorSpeaker,
  Headphones,
  Server
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url?: string
  disabled?: boolean
  external?: boolean
  icon?: React.ComponentType<any>
  label?: string
  description?: string
  key?: string
}

interface NavSection {
  title?: string
  items: NavItem[]
}

interface AppSidebarProps {
  activeService: string
  setActiveService: (service: string) => void
  onSignOut: () => Promise<void>
  userEmail: string
}

export function AppSidebar({ activeService, setActiveService, onSignOut, userEmail }: AppSidebarProps) {
  const data = {
    user: {
      name: "Zeltra Cloud",
      email: userEmail,
      imageUrl: "/avatars/01.png",
    },
    navMain: [
      {
        title: "Overview",
        items: [
          { title: "Dashboard", url: "#", icon: LayoutDashboard, key: "ec2" },
          { title: "Backend Setup", url: "/backend-setup", icon: Server, key: "backend-setup" },
        ],
      },
      {
        title: "Monitoring",
        items: [
          {
            title: "Instances",
            url: "#",
            icon: Cpu,
            label: "New",
            key: "ec2"
          },
          {
            title: "Storage",
            url: "#",
            icon: HardDrive,
            key: "s3"
          },
          {
            title: "Database",
            url: "#",
            icon: Database,
            key: "rds"
          },
          {
            title: "Network",
            url: "#",
            icon: Network,
            key: "vpc"
          },
          {
            title: "Security",
            url: "#",
            icon: Shield,
            key: "iam"
          },
        ],
      },
    ],
    navPlatform: [
      {
        title: "Platform",
        items: [
          {
            title: "Users",
            url: "#",
            icon: Users,
            key: "iam"
          },
          {
            title: "Billing",
            url: "#",
            icon: CreditCard,
            key: "billing"
          },
          {
            title: "Statistics",
            url: "#",
            icon: BarChart3,
            key: "monitoring"
          },
        ],
      },
    ],
    navApps: [
      {
        title: "Apps",
        items: [
          {
            title: "AI Assistant",
            url: "#",
            icon: Cloud,
            key: "ml"
          },
          {
            title: "IAM",
            url: "#",
            icon: Lock,
            key: "iam"
          },
          {
            title: "Integrations",
            url: "#",
            icon: Zap,
            key: "lambda"
          },
          {
            title: "Global CDN",
            url: "#",
            icon: Globe,
            key: "cdn"
          },
          {
            title: "Object Storage",
            url: "#",
            icon: Archive,
            key: "s3"
          },
          {
            title: "Media Streaming",
            url: "#",
            icon: MonitorSpeaker,
            key: "monitoring"
          },
          {
            title: "Dedicated Support",
            url: "#",
            icon: Headphones,
            key: "support"
          },
        ],
      },
    ],
  }

  const handleNavigation = (item: NavItem) => {
    if (item.url === "/backend-setup") {
      window.location.href = "/backend-setup"
    } else if (item.key) {
      setActiveService(item.key)
    }
  }

  return (
    <Sidebar className="w-64 border-r flex-col">
      <SidebarHeader>
        <div className="px-6 pb-4">
          <Button variant="secondary" className="w-full">
            Create Instance
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="flex-1 space-y-1 px-3">
          <NavItemList items={data.navMain} setActiveItem={setActiveService} activeItem={activeService} onNavigate={handleNavigation} />
          <Separator />
          <NavItemList items={data.navPlatform} setActiveItem={setActiveService} activeItem={activeService} onNavigate={handleNavigation} />
          <Separator />
          <NavItemList items={data.navApps} setActiveItem={setActiveService} activeItem={activeService} onNavigate={handleNavigation} />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="mt-auto mb-4 px-6">
          <Separator />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="group flex w-full items-center justify-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={data.user.imageUrl} alt={data.user.name} />
                  <AvatarFallback>ZC</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-medium leading-none">{data.user.name}</span>
                  <span className="text-xs text-muted-foreground">{data.user.email}</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60" align="end">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="flex w-full cursor-pointer items-center justify-start px-2.5">
                    Edit Profile
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-96">
                  <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                      Make changes to your profile here. Click save when you're done.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={data.user.name} className="col-span-3" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" value="shadcn" className="col-span-3" />
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button type="submit">Save changes</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
              <Separator />
              <Button variant="ghost" className="flex w-full cursor-pointer items-center justify-start px-2.5">
                Settings
              </Button>
              <Button 
                variant="ghost" 
                className="flex w-full cursor-pointer items-center justify-start px-2.5"
                onClick={onSignOut}
              >
                Log out
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

interface NavItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  item: NavItem
  active?: boolean
  setActiveItem: (item: string) => void
  onNavigate: (item: NavItem) => void
}

function NavItem({ item, active, setActiveItem, onNavigate }: NavItemProps) {
  const IconComponent = item.icon

  return (
    <Button
      variant="ghost"
      className={cn(
        "flex w-full items-center justify-start gap-2 p-2",
        active ? "font-semibold bg-accent" : "font-normal"
      )}
      onClick={() => onNavigate(item)}
    >
      {IconComponent && <IconComponent className="h-4 w-4" />}
      <span>{item.title}</span>
      {item.label ? (
        <Badge variant="secondary" className="ml-auto">
          {item.label}
        </Badge>
      ) : null}
    </Button>
  )
}

interface NavItemListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: NavSection[]
  setActiveItem: (item: string) => void
  activeItem: string
  onNavigate: (item: NavItem) => void
}

function NavItemList({ items, setActiveItem, activeItem, onNavigate }: NavItemListProps) {
  if (!items) {
    return null
  }

  return (
    <div className="grid gap-2">
      {items.map((section, index) => (
        <div key={index} className="pb-4 pt-2">
          {section.title ? <p className="mb-2 px-3 text-sm font-semibold text-muted-foreground">{section.title}</p> : null}
          {section.items?.map((item) => (
            <NavItem
              item={item}
              key={item.title}
              active={activeItem === item.key}
              setActiveItem={setActiveItem}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
