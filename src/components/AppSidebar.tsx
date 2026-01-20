
import { useTheme } from '../hooks/use-theme';
import {
  Archive,
  Eye,
  Folder,
  List,
  Plus,
  Search,
  Settings,
  User,
  LogOut,
  Sun,
  Moon,
  Monitor,
  ChevronRight
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from './ui/sidebar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';

// Navigation items
const navigationItems = [
  { id: 'new-issue', label: 'New Issue', icon: Plus, action: 'modal', modal: 'new-issue' },
  { id: 'search', label: 'Search', icon: Search, action: 'modal', modal: 'search' },
  { id: 'views', label: 'Views', icon: Eye, action: 'view', view: 'views' },
  { id: 'issues', label: 'Issues', icon: List, action: 'view', view: 'issues' },
  { id: 'projects', label: 'Projects', icon: Folder, action: 'view', view: 'projects' },
  { id: 'archives', label: 'Archives', icon: Archive, action: 'view', view: 'archives' },
];

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onModalOpen: (modal: string) => void;
}

export function AppSidebar({ activeView, onViewChange, onModalOpen }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <List className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Issue Tracker</span>
            <span className="text-xs text-muted-foreground">Project Management</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => {
                  if (item.action === 'view' && item.view) {
                    onViewChange(item.view);
                  } else if (item.action === 'modal' && item.modal) {
                    onModalOpen(item.modal);
                  }
                }}
                isActive={activeView === item.view}
                tooltip={item.label}
                className="w-full justify-start"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.id === 'issues' && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    12
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 h-10">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">JD</AvatarFallback>
          </Avatar>
          <span className="text-sm">John Doe</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ThemeToggle />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <>
      <DropdownMenuItem onClick={() => setTheme('light')}>
        <Sun className="mr-2 h-4 w-4" />
        Light
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('dark')}>
        <Moon className="mr-2 h-4 w-4" />
        Dark
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('system')}>
        <Monitor className="mr-2 h-4 w-4" />
        System
      </DropdownMenuItem>
    </>
  );
}

interface AppHeaderProps {
  activeView: string;
  onSearchClick: () => void;
}

export function AppHeader({ activeView, onSearchClick }: AppHeaderProps) {
  const getBreadcrumbText = () => {
    switch (activeView) {
      case 'issues': return 'Issues';
      case 'projects': return 'Projects';
      case 'views': return 'Views';
      case 'archives': return 'Archives';
      default: return 'Issues';
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        <SidebarTrigger className="-ml-1" />

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>Issue Tracker</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">{getBreadcrumbText()}</span>
        </div>

        {/* Large Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search issues, projects, comments..."
              className="pl-9 h-10 w-full bg-muted/50 border-0 focus-visible:bg-background"
              onClick={onSearchClick}
              readOnly
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Avatar Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <ThemeToggle />
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

interface NewIssueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewIssueModal({ open, onOpenChange }: NewIssueModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
          <DialogDescription>
            Add a new issue to track your work. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Modal content will be implemented with the IssueForm component.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
          <DialogDescription>
            Search through issues, projects, and comments with advanced filters.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Advanced search functionality will be implemented here.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}