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

function OilReportList() {
  const data = useAppSelector(selectOilReport);
  const loading = useAppSelector(oilReportLoading);
  const error = useAppSelector(oilReportError);
  const dispatch = useAppDispatch();

  useEffect(() => {
    !data && dispatch(fetchOilReportAsync());
  }, [data]);

  return (
    <ShadcnTable
      name="Oil Filteration Report"
      data={data}
      columns={COLUMNS}
      loading={loading}
      error={error}
    />
  );
}

export default OilReportList;
