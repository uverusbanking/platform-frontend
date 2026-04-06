import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ChevronRight, Loader2 } from 'lucide-react';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export const SettingsSection = ({ title, description, children }: SettingsSectionProps) => (
  <Card>
    <CardHeader className="py-3 sm:py-4">
      <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
      {description && (
        <CardDescription className="text-xs sm:text-sm">{description}</CardDescription>
      )}
    </CardHeader>
    <CardContent className="p-0">
      {children}
    </CardContent>
  </Card>
);

interface SettingsToggleProps {
  icon: ReactNode;
  label: string;
  description?: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const SettingsToggle = ({ 
  icon, 
  label, 
  description, 
  checked, 
  onToggle, 
  disabled,
  loading 
}: SettingsToggleProps) => (
  <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border last:border-b-0">
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <div>
        <p className="text-sm sm:text-base font-medium">{label}</p>
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
    {loading ? (
      <Loader2 size={18} className="animate-spin text-muted-foreground" />
    ) : (
      <Switch 
        checked={checked} 
        onCheckedChange={onToggle}
        disabled={disabled}
      />
    )}
  </div>
);

interface SettingsButtonProps {
  icon: ReactNode;
  label: string;
  description?: string;
  onClick: () => void;
  badge?: ReactNode;
  variant?: 'default' | 'warning' | 'destructive';
}

export const SettingsButton = ({ 
  icon, 
  label, 
  description, 
  onClick, 
  badge,
  variant = 'default' 
}: SettingsButtonProps) => {
  const textColor = variant === 'warning' 
    ? 'text-warning' 
    : variant === 'destructive' 
      ? 'text-destructive' 
      : '';

  return (
    <button 
      className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 active:bg-muted transition-colors touch-manipulation border-b border-border last:border-b-0"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <span className={`shrink-0 ${variant !== 'default' ? textColor : 'text-muted-foreground'}`}>
          {icon}
        </span>
        <div className="text-left">
          <p className={`text-sm sm:text-base font-medium ${textColor}`}>{label}</p>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {badge}
        <ChevronRight size={18} className="text-muted-foreground" />
      </div>
    </button>
  );
};
