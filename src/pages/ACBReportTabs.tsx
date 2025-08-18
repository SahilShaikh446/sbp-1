import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OilReportCreate from "../features/oilReport/OilReportCreate";
import OilReportList from "@/features/oilReport/OilReportList";
import { useAppSelector } from "@/app/hooks";
import { selectRole } from "@/features/authSlice/authSlice";
import ABCReportCreate from "../features/acbReport/ACBReportCreate";
import ACBReportList from "@/features/acbReport/ACBReportList";

function ACBReportTabs() {
  const role = useAppSelector(selectRole);
  return (
    <>
      {role == "Master Admin" ? (
        <Tabs defaultValue="view Report" className="w-full">
          <TabsList>
            <TabsTrigger value="view Report">View Report</TabsTrigger>
            <TabsTrigger value="create Report">Create Report</TabsTrigger>
          </TabsList>
          <TabsContent value="create Report">
            <ABCReportCreate />
          </TabsContent>
          <TabsContent value="view Report">
            <ACBReportList />
          </TabsContent>
        </Tabs>
      ) : (
        <OilReportList />
      )}
    </>
  );
}

export default ACBReportTabs;
