import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OilReportCreate from "../features/oilReport/OilReportCreate";
import OilReportList from "@/features/oilReport/OilReportList";

function OilReportTabs() {
  return (
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
  );
}

export default OilReportTabs;
