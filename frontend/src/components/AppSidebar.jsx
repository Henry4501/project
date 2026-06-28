import { Link, useLocation } from "react-router-dom";
import {
  SquaresFourIcon,
  LinkIcon,
  HeartIcon,
  FolderIcon,
  PlusIcon,
  TagIcon,
} from "@phosphor-icons/react";
import { UserButton } from "@clerk/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { label: "Dashboard", icon: SquaresFourIcon, to: "/" },
  { label: "All Links", icon: LinkIcon, to: "/links" },
  { label: "Favorites", icon: HeartIcon, to: "/favorites" },
  { label: "Tags", icon: TagIcon, to: "/tags" },
];

export default function AppSidebar({ collections = [], onAddCollection }) {
  const { pathname } = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <span className="text-lg font-semibold tracking-tight">Link Vault</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ label, icon: Icon, to }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild isActive={pathname === to}>
                    <Link to={to}>
                      <Icon size={18} />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Collections</SidebarGroupLabel>
          <SidebarMenuAction onClick={onAddCollection} title="New Collection">
            <PlusIcon size={16} />
          </SidebarMenuAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {collections.map((col) => (
                <SidebarMenuItem key={col.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === `/collections/${col.id}`}
                  >
                    <Link to={`/collections/${col.id}`}>
                      <FolderIcon size={18} />
                      <span>{col.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {collections.length === 0 && (
                <p className="px-2 py-1 text-xs text-muted-foreground">
                  No collections yet
                </p>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-4">
        <UserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
