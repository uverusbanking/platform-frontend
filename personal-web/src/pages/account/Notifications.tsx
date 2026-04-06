import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { formatRelativeTime } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import PageHeader from '@/components/PageHeader';
import { AppLayout } from '@/components/AppLayout';
import { 
  Bell, 
  CheckCheck,
  ArrowDownLeft,
  ArrowUpRight,
  AlertCircle,
  Info
} from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, loading, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <ArrowDownLeft size={16} className="text-success sm:hidden" />;
      case 'debit':
        return <ArrowUpRight size={16} className="text-destructive sm:hidden" />;
      case 'error':
        return <AlertCircle size={16} className="text-destructive sm:hidden" />;
      default:
        return <Info size={16} className="text-primary sm:hidden" />;
    }
  };

  const getIconDesktop = (type: string) => {
    switch (type) {
      case 'success':
        return <ArrowDownLeft size={18} className="text-success hidden sm:block" />;
      case 'debit':
        return <ArrowUpRight size={18} className="text-destructive hidden sm:block" />;
      case 'error':
        return <AlertCircle size={18} className="text-destructive hidden sm:block" />;
      default:
        return <Info size={18} className="text-primary hidden sm:block" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success/10';
      case 'debit':
        return 'bg-destructive/10';
      case 'error':
        return 'bg-destructive/10';
      default:
        return 'bg-primary/10';
    }
  };

  return (
    <AppLayout showHeader={false}>
      {/* Header */}
      <PageHeader 
        title="Notifications"
        rightAction={
          unreadCount > 0 ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
              onClick={markAllAsRead}
            >
              <CheckCheck size={16} className="mr-1" />
              <span className="hidden xs:inline">Mark all read</span>
              <span className="xs:hidden">Read all</span>
            </Button>
          ) : null
        }
      />

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-2xl">
        {loading ? (
          <Card>
            <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-28 sm:w-32 mb-2" />
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-3 w-14 sm:w-16" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="py-10 sm:py-12 text-center">
              <Bell className="w-14 h-14 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up!
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className={`w-full flex items-start gap-3 p-3 sm:p-4 text-left transition-colors touch-manipulation ${
                    notification.is_read ? 'bg-background' : 'bg-primary/5'
                  } hover:bg-muted/50 active:bg-muted`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${getIconBg(notification.type)}`}>
                    {getIcon(notification.type)}
                    {getIconDesktop(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-medium text-sm sm:text-base ${notification.is_read ? '' : 'text-primary'}`}>
                        {notification.title}
                      </p>
                      {!notification.is_read && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5 sm:mt-2" />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(notification.created_at)}
                    </p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Notifications;
