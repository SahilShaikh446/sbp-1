import { Button } from "@/components/ui/button";
import { ReportType } from "@/pages/Report";
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

type ExtendedReportType = ReportType & { id: string };

type CustomColumnDef<T> = ColumnDef<T> & {
  expandedContent?: (row: { original: T }) => JSX.Element;
};

export const COLUMNS: CustomColumnDef<ExtendedReportType>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row, table }) => {
      return (
        <Button
          onClick={() => row.toggleExpanded()}
          className=" shadow-none text-muted-foreground w-full"
          size="icon"
          variant="ghost"
        >
          {row.getIsExpanded() ? (
            <ChevronUp
              className="opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          ) : (
            <ChevronDown
              className="opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          )}
        </Button>
      );
    },
    expandedContent: ({ original }) => <ExpandedRowContent {...original} />,
  },
  {
    header: "Report Date",
    accessorKey: "report_date",
  },
  {
    header: "Company",
    accessorKey: "company_id",
  },
  {
    header: "KVA Rating",
    accessorKey: "kva",
  },
  {
    header: "Voltage",
    accessorKey: "voltage",
  },
  {
    header: "Before Filtration",
    accessorKey: "transformer_before_filtration",
  },
  {
    header: "After Filtration",
    accessorKey: "transformer_after_filtration",
  },
  {
    header: "Filtration Date",
    accessorKey: "date_of_filtration",
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }) => {
      const company = useAppSelector(selectCompany);
      const dispatch = useAppDispatch();

      useEffect(() => {
        !company && dispatch(fetchCompanyAsync());
      }, [company]);
      const navigate = useNavigate();

      return (
        <div className="flex  items-center justify-end gap-2 sm:justify-between sm:flex-col md:flex-row md:items-center">
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
            <DialogContent className="max-w-[95vw] p-6 sm:max-w-[600px] ">
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

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 bg-transparent w-full sm:w-auto"
            onClick={() => navigate(`/oil-report/${row.original.id}`)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
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
        <p className="text-sm text-muted-foreground mt-1">
          {props.remark}
        </p>
      </div>
    </div>
  );
};
