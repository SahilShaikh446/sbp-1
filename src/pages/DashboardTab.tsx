import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OilDashboard from "@/features/dashboard/OilDashboard";
import ACBDashboard from "@/features/dashboard/ACBDashboard";
import HTDashboard from "@/features/dashboard/HTDashboard";
import EarthDashboard from "@/features/dashboard/EarthDashboard";

function DashboardTab() {
  return (
    <>
      <Tabs defaultValue="oil" className="w-full">
        <TabsList>
          <TabsTrigger value="oil">Oil Report</TabsTrigger>
          <TabsTrigger value="acb">ACB Report</TabsTrigger>
          <TabsTrigger value="ht">HT Breaker Report</TabsTrigger>
          <TabsTrigger value="earth">Earth Pit Report</TabsTrigger>
        </TabsList>
        <TabsContent value="oil">
          <OilDashboard />
        </TabsContent>
        <TabsContent value="acb">
          <ACBDashboard />
        </TabsContent>
        <TabsContent value="ht">
          <HTDashboard />
        </TabsContent>
        <TabsContent value="earth">
          <EarthDashboard />
        </TabsContent>
      </Tabs>
    </>
  );
}

export default DashboardTab;
