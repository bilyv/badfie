import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, File, Folder } from "lucide-react";

const DocsStorage = () => {
  const documents = [
    {
      id: 1,
      name: "Invoices",
      type: "folder",
      items: 24,
      updatedAt: "2 days ago",
    },
    {
      id: 2,
      name: "Contracts",
      type: "folder",
      items: 12,
      updatedAt: "1 week ago",
    },
    {
      id: 3,
      name: "Q1 Report.pdf",
      type: "file",
      size: "2.4 MB",
      updatedAt: "3 days ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Document Storage
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage and organize your business documents
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-8" />
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  {doc.type === "folder" ? (
                    <Folder className="h-8 w-8 text-blue-500" />
                  ) : (
                    <File className="h-8 w-8 text-gray-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{doc.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {doc.type === "folder" ? `${doc.items} items` : doc.size}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Updated {doc.updatedAt}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DocsStorage;