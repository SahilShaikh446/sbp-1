import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Users } from "lucide-react";
import React from "react";
import { CheckCircle, Calendar, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const metrics = [
  {
    title: "Total Company",
    value: "50",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Total Filtrations Done",
    value: "200",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Upcoming This Month",
    value: "20",
    icon: Calendar,
    color: "text-blue-600",
  },
  {
    title: "Overdue",
    value: "5",
    icon: AlertTriangle,
    color: "text-destructive",
  },
];

const filtrations = [
  {
    client: "M/s. Dr. Acharya Laboratories Ltd.",
    lastFiltration: "2024-04-03",
    nextDueDate: "2025-04-01",
    daysLeft: 7,
    status: "Upcoming",
    statusColor: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  {
    client: "ABC Corp.",
    lastFiltration: "2024-04-03",
    nextDueDate: "2024-02-01",
    daysLeft: 26,
    status: "Due Soon",
    statusColor: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  {
    client: "XYZ Industries",
    lastFiltration: "2024-02-03",
    nextDueDate: "2024-02-10",
    daysLeft: 23,
    status: "Overdue",
    statusColor: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  {
    client: "LMN Ltd.",
    lastFiltration: "2024-04-13",
    nextDueDate: "2024-01-15",
    daysLeft: 10,
    status: "Overdue",
    statusColor: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  {
    client: "PQR Enterprises",
    lastFiltration: "2024-04-13",
    nextDueDate: "2024-02-10",
    daysLeft: 24,
    status: "Overdue",
    statusColor: "bg-red-100 text-red-800 hover:bg-red-100",
  },
];

const overdueItems = [
  { client: "XYZ Industries", date: "2024-02-20" },
  { client: "PQR Enterprises", date: "2024-01-15" },
  { client: "ABC Corp.", date: "2023-12-10" },
];

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
const calendarDays = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28,
];

const scheduledDays = [10, 15, 23];

function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-800 rounded-lg">
            <Filter className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Oil Filtration Dashboard
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
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
                      {metric.value}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg bg-muted ${metric.color}`}>
                    <metric.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Upcoming Filtrations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">
                          Client
                        </th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">
                          Last Filtration
                        </th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">
                          Next Due Date
                        </th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">
                          Days Left
                        </th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtrations.map((filtration, index) => (
                        <tr
                          key={index}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td
                            className="py-2 px-2 text-xs font-medium text-foreground max-w-[200px] truncate"
                            title={filtration.client}
                          >
                            {filtration.client}
                          </td>
                          <td className="py-2 px-2 text-xs text-muted-foreground">
                            {filtration.lastFiltration}
                          </td>
                          <td className="py-2 px-2 text-xs text-muted-foreground">
                            {filtration.nextDueDate}
                          </td>
                          <td className="py-2 px-2 text-xs text-muted-foreground">
                            {filtration.daysLeft} days
                          </td>
                          <td className="py-2 px-2">
                            <Badge
                              variant="secondary"
                              className={`${filtration.statusColor} text-xs px-2 py-0.5`}
                            >
                              {filtration.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
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
                <div className="space-y-3">
                  {overdueItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {item.client}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.date}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  Filtrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Days of week header */}
                  <div className="grid grid-cols-7 gap-1">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-medium text-muted-foreground p-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day) => (
                      <div
                        key={day}
                        className={`
                  text-center text-sm p-2 rounded-md cursor-pointer transition-colors
                  ${
                    scheduledDays.includes(day)
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-foreground hover:bg-muted"
                  }
                `}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
