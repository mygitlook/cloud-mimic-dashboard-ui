import * as React from "react"
import { useState } from "react"
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: React.ReactNode
  label?: string
  description?: string
}

interface NavSection {
  title?: string
  items: NavItem[]
}

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = useState("overview");

  const data = {
    user: {
      name: "Zeltra Cloud",
      email: "support@zeltracloud.com",
      imageUrl: "/avatars/01.png",
    },
    teams: [
      {
        name: "Acme Inc.",
        imageUrl: "/avatars/02.png",
      },
      {
        name: "Stark Industries",
        imageUrl: "/avatars/03.png",
      },
    ],
    navMain: [
      {
        title: "Overview",
        items: [
          { title: "Dashboard", url: "#", icon: LayoutDashboard, key: "overview" },
          { title: "Backend Setup", url: "/backend-setup", icon: Server, key: "backend-setup" },
        ],
      },
      {
        title: "Monitoring",
        items: [
          {
            title: "Instances",
            url: "/instances",
            icon: Cpu,
            label: "New",
            key: "instances"
          },
          {
            title: "Storage",
            url: "#",
            icon: HardDrive,
            key: "storage"
          },
          {
            title: "Database",
            url: "#",
            icon: Database,
            key: "database"
          },
          {
            title: "Network",
            url: "#",
            icon: Network,
            key: "network"
          },
          {
            title: "Security",
            url: "#",
            icon: Shield,
            key: "security"
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
            key: "users"
          },
          {
            title: "Billing",
            url: "/billing",
            icon: CreditCard,
            key: "billing"
          },
          {
            title: "Statistics",
            url: "#",
            icon: BarChart3,
            key: "statistics"
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
            key: "ai-assistant"
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
            key: "integrations"
          },
          {
            title: "Global CDN",
            url: "#",
            icon: Globe,
            key: "global-cdn"
          },
          {
            title: "Object Storage",
            url: "#",
            icon: Archive,
            key: "object-storage"
          },
          {
            title: "Media Streaming",
            url: "#",
            icon: MonitorSpeaker,
            key: "media-streaming"
          },
          {
            title: "Dedicated Support",
            url: "#",
            icon: Headphones,
            key: "dedicated-support"
          },
        ],
      },
    ],
  }

  return (
    <Sidebar className="w-64 border-r flex-col" {...props}>
      <div className="px-6 pb-4">
        <Button variant="secondary" className="w-full">
          Create Instance
        </Button>
      </div>
      <div className="flex-1 space-y-1 px-3">
        <NavItemList items={data.navMain} setActiveItem={setActiveItem} activeItem={activeItem} />
        <Separator />
        <NavItemList items={data.navPlatform} setActiveItem={setActiveItem} activeItem={activeItem} />
        <Separator />
        <NavItemList items={data.navApps} setActiveItem={setActiveItem} activeItem={activeItem} />
      </div>
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
            <Button variant="ghost" className="flex w-full cursor-pointer items-center justify-start px-2.5">
              Log out
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </Sidebar>
  )
}

interface SidebarSkeletonProps extends React.HTMLAttributes<HTMLElement> {}

export function AppSidebarSkeleton({ ...props }: SidebarSkeletonProps) {
  return (
    <Sidebar className="w-64 border-r flex-col" {...props}>
      <div className="px-6 pb-4">
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex-1 space-y-1 px-3">
        <NavItemListSkeleton />
        <Separator />
        <NavItemListSkeleton />
      </div>
      <div className="mt-auto mb-4 px-6">
        <Separator />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </Sidebar>
  )
}

interface NavItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  item: NavItem
  active?: boolean
  setActiveItem: (item: string) => void
}

function NavItem({ item, active, setActiveItem }: NavItemProps) {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "flex w-full items-center justify-start gap-2 p-2",
        active ? "font-semibold" : "font-normal"
      )}
    >
      <a href={item.url} onClick={() => setActiveItem(item.key || '')}>
        {item.icon}
        <span>{item.title}</span>
        {item.label ? (
          <Badge variant="secondary" className="ml-auto">
            {item.label}
          </Badge>
        ) : null}
      </a>
    </Button>
  )
}

interface NavItemListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: NavSection[] | undefined | NavItem[]
  setActiveItem: (item: string) => void
  activeItem: string
}

function NavItemList({ items, setActiveItem, activeItem }: NavItemListProps) {
  if (!items) {
    return null
  }

  return (
    <div className="grid gap-2">
      {Array.isArray(items) ? (
        items.map((item) => (
          <NavItem
            item={item}
            key={item.title}
            active={activeItem === item.key}
            setActiveItem={setActiveItem}
          />
        ))
      ) : (
        <>
          {items.map((section, index) => (
            <div key={index} className="pb-4 pt-2">
              {section.title ? <p className="mb-2 px-3 text-sm font-semibold text-muted-foreground">{section.title}</p> : null}
              {section.items?.map((item) => (
                <NavItem
                  item={item}
                  key={item.title}
                  active={activeItem === item.key}
                  setActiveItem={setActiveItem}
                />
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function NavItemListSkeleton() {
  return (
    <div className="grid gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  )
}

interface SidebarNavProps {
  className?: string
}

export function SidebarNav({ className }: SidebarNavProps) {
  return (
    <nav className={cn("flex space-x-2", className)}>
      <Button variant="ghost" size="sm" className="justify-start">
        <Home className="mr-2 h-4 w-4" />
        <span>Home</span>
      </Button>
      <Button variant="ghost" size="sm" className="justify-start">
        <Calendar className="mr-2 h-4 w-4" />
        <span>Calendar</span>
      </Button>
      <Button variant="ghost" size="sm" className="justify-start">
        <Inbox className="mr-2 h-4 w-4" />
        <span>Inbox</span>
      </Button>
    </nav>
  )
}

interface SearchProps {
  className?: string
}

export function Search({ className }: SearchProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Search..." className="pl-8" />
    </div>
  )
}

interface UserAccountNavProps {
  className?: string
}

export function UserAccountNav({ className }: UserAccountNavProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className={cn("h-8 w-8 p-0 data-[state=open]:bg-muted", className)}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
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
                <Input id="name" value="shadcn" className="col-span-3" />
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
        <Button variant="ghost" className="flex w-full cursor-pointer items-center justify-start px-2.5">
          Log out
        </Button>
      </PopoverContent>
    </Popover>
  )
}

interface ModeToggleProps extends React.HTMLAttributes<HTMLButtonElement> {}

export function ModeToggle({ className }: ModeToggleProps) {
  const [mounted, setMounted] = React.useState(false)
  const { setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme((theme) => (theme === "light" ? "dark" : "light"))}
      className={className}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

interface SettingsProps {
  className?: string
}

export function Settings({ className }: SettingsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("data-[state=open]:bg-muted", className)}>
          <Settings2 className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-2">
        <div className="flex items-center justify-between rounded-md border p-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium leading-none">Auto-approve mentions</p>
            <p className="text-sm text-muted-foreground">Automatically approve mentions in your profile.</p>
          </div>
          <Switch id="auto-approve" />
        </div>
        <div className="flex items-center justify-between rounded-md border p-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium leading-none">Dark Mode</p>
            <p className="text-sm text-muted-foreground">Toggles light and dark mode.</p>
          </div>
          <ModeToggle />
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface CommandMenuProps {
  className?: string
}

export function CommandMenu({ className }: CommandMenuProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Command className={className}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-[200px] justify-start pl-3 text-sm font-medium">
              <Search className="mr-2 h-4 w-4 opacity-50" />
              Search
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <CommandList>
              <CommandInput placeholder="Type a command or search..." />
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Settings">
                <CommandItem>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </CommandItem>
                <CommandItem>
                  <ModeToggle className="ml-auto" />
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </PopoverContent>
        </Popover>
      </Command>
    </>
  )
}

interface TeamSwitcherProps {
  className?: string
}

export function TeamSwitcher({ className }: TeamSwitcherProps) {
  const [mounted, setMounted] = React.useState(false)
  const [teams, setTeams] = React.useState([
    {
      name: "Acme Inc.",
      imageUrl: "/avatars/02.png",
    },
    {
      name: "Stark Industries",
      imageUrl: "/avatars/03.png",
    },
  ])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" role="combobox" aria-expanded={open} className={cn("w-[200px] justify-between", className)}>
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage src={teams[0].imageUrl} alt={teams[0].name} />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          {teams[0].name}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search team..." />
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup heading="Teams">
              {mounted &&
                teams.map((team) => (
                  <CommandItem key={team.name} onSelect={() => {
                    //   onSelect(team.name)
                      setOpen(false)
                    }}>
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage src={team.imageUrl} alt={team.name} />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    {team.name}
                    <Check className="ml-auto h-4 w-4" />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface MobileSidebarProps extends React.HTMLAttributes<HTMLElement> {}

export function MobileSidebar({ ...props }: MobileSidebarProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="mr-2 px-0">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-3/4 border-r">
        <ScrollArea className="h-full py-6 pr-6">
          {/* <SidebarNav className="mb-4" /> */}
          {/* <Search className="mb-6" /> */}
          <div className="mb-4">
            {/* <TeamSwitcher /> */}
          </div>
          <Separator />
          <Sidebar className="w-full flex-col pt-6">
            <div className="flex flex-col space-y-6">
              {/* <SidebarNav /> */}
              {/* <ModeToggle /> */}
              {/* <Settings /> */}
            </div>
          </Sidebar>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

interface MainNavItemProps extends React.HTMLAttributes<HTMLElement> {
  items?: NavItem[]
}

export function MainNavItem({ items }: MainNavItemProps) {
  return (
    <div className="hidden md:flex">
      {items?.length ? (
        <nav className="flex items-center space-x-6">
          {items?.map(
            (item, index) =>
              item.href ? (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground/80 sm:text-base",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              ) : null
          )}
        </nav>
      ) : null}
    </div>
  )
}

import {
  Sun,
  Moon,
  Menu,
  ChevronsUpDown,
  Check,
  Settings2,
} from "lucide-react"
import { useTheme } from "@/components/ui/theme-provider"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert",
    href: "/docs/components/alert",
    description:
      "Display a dismissible alert message to the user.",
  },
  {
    title: "Accordion",
    href: "/docs/components/accordion",
    description:
      "A vertically collapsing panel to display large amount of content in an organized manner.",
  },
  {
    title: "Avatar",
    href: "/docs/components/avatar",
    description:
      "An image or icon that represents a user or entity.",
  },
  {
    title: "Button",
    href: "/docs/components/button",
    description:
      "A button that triggers an action.",
  },
  {
    title: "Card",
    href: "/docs/components/card",
    description:
      "A container for grouping related content.",
  },
  {
    title: "Checkbox",
    href: "/docs/components/checkbox",
    description:
      "A control that allows the user to select one or more options from a set.",
  },
  {
    title: "Dialog",
    href: "/docs/components/dialog",
    description:
      "A window that appears on top of the main content.",
  },
  {
    title: "Hover Card",
    href: "/docs/components/hover-card",
    description:
      "For sighted users to preview information in place of the element that triggers it.",
  },
  {
    title: "Progress",
    href: "/docs/components/progress",
    description:
      "Displays the progress of a task.",
  },
  {
    title: "Radio Group",
    href: "/docs/components/radio-group",
    description:
      "A set of radio buttons that allow the user to select one option from a group.",
  },
  {
    title: "Scroll Area",
    href: "/docs/components/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Select",
    href: "/docs/components/select",
    description: "Displays a list of options for the user to select.",
  },
  {
    title: "Separator",
    href: "/docs/components/separator",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Sheet",
    href: "/docs/components/sheet",
    description:
      "A modal that slides in from the edge of the screen.",
  },
  {
    title: "Skeleton",
    href: "/docs/components/skeleton",
    description:
      "Display a placeholder preview of the content.",
  },
  {
    title: "Switch",
    href: "/docs/components/switch",
    description:
      "A control that allows the user to toggle between two states.",
  },
  {
    title: "Tabs",
    href: "/docs/components/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Textarea",
    href: "/docs/components/textarea",
    description:
      "A multi-line text input field.",
  },
  {
    title: "Toggle",
    href: "/docs/components/toggle",
    description:
      "A control that allows the user to toggle between two states.",
  },
]

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Documentation
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {}

function Sidebar({ className, children, ...props }: SidebarProps) {
  return (
    <div className={cn("hidden border-r bg-popover text-popover-foreground md:block", className)} {...props}>
      {children}
    </div>
  )
}
