import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const PageHeader = ({
  title,
  onBack,
  rightAction,
  children,
  className,
}: PageHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={cn("bg-gradient-hero safe-top", className)}>
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleBack}
              className="p-2.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors text-white touch-manipulation"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-white truncate">
                {title}
              </h1>
            </div>
          </div>
          {rightAction && <div className="shrink-0">{rightAction}</div>}
        </div>
        {children}
      </div>
    </header>
  );
};

export default PageHeader;
