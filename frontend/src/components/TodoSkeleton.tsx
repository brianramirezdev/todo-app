import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TodoSkeleton() {
    return (
        <Card className="p-4">
            <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 flex-1" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                </div>
            </div>
        </Card>
    );
}

export function TodoSkeletonList() {
    return (
        <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
                <TodoSkeleton key={i} />
            ))}
        </div>
    );
}
