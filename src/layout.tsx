import { Link, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  CircuitBoard,
  Droplet,
  Earth,
  FileText,
  LayoutDashboard,
  LogOutIcon,
  Mail,
  UserPlus,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useEffect, useState, useRef } from "react";
import { cn } from "./lib/utils";
import { useAppSelector } from "./app/hooks";
import { resetStore } from "./app/store";
import Navbar from "./components/Navbar";

const MasterAdminSidebar = [
  {
    label: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Masters",
    href: "/masters",
    icon: <UserPlus className="h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "OIL Filteration Report",
    href: "/oil-report",
    icon: <Droplet className="h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "ACB Report",
    href: "/acb-report",
    icon: <FileText className="h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "HT Breaker Report",
    href: "/ht-breaker-report",
    icon: <CircuitBoard className="h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Earth Pit Report",
    href: "/earth-pit",
    icon: <Earth className="h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Contact Us",
    href: "/contact-us",
    icon: <Mail className="h-5 w-5 flex-shrink-0" />,
  },
];

const clientAdminSidebar = [
  {
    label: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "OIL Filteration Report",
    href: "/oil-report",
    icon: <Droplet className="h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "ACB Report",
    href: "/acb-report",
    icon: <FileText className="h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "HT Breaker Report",
    href: "/ht-breaker-report",
    icon: <CircuitBoard className="h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Earth Pit Report",
    href: "/earth-pit",
    icon: <Earth className="h-5 w-5 flex-shrink-0" />,
  },
];

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const role = useAppSelector((state) => state.auth.role);
  const sidebar =
    role === "Master Admin" ? MasterAdminSidebar : clientAdminSidebar;

  // Handle window resize to detect mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setOpen(false); // Close sidebar on desktop
      }
    };
    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle hover for desktop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isMobile) {
      if (isHovered) {
        timer = setTimeout(() => setOpen(true), 400);
      } else {
        timer = setTimeout(() => setOpen(false), 400);
      }
    }
    return () => clearTimeout(timer);
  }, [isHovered, isMobile]);

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, isMobile]);

  const handleLogout = () => {
    dispatch(resetStore());
    sessionStorage.clear();
    toast.success("You have successfully logged out!");
    navigate("/login");
    if (isMobile) setOpen(false); // Close sidebar on logout (mobile)
  };

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
      {/* Fixed navbar at top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16">
        <Navbar onMenuClick={toggleSidebar} />
      </div>

      {/* Content area below navbar */}
      <div className="flex flex-1  overflow-hidden">
        <SidebarProvider open={open} onOpenChange={setOpen}>
          {/* Mobile overlay */}
          {isMobile && open && (
            <div
              className="fixed inset-0 bg-black/50 z-30"
              onClick={() => setOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            ref={sidebarRef}
            onMouseEnter={() => !isMobile && setIsHovered(true)}
            onMouseLeave={() => !isMobile && setIsHovered(false)}
            className={cn(
              // Mobile: Fixed positioning
              isMobile && "fixed left-0 top-16 bottom-0 z-40",
              isMobile && "transition-transform duration-300 ease-in-out",
              isMobile && (open ? "translate-x-0" : "-translate-x-full"),
              // Desktop: Static positioning
              !isMobile && "relative flex-shrink-0"
            )}
          >
            <Sidebar
              collapsible={isMobile ? "none" : "icon"}
              className={cn(
                "border-r border-neutral-200 dark:border-neutral-700 h-full flex flex-col",
                isMobile
                  ? "w-72 bg-white dark:bg-neutral-900"
                  : open
                  ? "w-64"
                  : "w-16"
              )}
            >
              {/* Main content area - scrollable */}
              <SidebarContent className="flex-1 overflow-y-auto">
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1 md:mt-18 ">
                      {sidebar.map((link, idx) => {
                        const isActive = window.location.pathname === link.href;
                        return (
                          <SidebarMenuItem key={idx}>
                            <SidebarMenuButton
                              asChild
                              className={cn(
                                "h-10 transition-colors duration-200 w-full",
                                isActive
                                  ? "bg-blue-600 text-white hover:bg-blue-700 "
                                  : "text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                              )}
                              tooltip={
                                !open && !isMobile ? link.label : undefined
                              }
                            >
                              <Link
                                to={link.href}
                                className="flex items-center gap-3 w-full"
                                onClick={() => isMobile && setOpen(false)}
                              >
                                <div className="flex-shrink-0">{link.icon}</div>
                                {(open || isMobile) && (
                                  <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{
                                      duration: 0.2,
                                      ease: "easeInOut",
                                    }}
                                    className="text-sm font-medium whitespace-nowrap"
                                  >
                                    {link.label}
                                  </motion.span>
                                )}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              {/* Footer - always visible at bottom */}
              <SidebarFooter className="border-t border-neutral-200 dark:border-neutral-700  flex-shrink-0">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={handleLogout}
                      className="group w-full h-12 transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0 p-1">
                          <LogOutIcon className="h-5 w-5" />
                        </div>
                        {(open || isMobile) && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-between flex-1"
                          >
                            <span className="font-medium text-sm">Logout</span>
                            <ChevronRight className="h-4 w-4 transition-transform duration-200 opacity-0 group-hover:opacity-100" />
                          </motion.div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>
          </div>

          {/* Main content */}
          <main
            className="flex-1 overflow-auto bg-background p-4"
            style={{
              height: "calc(100vh - 3.5rem)", // Subtract navbar height (h-16 = 4rem)
              marginTop: "4rem", // Match navbar height to push content below
            }}
          >
            <Outlet />
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
};

export const Logo = () => {
  return (
    <Link
      to="/"
      className="font-normal flex items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <img
        src="/2halfLogo.png"
        alt="OK Agencies"
        className="h-8 w-auto object-contain"
      />
    </Link>
  );
};

export default Layout;
