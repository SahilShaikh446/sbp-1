import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { AppDispatch } from "@/app/store";
import { COLUMNS } from "./column";
import ShadcnTable from "@/components/newShadcnTable/ShadcnTable";
import {
  acbReportError,
  acbReportLoading,
  fetchACBReportAsync,
  selectACBdata,
} from "./acbReportSlice";
import { useLocation } from "react-router-dom";

const ACBReportList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocation().search;

  const data = useSelector(selectACBdata);
  const loading = useSelector(acbReportLoading);
  const error = useSelector(acbReportError);

  useEffect(() => {
    dispatch(fetchACBReportAsync(params));
  }, [params]);

  return (
    <ShadcnTable
      title="ACB Report"
      desc=" ACB Report"
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
};

export default ACBReportList;
