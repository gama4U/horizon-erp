interface PaginationProps {
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  totalItems: number; // Total number of items
}

export default function Pagination({
  pagination,
  onPaginationChange,
  totalItems,
}: PaginationProps) {
  const { pageIndex, pageSize } = pagination;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      onPaginationChange({ pageIndex: pageIndex - 1, pageSize });
    }
  };

  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) {
      onPaginationChange({ pageIndex: pageIndex + 1, pageSize });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      onPaginationChange({ pageIndex: newPage, pageSize });
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    onPaginationChange({ pageIndex: 0, pageSize: newSize }); // Reset to first page
  };

  return (
    <div className="flex items-center gap-2">
      {/* Page size selection */}
      <select
        value={pageSize}
        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
        className="border p-1 rounded"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>

      {/* Previous button */}
      <button
        onClick={handlePreviousPage}
        disabled={pageIndex === 0}
        className="border p-1 rounded disabled:opacity-50"
      >
        Previous
      </button>

      {/* Page numbers */}
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index)}
          className={`border p-1 rounded ${pageIndex === index ? "bg-blue-500 text-white" : ""}`}
        >
          {index + 1}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={handleNextPage}
        disabled={pageIndex >= totalPages - 1}
        className="border p-1 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
