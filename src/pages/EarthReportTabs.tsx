import { useAppSelector } from "@/app/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { selectRole } from "@/features/authSlice/authSlice";
import EarthReportCreate from "@/features/earthReport/EarthReportCreate";
import EarthReportList from "@/features/earthReport/EarthReportList";

function EarthReportTabs() {
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
            <EarthReportCreate />
          </TabsContent>
          <TabsContent value="view Report">
            <EarthReportList />
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <EarthReportList />
        </>
      )}
    </>
  );
}

export default EarthReportTabs;
