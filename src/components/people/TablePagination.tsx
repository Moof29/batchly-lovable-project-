
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  page: number;
  setPage: (newPage: number) => void;
  hasNext: boolean;
};

export function TablePagination({ page, setPage, hasNext }: Props) {
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => page > 1 && setPage(page - 1)}
            aria-label="Previous page"
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        <PaginationItem>
          <span className="text-xs text-muted-foreground px-4">Page {page}</span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => hasNext && setPage(page + 1)}
            aria-label="Next page"
            className={!hasNext ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
