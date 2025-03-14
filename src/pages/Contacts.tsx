
import { useState } from "react";
import { Plus, Users, ShoppingBag, Briefcase, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

// Define contact types
type ContactType = "customer" | "supplier" | "vendor";

interface ContactData {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: ContactType;
  company?: string;
  address?: string;
}

// Mock data for contacts
const mockContacts: ContactData[] = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "+1234567890", type: "customer", company: "ABC Corp" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+1987654321", type: "customer", company: "XYZ Ltd" },
  { id: "3", name: "Bob Johnson", email: "bob@supplier.com", phone: "+1122334455", type: "supplier", company: "Supply Co." },
  { id: "4", name: "Alice Brown", email: "alice@vendor.net", phone: "+1567890123", type: "vendor", company: "Vendor Inc." },
];

// Form schema for contact creation
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(7, { message: "Please enter a valid phone number." }),
  type: z.enum(["customer", "supplier", "vendor"]),
  company: z.string().optional(),
  address: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contacts = () => {
  const [contacts, setContacts] = useState<ContactData[]>(mockContacts);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ContactType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      type: "customer",
      company: "",
      address: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    const newContact: ContactData = {
      id: Math.random().toString(36).substring(2, 11),
      name: data.name,
      email: data.email,
      phone: data.phone,
      type: data.type,
      company: data.company,
      address: data.address,
    };
    
    setContacts((prev) => [...prev, newContact]);
    setIsCreateDialogOpen(false);
    form.reset();
  };

  // Filter contacts based on the active filter and search query
  const filteredContacts = contacts.filter((contact) => {
    const matchesFilter = activeFilter === "all" || contact.type === activeFilter;
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      contact.phone.includes(searchQuery);
    
    return matchesFilter && matchesSearch;
  });

  const getFilterIcon = (filter: ContactType | "all") => {
    switch (filter) {
      case "customer": return <Users className="h-4 w-4" />;
      case "supplier": return <ShoppingBag className="h-4 w-4" />;
      case "vendor": return <Briefcase className="h-4 w-4" />;
      case "all": return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
          <p className="text-muted-foreground">
            Manage your customers, suppliers, and vendors
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="mr-2 h-4 w-4" /> Add Contact
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
            className="flex items-center gap-2"
          >
            All
          </Button>
          <Button 
            variant={activeFilter === "customer" ? "default" : "outline"}
            onClick={() => setActiveFilter("customer")}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" /> Customers
          </Button>
          <Button 
            variant={activeFilter === "supplier" ? "default" : "outline"}
            onClick={() => setActiveFilter("supplier")}
            className="flex items-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" /> Suppliers
          </Button>
          <Button 
            variant={activeFilter === "vendor" ? "default" : "outline"}
            onClick={() => setActiveFilter("vendor")}
            className="flex items-center gap-2"
          >
            <Briefcase className="h-4 w-4" /> Vendors
          </Button>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search contacts..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No contacts found</h3>
            <p className="text-muted-foreground mt-1">
              {searchQuery ? `No results for "${searchQuery}"` : `No ${activeFilter !== "all" ? activeFilter + "s" : "contacts"} found`}
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              variant="outline" 
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Contact
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className={`${isMobile ? 'w-[95vw] max-w-[95vw]' : 'sm:max-w-[500px]'}`}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Contact</DialogTitle>
            <DialogDescription>
              Add a new contact to your network. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a contact type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="supplier">Supplier</SelectItem>
                        <SelectItem value="vendor">Vendor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-2">
                <DialogClose asChild>
                  <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                  Create Contact
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Contact Card Component
const ContactCard = ({ contact }: { contact: ContactData }) => {
  const getTypeIcon = () => {
    switch (contact.type) {
      case "customer": return <Users className="h-4 w-4 text-blue-500" />;
      case "supplier": return <ShoppingBag className="h-4 w-4 text-green-500" />;
      case "vendor": return <Briefcase className="h-4 w-4 text-purple-500" />;
    }
  };

  const getTypeColor = () => {
    switch (contact.type) {
      case "customer": return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
      case "supplier": return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
      case "vendor": return "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300";
    }
  };

  const getHeaderGradient = () => {
    switch (contact.type) {
      case "customer": return "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30";
      case "supplier": return "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30";
      case "vendor": return "from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30";
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-200 hover:shadow-md">
      <CardHeader className={`bg-gradient-to-r ${getHeaderGradient()} pb-2`}>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{contact.name}</CardTitle>
          <div className={`rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1 ${getTypeColor()}`}>
            {getTypeIcon()}
            {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
          </div>
        </div>
        {contact.company && (
          <p className="text-sm text-muted-foreground">{contact.company}</p>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="truncate">{contact.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{contact.phone}</span>
        </div>
        {contact.address && (
          <div className="flex items-center gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{contact.address}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Contacts;
