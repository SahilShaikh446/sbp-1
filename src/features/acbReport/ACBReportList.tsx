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

const ACBReportList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const data = useSelector(selectACBdata);
  const loading = useSelector(acbReportLoading);
  const error = useSelector(acbReportError);

  useEffect(() => {
    !data && dispatch(fetchACBReportAsync());
  }, [data, dispatch]);

  return (
    <ShadcnTable
      name="ACB Report"
      data={data}
      columns={COLUMNS}
      loading={loading}
      error={error}
    />
  );
};

export default ACBReportList;
