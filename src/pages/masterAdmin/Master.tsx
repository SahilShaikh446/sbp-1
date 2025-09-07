import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Client from "@/features/client/Client";
import Company from "@/features/company/Company";

function Master() {
  return (
    <Tabs defaultValue="company" className="w-full">
      <TabsList>
        <TabsTrigger value="company">Add Company</TabsTrigger>
        <TabsTrigger value="client">Add Client</TabsTrigger>
      </TabsList>
      <TabsContent value="company">
        <Company />
      </TabsContent>
      <TabsContent value="client">
        <Client />
      </TabsContent>
    </Tabs>
  );
}

export default Master;
