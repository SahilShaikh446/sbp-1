import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useEffect, useState } from "react";
import {
  fetchOilReportAsync,
  oilReportError,
  oilReportLoading,
  selectOilReport,
} from "./oilReportSlice";
import ShadcnTable from "@/components/newShadcnTable/ShadcnTable";
import { COLUMNS } from "./column";
import { useLocation, useNavigate } from "react-router-dom";

function OilReportList() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const params = useLocation().search;
  const sort = params.split("?")[1];
  const [searchKey, setSearchKey] = useState("");
  const navigate = useNavigate();

  const data = useAppSelector(selectOilReport);
  const loading = useAppSelector(oilReportLoading);
  const error = useAppSelector(oilReportError);
  const dispatch = useAppDispatch();

  useEffect(() => {
    !data && dispatch(fetchOilReportAsync());
  }, [data]);
  // useEffect(() => {
  //   !data &&
  //     dispatch(
  //       fetchOilReportAsync(
  //         sort
  //           ? `${sort}&size=${pageSize}&page=${currentPage}`
  //           : `size=${pageSize}&page=${currentPage}`
  //       )
  //     );
  // }, [data]);

  return (
    <ShadcnTable
      name="Oil Filteration Report"
      data={data}
      columns={COLUMNS}
      loading={loading}
      api={true}
      hideExcel={true}
      error={error}
    />
    // <ShadcnTable
    //   name="Oil Filteration Report"
    //   data={data?.content}
    //   columns={COLUMNS}
    //   loading={loading}
    //   api={true}
    //   currentPage={data ? data.pageable.pageNumber : 0}
    //   totalPages={data ? data.totalPages : 10}
    //   totalelement={data ? data.totalElements : 0}
    //   hideGlobalSearch={true}
    //   error={error}
    // />
  );
}

export default OilReportList;
