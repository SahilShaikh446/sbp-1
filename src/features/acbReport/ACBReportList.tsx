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
    !data && dispatch(fetchACBReportAsync());
  }, [params]);

  return (
    <ShadcnTable
      title="ACB Report"
      desc="ACB Reports"
      data={data || []}
      columns={COLUMNS}
      loading={loading}
      error={error}
    />
  );
};

export default ACBReportList;
