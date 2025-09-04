import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useEffect } from "react";
import {
  fetchOilReportAsync,
  oilReportError,
  oilReportLoading,
  selectOilReport,
} from "./oilReportSlice";
import ShadcnTable from "@/components/newShadcnTable/ShadcnTable";
import { COLUMNS } from "./column";
import { useLocation } from "react-router-dom";

function OilReportList() {
  const params = useLocation().search;

  const data = useAppSelector(selectOilReport);
  const loading = useAppSelector(oilReportLoading);
  const error = useAppSelector(oilReportError);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchOilReportAsync(params));
  }, [params]);

  return (
    <ShadcnTable
      title="Oil Filteration Report"
      data={data?.content || []}
      desc=" Oil Filteration Report"
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

export default OilReportList;
