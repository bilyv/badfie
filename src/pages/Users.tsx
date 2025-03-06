
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Send, Search, Plus, Edit, Trash2, User, CheckCircle, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data for demonstration
const sampleUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Manager" },
  { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "User" },
  { id: 4, name: "Alice Johnson", email: "alice@example.com", role: "User" },
];

const sampleTasks = [
  { id: 1, userId: 1, task: "Complete quarterly report", status: "completed", revenue: 1500 },
  { id: 2, userId: 2, task: "Client meeting preparation", status: "in-progress", revenue: 800 },
  { id: 3, userId: 3, task: "Website update", status: "pending", revenue: 0 },
  { id: 4, userId: 1, task: "Team training session", status: "completed", revenue: 2000 },
];

const Users = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // Here you would implement the actual message sending logic
    console.log(`Sending message to ${selectedUser}: ${messageInput}`);
    setMessageInput("");
  };

  // Filter users based on search query
  const filteredUsers = sampleUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          User Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage users, tasks, and communication
        </p>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6">
          <Card className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input 
                    className="pl-10" 
                    placeholder="Search users..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="whitespace-nowrap">
                      <Plus className="mr-2 h-4 w-4" /> Create User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" type="email" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role</Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
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
                    <DialogFooter>
                      <Button type="submit">Save User</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-6">
          <Card className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">User Tasks</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Create Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign New Task</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="task-user" className="text-right">User</Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select user" />
                          </SelectTrigger>
                          <SelectContent>
                            {sampleUsers.map(user => (
                              <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="task-desc" className="text-right">Task</Label>
                        <Textarea id="task-desc" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="revenue" className="text-right">Revenue</Label>
                        <Input id="revenue" type="number" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Assign Task</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {sampleUsers.map((user) => {
                  const userTasks = sampleTasks.filter(task => task.userId === user.id);
                  const totalRevenue = userTasks.reduce((sum, task) => sum + task.revenue, 0);
                  
                  return (
                    <div key={user.id} className="border rounded-lg p-4 transition-all hover:shadow-md">
                      <div className="flex flex-col sm:flex-row justify-between mb-4">
                        <div className="flex items-center gap-3 mb-3 sm:mb-0">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-muted-foreground">{user.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-green-600">
                          <DollarSign className="h-5 w-5" />
                          <span className="font-bold">${totalRevenue}</span>
                        </div>
                      </div>
                      
                      {userTasks.length > 0 ? (
                        <div className="space-y-2">
                          {userTasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                              <div className="flex items-center gap-2">
                                {task.status === 'completed' ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                                )}
                                <span>{task.task}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">${task.revenue}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No tasks assigned</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="mt-6">
          <Card className="p-6">
            <div className="grid md:grid-cols-[300px_1fr] gap-6">
              <div className="space-y-4">
                <Input placeholder="Search users..." />
                <ScrollArea className="h-[500px] border rounded-lg">
                  <div className="space-y-2 p-2">
                    {sampleUsers.map((user) => (
                      <Button
                        key={user.id}
                        variant={selectedUser === user.name ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedUser(user.name)}
                      >
                        {user.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <div className="flex flex-col h-[500px] border rounded-lg">
                {selectedUser ? (
                  <>
                    <div className="p-4 border-b">
                      <h3 className="font-medium">{selectedUser}</h3>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {/* Message history would go here */}
                        <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
                          <p className="text-sm">Hi there! How can I help you today?</p>
                          <span className="text-xs text-muted-foreground block mt-1">10:30 AM</span>
                        </div>
                      </div>
                    </ScrollArea>
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <Button onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Select a user to start messaging
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Users;
