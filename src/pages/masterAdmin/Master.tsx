import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Admin from "@/features/admin/Admin";
import Client from "@/features/client/Client";
import Company from "@/features/company/Company";

function Master() {
  return (
    <Tabs defaultValue="company" className="w-full">
      <TabsList>
        <TabsTrigger value="company">Create Company</TabsTrigger>
        <TabsTrigger value="client">Create Client</TabsTrigger>
        <TabsTrigger value="admin">Create Admin</TabsTrigger>
      </TabsList>
      <TabsContent value="company">
        <Company />
      </TabsContent>
      <TabsContent value="client">
        <Client />
      </TabsContent>
      <TabsContent value="admin">
        <Admin />
      </TabsContent>
    </Tabs>
  );
}

export default Master;
