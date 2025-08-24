import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useEffect } from "react";
import ShadcnTable from "@/components/newShadcnTable/ShadcnTable";
// import { COLUMNS } from "./column";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchHTBreakerReportAsync,
  HTBreakerReportError,
  HTBreakerReportLoading,
  selectHTBreakerReport,
} from "./htBreakerReportSlice";
import { COLUMNS } from "./column";

function HTBreakerReportList() {
  const params = useLocation().search;

  const data = useAppSelector(selectHTBreakerReport);
  const loading = useAppSelector(HTBreakerReportLoading);
  const error = useAppSelector(HTBreakerReportError);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchHTBreakerReportAsync(params));
  }, [params]);

  return (
    <ShadcnTable
      title="HT Breaker Report"
      desc="HT Breaker Report"
      data={data?.content || []}
      columns={COLUMNS}
      loading={loading}
      api={true}
      currentPage={data ? data.pageable?.pageNumber : 0}
      totalPages={data ? data.totalPages : 10}
      totalelement={data ? data.totalElements : 0}
      error={error}
    />
  );
}

export default HTBreakerReportList;
