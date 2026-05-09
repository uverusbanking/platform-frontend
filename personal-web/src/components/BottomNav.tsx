import { useNavigate, useLocation } from "react-router-dom";
import { Home, History, Send, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { path: "/account/dashboard", icon: Home, label: "Home" },
  { path: "/account/transactions", icon: History, label: "History" },
  { path: "/account/send", icon: Send, label: "Send" },
  { path: "/account/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-bottom z-50 lg:hidden">
      <div className="grid grid-cols-4 px-2 py-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 transition-colors duration-150",
                isActive ? "text-foreground" : "text-foreground-subtle",
              )}
              onClick={() => navigate(item.path)}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span
                className={cn(
                  "text-[10px]",
                  isActive ? "font-bold" : "font-medium",
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
