import { useNavigate, useLocation } from 'react-router-dom';
import { Home, History, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/account/dashboard', icon: Home, label: 'Home' },
  { path: '/account/transactions', icon: History, label: 'History' },
  { path: '/account/send', icon: Send, label: 'Send' },
  { path: '/account/profile', icon: User, label: 'Profile' },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border safe-bottom z-50 lg:hidden">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200 min-w-[4rem] active:scale-95",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={cn(
                  "text-xs",
                  isActive && "font-medium"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
