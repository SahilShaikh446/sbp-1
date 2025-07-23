import { Button } from "@/components/ui/button";
import { ReportType } from "@/pages/Report";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";
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
import { useEffect } from "react";
import { fetchCompanyAsync, selectCompany } from "../company/companySlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

export const COLUMNS: ColumnDef<ReportType>[] = [
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
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      );
    },
  },
];
