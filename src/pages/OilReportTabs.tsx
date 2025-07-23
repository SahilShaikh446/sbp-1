import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React from "react";
import Report from "./Report";
import OilReportList from "@/features/oilReport/OilReportList";


function OilReportTabs() {
  return (
    <Tabs defaultValue="create Report" className="w-full">
      <TabsList>
        <TabsTrigger value="create Report">Create Report</TabsTrigger>
        <TabsTrigger value="view Report">View Report</TabsTrigger>
      </TabsList>
      <TabsContent value="create Report">
        <Report />
      </TabsContent>
      <TabsContent value="view Report">
        <OilReportList />
      </TabsContent>
    </Tabs>
  );
}

export default OilReportTabs;
