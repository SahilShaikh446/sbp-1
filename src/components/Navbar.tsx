import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { resetStore } from "@/app/store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface EnhancedNavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: EnhancedNavbarProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const username = useAppSelector((state) => state.auth.username);
  const email = useAppSelector((state) => state.auth.email);

  const handleLogout = () => {
    dispatch(resetStore());
    sessionStorage.clear();
    toast.success("You have successfully logged out!");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b  backdrop-blur-md supports-[backdrop-filter]:bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <img
              src="/oka.png"
              alt="OK Agencies"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100/50">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            {getGreeting()}, {username?.split(" ")[0]}!
          </span>
        </div>

        <div className="flex items-center gap-2">

          {/* User Menu */}
          <DropdownMenu modal={true}>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-blue-50 px-2 transition-colors"
              >
                <Avatar className="h-8 w-8 ring-2 ring-blue-100">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm">
                    {username
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-3 border-b">
                <p className="font-medium text-gray-900">{username}</p>
                <p className="text-sm text-gray-500">{email}</p>
              </div>
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden hover:bg-blue-50 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
