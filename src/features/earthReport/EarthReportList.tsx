import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useEffect } from "react";
import ShadcnTable from "@/components/newShadcnTable/ShadcnTable";
import { useLocation } from "react-router-dom";
import { COLUMNS } from "./column";
import {
  earthReportError,
  earthReportLoading,
  fetchEarthReportAsync,
  selectEarthReport,
} from "./earthReportSlice";

function EarthReportList() {
  const params = useLocation().search;

  const data = useAppSelector(selectEarthReport);
  const loading = useAppSelector(earthReportLoading);
  const error = useAppSelector(earthReportError);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchEarthReportAsync(params));
  }, [params]);

  return (
    <ShadcnTable
      title="Earth Pit Report"
      desc="Earth Pit Report"
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

export default EarthReportList;
