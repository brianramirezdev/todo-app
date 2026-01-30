import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TodoSkeleton() {
    return (
        <Card className="h-full border-muted/50 py-0 min-h-30">
            <div className="p-5 flex flex-col h-full gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-muted/90">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                </div>
            </div>
        </Card>
    );
}

export function TodoSkeletonList() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(10)].map((_, i) => (
                <TodoSkeleton key={i} />
            ))}
        </div>
    );
}
