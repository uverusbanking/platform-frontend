import { useNotifications } from "@/hooks/useNotifications";
import { formatRelativeTime } from "@/lib/currency";
import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/AppLayout";
import {
  Bell,
  CheckCheck,
  ArrowDownLeft,
  ArrowUpRight,
  AlertCircle,
  Info,
} from "lucide-react";

const iconMap = {
  success: {
    icon: ArrowDownLeft,
    bg: "rgb(var(--mint))",
    color: "rgb(var(--mint-deep))",
  },
  debit: {
    icon: ArrowUpRight,
    bg: "rgb(var(--soft))",
    color: "rgb(var(--brand-primary))",
  },
  error: {
    icon: AlertCircle,
    bg: "rgb(var(--soft))",
    color: "rgb(var(--brand-primary))",
  },
  default: {
    icon: Info,
    bg: "rgb(var(--surface))",
    color: "rgb(var(--foreground-subtle))",
  },
};

const Notifications = () => {
  const { notifications, loading, markAsRead, markAllAsRead, unreadCount } =
    useNotifications();

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
        <div>
          <p className="eyebrow mb-2">Inbox</p>
          <h1 className="display text-[clamp(26px,3.5vw,44px)] m-0 leading-none">
            Notification{" "}
            <span
              className="serif-italic"
              style={{ color: "rgb(var(--brand-primary))" }}
            >
              centre.
            </span>
          </h1>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill text-sm font-semibold transition-colors hover:bg-surface shrink-0"
            style={{
              background: "rgb(var(--surface-highest))",
              border: "1px solid rgb(var(--surface-high))",
            }}
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div
          className="rounded-2xl p-5 space-y-4 shadow-card"
          style={{
            background: "rgb(var(--surface-highest))",
            border: "1px solid rgb(var(--surface-high))",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-10 h-10 rounded-pill shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32 rounded-pill" />
                <Skeleton className="h-3 w-full rounded-pill" />
                <Skeleton className="h-3 w-16 rounded-pill" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div
          className="rounded-2xl py-16 px-6 text-center shadow-card"
          style={{
            background: "rgb(var(--surface-highest))",
            border: "1px solid rgb(var(--surface-high))",
          }}
        >
          <div
            className="w-12 h-12 rounded-pill flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgb(var(--surface))" }}
          >
            <Bell className="w-6 h-6 text-foreground-subtle" />
          </div>
          <p className="font-semibold text-sm mb-1">No notifications</p>
          <p className="text-xs text-foreground-subtle">
            You're all caught up!
          </p>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden shadow-card"
          style={{
            background: "rgb(var(--surface-highest))",
            border: "1px solid rgb(var(--surface-high))",
          }}
        >
          {notifications.map((notification, idx) => {
            const typeKey = notification.type as keyof typeof iconMap;
            const {
              icon: Icon,
              bg,
              color,
            } = iconMap[typeKey] ?? iconMap.default;

            return (
              <button
                key={notification.id}
                className="w-full flex items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-surface"
                style={{
                  borderBottom:
                    idx < notifications.length - 1
                      ? "1px solid rgb(var(--surface-high))"
                      : undefined,
                  background: notification.is_read
                    ? undefined
                    : "rgb(var(--soft) / 0.4)",
                }}
                onClick={() => markAsRead(notification.id)}
              >
                <div
                  className="w-10 h-10 rounded-pill flex items-center justify-center shrink-0"
                  style={{ background: bg }}
                >
                  <Icon size={16} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <p className="font-semibold text-sm leading-snug">
                      {notification.title}
                    </p>
                    {!notification.is_read && (
                      <span
                        className="w-2 h-2 rounded-pill shrink-0 mt-1"
                        style={{ background: "rgb(var(--brand-primary))" }}
                      />
                    )}
                  </div>
                  <p className="text-xs text-foreground-subtle line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="text-[10px] text-foreground-subtle mt-1">
                    {formatRelativeTime(notification.created_at)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

export default Notifications;
