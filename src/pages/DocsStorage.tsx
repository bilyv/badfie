
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus, 
  Search, 
  File, 
  Folder,
  FilePlus,
  FolderPlus,
  MoreHorizontal,
  Upload,
  Download,
  Trash,
  X,
  FileText,
  FileImage,
  FileSpreadsheet,
  FilePdf
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getFileIcon = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch(extension) {
    case 'pdf':
      return <FilePdf className="h-10 w-10 text-red-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <FileImage className="h-10 w-10 text-purple-500" />;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
    default:
      return <FileText className="h-10 w-10 text-blue-500" />;
  }
};

const DocsStorage = () => {
  const [documents, setDocuments] = useState([
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
    {
      id: 4,
      name: "Financial Statement.xlsx",
      type: "file",
      size: "1.2 MB",
      updatedAt: "1 day ago",
    },
    {
      id: 5,
      name: "Company Logo.png",
      type: "file",
      size: "0.8 MB",
      updatedAt: "5 days ago",
    },
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const filteredDocuments = documents.filter(
    doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!uploadFileName) {
        setUploadFileName(file.name);
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    const newDocument = {
      id: documents.length + 1,
      name: uploadFileName || selectedFile.name,
      type: "file",
      size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      updatedAt: "Just now",
    };

    setDocuments([newDocument, ...documents]);
    
    toast({
      title: "File uploaded",
      description: "Your file has been successfully uploaded",
    });
    
    setIsUploadOpen(false);
    setSelectedFile(null);
    setUploadFileName("");
  };

  const createNewFolder = () => {
    const newFolder = {
      id: documents.length + 1,
      name: "New Folder",
      type: "folder",
      items: 0,
      updatedAt: "Just now",
    };

    setDocuments([newFolder, ...documents]);
    
    toast({
      title: "Folder created",
      description: "Your new folder has been created",
    });
  };

  const deleteItem = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    
    toast({
      title: "Item deleted",
      description: "The item has been successfully deleted",
    });
  };

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
          <Input 
            placeholder="Search documents..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={createNewFolder} variant="outline" className="gap-2">
            <FolderPlus className="h-4 w-4" />
            <span className="hidden sm:inline">New Folder</span>
          </Button>
          
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload Document</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a new document to your storage.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="fileName">File Name (optional)</Label>
                  <Input
                    id="fileName"
                    placeholder="Enter custom file name"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file">Select File</Label>
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2">
                        {getFileIcon(selectedFile.name)}
                        <div className="text-left">
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-auto"
                          onClick={() => setSelectedFile(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <FilePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Drag and drop a file, or click to browse
                        </p>
                        <Input
                          id="file"
                          type="file"
                          className="mt-4 mx-auto max-w-[80%]"
                          onChange={handleFileChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload}>Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <Card key={doc.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    {doc.type === "folder" ? (
                      <Folder className="h-10 w-10 text-blue-500" />
                    ) : (
                      getFileIcon(doc.name)
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {doc.type === "folder" ? `${doc.items} items` : doc.size}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {doc.type === "file" && (
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => deleteItem(doc.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Updated {doc.updatedAt}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <File className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <p className="mt-4 text-lg font-medium">No documents found</p>
              <p className="text-muted-foreground">
                {searchQuery ? "Try a different search term" : "Upload your first document to get started"}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DocsStorage;
