import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send } from "lucide-react";

const Users = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">User Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage users and their permissions</p>
      </div>
      
      <Tabs defaultValue="all-users" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 lg:max-w-[800px]">
          <TabsTrigger value="all-users">All Users</TabsTrigger>
          <TabsTrigger value="add-user">Add User</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="all-users" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Input className="max-w-xs" placeholder="Search users..." />
                <Button variant="outline">Export Users</Button>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">John Doe</h4>
                    <p className="text-sm text-gray-500">Admin</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Jane Smith</h4>
                    <p className="text-sm text-gray-500">Manager</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="add-user" className="mt-6">
          <Card className="p-6">
            <form className="space-y-4">
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="Enter first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Enter last name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit">Add User</Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Available Roles</h3>
                <Button>Add New Role</Button>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Admin</h4>
                    <p className="text-sm text-gray-500">Full system access</p>
                  </div>
                  <Button variant="outline">Edit Permissions</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Manager</h4>
                    <p className="text-sm text-gray-500">Limited administrative access</p>
                  </div>
                  <Button variant="outline">Edit Permissions</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">User</h4>
                    <p className="text-sm text-gray-500">Basic access rights</p>
                  </div>
                  <Button variant="outline">Edit Permissions</Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <Card className="p-6">
            <div className="grid md:grid-cols-[300px,1fr] gap-6">
              <div className="border rounded-lg p-4">
                <div className="space-y-4">
                  <Input placeholder="Search users..." />
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams"].map((user) => (
                        <Button
                          key={user}
                          variant="ghost"
                          className="w-full justify-start gap-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          {user}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <div className="flex flex-col h-[600px]">
                <div className="border-b p-4">
                  <h3 className="font-medium">Chat with John Doe</h3>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                        Hello! How can I help you today?
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                        I have a question about my account settings.
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea 
                      placeholder="Type your message..." 
                      className="min-h-[80px]"
                    />
                    <Button className="shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Users;