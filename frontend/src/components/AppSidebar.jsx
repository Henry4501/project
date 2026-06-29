import { Link, useLocation } from "react-router-dom";

// Phosphor icons. Import name is the icon plus the "Icon" suffix.
// Docs: https://github.com/phosphor-icons/react
import {
  SquaresFourIcon,
  LinkIcon,
  HeartIcon,
  FolderIcon,
  PlusIcon,
  TagIcon,
} from "@phosphor-icons/react";

// UserButton renders the signed-in user's avatar with a sign-out menu.
// Docs: https://clerk.com/docs/components/user/user-button
import { UserButton } from "@clerk/react";

// shadcn's composable sidebar primitives.
// Docs: https://ui.shadcn.com/docs/components/sidebar
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

// Static nav config. Keeping it as data (not repeated JSX) means one map call
// renders all items and adding a link is a one-line change.
const navItems = [
  { label: "Dashboard", icon: SquaresFourIcon, to: "/" },
  { label: "All Links", icon: LinkIcon, to: "/links" },
  { label: "Favorites", icon: HeartIcon, to: "/favorites" },
  { label: "Tags", icon: TagIcon, to: "/tags" },
];

export default function AppSidebar({ collections = [], onAddCollection }) {
  // useLocation gives the current URL so we can highlight the active link.
  // Docs: https://reactrouter.com/start/declarative/routing
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
                  {/* asChild lets the shadcn button render our Router <Link>
                      instead of its own element, so we get SPA navigation. */}
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
          {/* The + action opens the create-collection dialog (handled by Layout). */}
          <SidebarMenuAction onClick={onAddCollection} title="New Collection">
            <PlusIcon size={16} />
          </SidebarMenuAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Collections come from the backend and are passed in as a prop. */}
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
