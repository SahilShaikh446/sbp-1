import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOutIcon,
  Menu,
  UserPlus,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useEffect, useState, useRef } from "react";
import { cn } from "./lib/utils";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const sidebarRef = useRef(null);

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
    let timer;
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
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, isMobile]);

  const handleLogout = () => {
    dispatch({ type: "store/reset" });
    sessionStorage.clear();
    toast.success("You have successfully logged out!");
    navigate("/login");
    if (isMobile) setOpen(false); // Close sidebar on logout (mobile)
  };

  const toggleSidebar = () => {
    setOpen((prev) => !prev);
  };

  const links = [
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
      href: "/report",
      icon: <FileText className="h-5 w-5 flex-shrink-0" />,
    },
  ];

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          onMouseEnter={() => !isMobile && setIsHovered(true)}
          onMouseLeave={() => !isMobile && setIsHovered(false)}
          className={cn(
            "fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out",
            isMobile
              ? open
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0",
            "md:static md:flex md:flex-col"
          )}
        >
          <Sidebar
            collapsible={isMobile ? "none" : "icon"}
            className={cn(
              "border-r border-neutral-200 dark:border-neutral-700 h-full",
              isMobile
                ? "w-72 bg-white dark:bg-neutral-900"
                : "w-[60px] md:w-auto"
            )}
          >
            <SidebarHeader className="border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900  ">
              <div className="flex items-center gap-3">
                <div
                  className={`${
                    open || isMobile ? "w-[3rem]" : "w-[2rem]"
                  } rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <img
                    src="/1halfLogo.png"
                    alt="OK Agencies"
                    className="w-auto h-auto object-contain"
                  />
                </div>
                <motion.div
                  initial={false}
                  animate={{
                    opacity: open || isMobile ? 1 : 0,
                    width: open || isMobile ? "auto" : 0,
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <img
                    src="/2halfLogo.png"
                    alt="OK Agencies"
                    className="w-auto h-auto object-contain"
                  />
                </motion.div>
                {isMobile && (
                  <button
                    onClick={toggleSidebar}
                    className=" top-4 right-4 p-2 md:hidden"
                  >
                    <X className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
                  </button>
                )}
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {links.map((link, idx) => {
                      const isActive = window.location.pathname === link.href;
                      return (
                        <SidebarMenuItem key={idx}>
                          <SidebarMenuButton
                            asChild
                            className={cn(
                              "h-10 transition-colors duration-200",
                              isActive
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            )}
                            tooltip={
                              !open && !isMobile ? link.label : undefined
                            }
                          >
                            <Link
                              to={link.href}
                              className="flex items-center gap-3 w-full px-3"
                              onClick={() => isMobile && setOpen(false)}
                            >
                              <div className="flex-shrink-0">{link.icon}</div>
                              <motion.span
                                initial={false}
                                animate={{ opacity: open || isMobile ? 1 : 0 }}
                                transition={{
                                  duration: 0.2,
                                  ease: "easeInOut",
                                }}
                                className="text-sm font-medium whitespace-nowrap overflow-hidden"
                              >
                                {link.label}
                              </motion.span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-neutral-200 dark:border-neutral-700">
              <SidebarMenu>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="group relative transition-all duration-300 rounded-xl h-12 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  <div className="flex-shrink-0 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors duration-300">
                    <LogOutIcon className="h-5 w-5" />
                  </div>
                  <AnimatePresence>
                    {(open || isMobile) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between flex-1"
                      >
                        <span className="font-medium text-sm">Logout</span>
                        <ChevronRight className="h-4 w-4 transition-transform duration-200 opacity-0 group-hover:opacity-100" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SidebarMenuButton>
              </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
          </Sidebar>
        </div>

        {/* Main Content */}
        <div className="flex-1 h-screen overflow-auto">
          <div className="md:hidden bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="/1halfLogo.png"
                alt="OK Agencies"
                className="h-8 w-auto object-contain"
              />
            </div>
            <button
              onClick={toggleSidebar}
              className={cn(
                "p-2 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700",
                open && "hidden"
              )}
            >
              <Menu className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
            </button>
          </div>
          <div className="p-2 bg-white dark:bg-neutral-900 w-full h-full overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
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
