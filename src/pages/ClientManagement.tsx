
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserRound, Search, UserPlus, Filter, Mail, Phone, Calendar, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

const clientData = [
  { id: 1, name: "Sarah Johnson", email: "sarah.j@example.com", phone: "(555) 123-4567", status: "Active", lastVisit: "2023-05-15" },
  { id: 2, name: "Michael Chen", email: "m.chen@example.com", phone: "(555) 234-5678", status: "New", lastVisit: "-" },
  { id: 3, name: "Jessica Williams", email: "j.williams@example.com", phone: "(555) 345-6789", status: "Active", lastVisit: "2023-06-02" },
  { id: 4, name: "David Rodriguez", email: "d.rodriguez@example.com", phone: "(555) 456-7890", status: "Inactive", lastVisit: "2023-03-10" },
  { id: 5, name: "Emily Taylor", email: "e.taylor@example.com", phone: "(555) 567-8901", status: "Active", lastVisit: "2023-06-10" }
];

const ClientManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState(clientData);

  const filteredClients = clients.filter((client) => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span>Add Client</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.filter(c => c.status === "Active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Clients (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.filter(c => c.status === "New").length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clients Directory</CardTitle>
          <CardDescription>Manage your service clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search clients..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2 h-10">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>

          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <UserRound className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">{client.name}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>{client.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm mt-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{client.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${client.status === 'Active' ? 'bg-green-100 text-green-800' : 
                            client.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {client.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{client.lastVisit}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No clients found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredClients.length} of {clients.length} clients
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={filteredClients.length === clients.length}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={filteredClients.length === clients.length}>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientManagement;
