import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OilReportCreate from "../features/oilReport/OilReportCreate";
import OilReportList from "@/features/oilReport/OilReportList";
import { useAppSelector } from "@/app/hooks";
import { selectRole } from "@/features/authSlice/authSlice";

function OilReportTabs() {
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
            <OilReportCreate />
          </TabsContent>
          <TabsContent value="view Report">
            <OilReportList />
          </TabsContent>
        </Tabs>
      ) : (
        <OilReportList />
      )}
    </>
  );
}

export default OilReportTabs;
