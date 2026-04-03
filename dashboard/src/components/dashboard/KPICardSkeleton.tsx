import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type KPICardSkeletonProps = {
  count?: number;
  mdCols?: 1 | 2 | 3 | 4 | 5 | 6;
  lgCols?: 1 | 2 | 3 | 4 | 5 | 6;
};

const mdColsClasses: Record<
  NonNullable<KPICardSkeletonProps["mdCols"]>,
  string
> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

const lgColsClasses: Record<
  NonNullable<KPICardSkeletonProps["lgCols"]>,
  string
> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

export function KPICardSkeleton({
  count = 1,
  mdCols = 2,
  lgCols = 3,
}: KPICardSkeletonProps) {
  const safeCount = Math.max(1, count);

  return (
    <div
      className={cn("grid gap-4", mdColsClasses[mdCols], lgColsClasses[lgCols])}
    >
      {Array.from({ length: safeCount }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col justify-center p-8 bg-muted/20 rounded-xl animate-pulse"
        >
          <div className="flex justify-between">
            <Skeleton className="h-5 w-[120px] mb-4" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          <Skeleton className="h-8 w-[100px] mb-4" />
          <div className="flex gap-4 items-center">
            <Skeleton className="h-6 w-[60px] rounded-md" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
