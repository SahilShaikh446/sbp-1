import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PDFViewer } from "@react-pdf/renderer";
import { useEffect } from "react";
import { fetchCompanyAsync, selectCompany } from "../company/companySlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { addYears, format, parseISO } from "date-fns";
import { Report } from "./type";
import ACBReport from "@/components/template/ACBReport";

export const COLUMNS: ColumnDef<Report>[] = [
  {
    header: "Serial No",
    accessorKey: "id",
  },
  {
    header: "Report Date",
    accessorKey: "report_date",
  },
  {
    header: "Next Date of Filtration",
    accessorKey: "next_date_of_filtriation",
  },
  {
    header: "Company Name",
    accessorKey: "company_name",
  },
  {
    header: "Company Address",
    accessorKey: "company_address",
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
                    <ACBReport
                      reportData={row.original as any}
                      companyData={company || []}
                    />
                  </PDFViewer>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {role === "Master Admin" && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-transparent w-full sm:w-auto"
              onClick={() => navigate(`/acb-report/${row.original.id}`)}
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
