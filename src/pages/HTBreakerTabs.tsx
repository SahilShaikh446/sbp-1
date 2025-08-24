import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OilReportList from "@/features/oilReport/OilReportList";
import { useAppSelector } from "@/app/hooks";
import { selectRole } from "@/features/authSlice/authSlice";
import HTBreakerReportCreate from "@/features/HTBreakerReport/HTBreakerReportCreate";
import HTBreakerReportList from "@/features/HTBreakerReport/HTBreakerReportList";

function HTBreakerTabs() {
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
            <HTBreakerReportCreate />
          </TabsContent>
          <TabsContent value="view Report">
            <HTBreakerReportList />
          </TabsContent>
        </Tabs>
      ) : (
        <OilReportList />
      )}
    </>
  );
}

export default HTBreakerTabs;
