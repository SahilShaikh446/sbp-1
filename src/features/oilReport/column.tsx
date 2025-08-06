import { Button } from "@/components/ui/button";
import { ReportType } from "@/features/oilReport/OilReportCreate";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Edit, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PDFViewer } from "@react-pdf/renderer";
import OilReport from "@/components/template/OilReport";
import { JSX, useEffect } from "react";
import { fetchCompanyAsync, selectCompany } from "../company/companySlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { addYears, format, parseISO } from "date-fns";

type ExtendedReportType = ReportType & { id: string };

type CustomColumnDef<T> = ColumnDef<T> & {
  expandedContent?: (row: { original: T }) => JSX.Element;
};

function addOneYear(dateString: string): string {
  try {
    const parsed = parseISO(dateString); // safely parses YYYY-MM-DD
    const newDate = addYears(parsed, 1);
    return format(newDate, "yyyy-MM-dd");
  } catch (e) {
    console.error("Error parsing date:", dateString);
    return "Invalid date";
  }
}

export const COLUMNS: CustomColumnDef<ExtendedReportType>[] = [
  // {
  //   id: "expander",
  //   header: () => null,
  //   cell: ({ row, table }) => {
  //     return (
  //       <Button
  //         onClick={() => row.toggleExpanded()}
  //         className=" shadow-none text-muted-foreground w-full"
  //         size="icon"
  //         variant="ghost"
  //       >
  //         {row.getIsExpanded() ? (
  //           <ChevronUp
  //             className="opacity-60"
  //             size={16}
  //             strokeWidth={2}
  //             aria-hidden="true"
  //           />
  //         ) : (
  //           <ChevronDown
  //             className="opacity-60"
  //             size={16}
  //             strokeWidth={2}
  //             aria-hidden="true"
  //           />
  //         )}
  //       </Button>
  //     );
  //   },
  //   expandedContent: ({ original }) => <ExpandedRowContent {...original} />,
  // },
  {
    header: "Serial No",
    accessorKey: "sr_no",
  },
  {
    header: "Report Date",
    accessorKey: "report_date",
  },
  {
    header: "Filtration Date",
    accessorKey: "date_of_filtration",
  },
  {
    header: "Next Date of Filtration",
    cell: ({ row }) => {
      return <span>{addOneYear(row.original.date_of_filtration)}</span>;
    },
  },
  {
    header: "Company Name",
    accessorKey: "company_name",
  },
  {
    header: "Company Address",
    accessorKey: "",
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }) => {
      const company = useAppSelector(selectCompany);
      const dispatch = useAppDispatch();
      const role = useAppSelector((state) => state.auth.role);

      useEffect(() => {
        !company && dispatch(fetchCompanyAsync());
      }, [company]);
      const navigate = useNavigate();

      return (
        <div className="flex  items-center gap-2  sm:flex-col md:flex-row md:items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 bg-transparent w-full sm:w-auto"
              >
                <Eye className="h-4 w-4" />
                View PDF
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] sm:max-w-[95%] md:max-w-[80%] lg:max-w-[80%] xl:max-w-[60%] p-8">
              <DialogHeader>
                <DialogDescription className="max-h-[80vh] overflow-auto ">
                  <PDFViewer width="100%" height="600px" className="w-full">
                    <OilReport
                      reportData={row.original}
                      companyData={company || []}
                    />
                  </PDFViewer>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {role === "Admin" && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-transparent w-full sm:w-auto"
              onClick={() => navigate(`/oil-report/${row.original.id}`)}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      );
    },
  },
];

const ExpandedRowContent: React.FC<ExtendedReportType> = (props) => {
  return (
    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
      <h4 className="font-semibold mb-2">Additional Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Serial Number:</span> {props.sr_no}
        </div>
        <div>
          <span className="font-medium">Oil Quantity:</span>{" "}
          {props.transformer_oil_quantity}
        </div>
        <div>
          <span className="font-medium">OLTC Oil Quantity:</span>{" "}
          {props.oltc_oil_quantity}
        </div>
        <div>
          <span className="font-medium">Client Representative:</span>{" "}
          {props.clients_representative}
        </div>
      </div>
      <div className="mt-3">
        <span className="font-medium">Remarks:</span>
        <p className="text-sm text-muted-foreground mt-1">{props.remark}</p>
      </div>
    </div>
  );
};
