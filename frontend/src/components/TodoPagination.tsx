import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface TodoPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function TodoPagination({ currentPage, totalPages, onPageChange }: TodoPaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Logic to show a subset of pages if there are too many
    const visiblePages = pages.filter(p =>
        p === 1 ||
        p === totalPages ||
        (p >= currentPage - 1 && p <= currentPage + 1)
    );

    const renderPages = () => {
        const items = [];
        let lastPage = 0;

        for (const page of visiblePages) {
            if (lastPage !== 0 && page - lastPage > 1) {
                items.push(
                    <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
            items.push(
                <PaginationItem key={page}>
                    <PaginationLink
                        onClick={() => onPageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            );
            lastPage = page;
        }
        return items;
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>

                {renderPages()}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
