import { ColumnDef } from "@tanstack/react-table";
import { ContactUs } from "./contactUsSlice";
import { AtSign, Building, Mail, MessageSquare, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const COLUMNS: ColumnDef<ContactUs>[] = [
  {
    header: () => (
      <div className="text-left text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs font-semibold py-3">
        <Mail className="inline-block h-4 w-4 mr-1" /> From
      </div>
    ),
    accessorKey: "mail_from",
  },
  {
    header: () => (
      <div className="text-left text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs font-semibold py-3">
        <Mail className="inline-block h-4 w-4 mr-1" /> To
      </div>
    ),
    accessorKey: "mail_to",
  },
  {
    header: () => (
      <div className="text-left text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs font-semibold py-3">
        <AtSign className="inline-block h-4 w-4 mr-1" /> Email
      </div>
    ),
    accessorKey: "contact_us_email",
  },
  {
    header: () => (
      <div className="text-left text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs font-semibold py-3">
        <Building className="inline-block h-4 w-4 mr-1" /> Company
      </div>
    ),
    accessorKey: "contact_us_company",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs px-2 py-1 rounded-md">
        {row.getValue("contact_us_company")}
      </Badge>
    ),
  },
  {
    header: () => (
      <div className="text-left text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs font-semibold py-3">
        <Phone className="inline-block h-4 w-4 mr-1" /> Phone
      </div>
    ),
    accessorKey: "contact_us_number",
  },
  {
    header: () => (
      <div className="text-left text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs font-semibold py-3">
        <MessageSquare className="inline-block h-4 w-4 mr-1" /> Remarks
      </div>
    ),
    accessorKey: "contact_us_remarks",
  },
];
