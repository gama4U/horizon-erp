import { useState } from "react";

function usePagination() {
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0,
  });
  const { pageSize, pageIndex } = pagination;
  return {
    take: pageSize,
    skip: pageSize * pageIndex,
    onPaginationChange: setPagination,
    pagination,
  };
}

export default usePagination;
