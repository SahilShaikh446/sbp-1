import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Filter,
  Users,
  CheckCircle,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { Report } from "../oilReport/type";
import { ColumnDef } from "@tanstack/react-table";
import ShadcnTable from "@/components/newShadcnTable/ShadcnTable";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CardData {
  overdue_count: number;
  total_company: number;
  total_status_done: number;
  upcoming_count: number;
}

const metrics = [
  {
    title: "Total Company",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Total Filtrations Done",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Upcoming This Month",
    icon: Calendar,
    color: "text-blue-600",
  },
  {
    title: "Overdue",
    icon: AlertTriangle,
    color: "text-destructive",
  },
];

const column: ColumnDef<Report>[] = [
  {
    header: "Client",
    accessorKey: "company_name",
  },
  {
    header: "Date of Filtration",
    accessorKey: "report_date",
  },
  {
    header: "Next Date Filteration",
    accessorKey: "next_date_of_filtriation",
  },
  {
    header: "Days Left",
    accessorKey: "days_left",
    cell: ({ row }) => {
      const reportDate = new Date(row.original.report_date);
      const nextDate = new Date(row.original.next_date_of_filtriation);
      const diffTime = nextDate.getTime() - reportDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return <span>{diffDays}</span>;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: () => (
      <Badge
        variant="secondary"
        className="bg-red-100 text-red-800 hover:bg-red-100 text-xs px-2 py-0.5"
      >
        Overdue
      </Badge>
    ),
  },
];

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";

function YearPicker({
  year,
  setYear,
}: {
  year: string;
  setYear: (y: string) => void;
}) {
  const currentYear = new Date().getFullYear();

  // Generate a long list of years (you can extend both sides)
  const years = Array.from({ length: 201 }, (_, i) =>
    String(currentYear - 100 + i)
  );

  return (
    <Popover modal={true}>
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          className="w-[140px] justify-between"
        >
          {year}
          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandInput placeholder="Search year..." />
          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty>No year found.</CommandEmpty>
            <CommandGroup>
              {years.map((yr) => (
                <CommandItem key={yr} value={yr} onSelect={() => setYear(yr)}>
                  {yr}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function HTDashboard() {
  const [cardData, setCardData] = React.useState<CardData | null>(null);
  const [overdueData, setOverdueData] = React.useState<Report[]>([]);
  const [upcomingData, setUpcomingData] = React.useState<Report[]>([]);

  // Year picker
  const currentYear = new Date().getFullYear();
  const [year, setYear] = React.useState<string>(String(currentYear));

  // Loading states
  const [loadingCards, setLoadingCards] = React.useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = React.useState(true);
  const [loadingOverdue, setLoadingOverdue] = React.useState(true);

  const fetchCardData = async (selectedYear: string) => {
    setLoadingCards(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/API/Count/Dashboard/Details?report_id=3&year=${selectedYear}`
      );
      if (res.status === 200) {
        setCardData(res.data);
      }
    } catch (error) {
    } finally {
      setTimeout(() => setLoadingCards(false), 1000); // debounce
    }
  };

  const fetchOverdueData = async (selectedYear: string) => {
    setLoadingOverdue(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/API/List/Dashboard/Overdue/Report?page=0&size=1000&report_id=3&year=${selectedYear}`
      );
      if (res.status === 200) {
        setOverdueData(res.data.content);
      }
    } catch (error) {
    } finally {
      setTimeout(() => setLoadingOverdue(false), 1000);
    }
  };

  const fetchUpcomingData = async (selectedYear: string) => {
    setLoadingUpcoming(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/API/List/Dashboard/Report?report_id=3&year=${selectedYear}`
      );
      if (res.status === 200) {
        setUpcomingData(res.data.content);
      }
    } catch (error) {
    } finally {
      setTimeout(() => setLoadingUpcoming(false), 1000);
    }
  };

  useEffect(() => {
    fetchCardData(year);
    fetchOverdueData(year);
    fetchUpcomingData(year);
  }, [year]); // refetch when year changes

  return (
    <div className="min-h-screen bg-background p-4">
      <div className=" space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
              <Filter className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              HT Breaker Dashboard
            </h1>
          </div>
          <YearPicker year={year} setYear={setYear} />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingCards
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </Card>
              ))
            : metrics.map((metric) => (
                <Card
                  key={metric.title}
                  className="border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {metric.title}
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {metric.title === "Total Company"
                            ? cardData?.total_company
                            : metric.title === "Total Filtrations Done"
                            ? cardData?.total_status_done
                            : metric.title === "Upcoming This Month"
                            ? cardData?.upcoming_count
                            : metric.title === "Overdue"
                            ? cardData?.overdue_count
                            : "N/A"}
                        </p>
                      </div>
                      <div
                        className={`p-2 rounded-lg bg-muted ${metric.color}`}
                      >
                        <metric.icon className="w-5 h-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {loadingUpcoming ? (
              <Card className="p-4">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
              </Card>
            ) : (
              <ShadcnTable
                title="Upcoming Filtrations"
                desc="Filtrations"
                columns={column}
                data={upcomingData}
                loading={false}
                error={false}
              />
            )}
          </div>
          <div className="space-y-4">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Overdue
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingOverdue ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {overdueData.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200"
                      >
                        <span className="text-sm font-medium text-foreground">
                          {item.company_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.next_date_of_filtriation}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HTDashboard;
