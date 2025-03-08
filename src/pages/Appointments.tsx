
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Calendar as CalendarIcon, Plus, User, CheckCircle, XCircle, Clock4, UserSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Sample appointment data
const appointments = [
  {
    id: 1,
    client: "Jane Cooper",
    service: "Hair Styling",
    date: "2024-05-10",
    time: "10:00 AM",
    duration: "1 hour",
    status: "confirmed"
  },
  {
    id: 2,
    client: "Robert Fox",
    service: "Massage Therapy",
    date: "2024-05-10",
    time: "2:00 PM",
    duration: "45 minutes",
    status: "pending"
  },
  {
    id: 3,
    client: "Emily Wilson",
    service: "Consultation",
    date: "2024-05-11",
    time: "11:30 AM",
    duration: "30 minutes",
    status: "confirmed"
  }
];

// Available time slots
const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
];

// Available services
const services = [
  "Hair Styling", "Massage Therapy", "Consultation", "Spa Treatment",
  "Facial", "Manicure", "Pedicure"
];

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    client: "",
    service: "",
    date: new Date(),
    time: "",
    duration: "30 minutes",
    notes: ""
  });

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
  };

  const handleAddAppointment = () => {
    // In a real app, this would add the appointment to the database
    console.log("Adding appointment:", newAppointment);
    setAppointmentDialogOpen(false);
    toast({
      description: "Appointment scheduled successfully"
    });
    // Reset form
    setNewAppointment({
      client: "",
      service: "",
      date: new Date(),
      time: "",
      duration: "30 minutes",
      notes: ""
    });
  };

  const getTodaysAppointments = () => {
    return appointments.filter(
      app => app.date === format(date || new Date(), 'yyyy-MM-dd')
    );
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground">Schedule and manage appointments</p>
        </div>
        <Dialog open={appointmentDialogOpen} onOpenChange={setAppointmentDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" /> New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule Appointment</DialogTitle>
              <DialogDescription>Fill in the appointment details below.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="client">Client</Label>
                <Select
                  value={newAppointment.client}
                  onValueChange={(value) => setNewAppointment({...newAppointment, client: value})}
                >
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jane Cooper">Jane Cooper</SelectItem>
                    <SelectItem value="Robert Fox">Robert Fox</SelectItem>
                    <SelectItem value="Emily Wilson">Emily Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service">Service</Label>
                <Select
                  value={newAppointment.service}
                  onValueChange={(value) => setNewAppointment({...newAppointment, service: value})}
                >
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service} value={service}>{service}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="border rounded-md p-2">
                    <Calendar
                      mode="single"
                      selected={newAppointment.date}
                      onSelect={(date) => setNewAppointment({...newAppointment, date: date || new Date()})}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Select
                      value={newAppointment.time}
                      onValueChange={(value) => setNewAppointment({...newAppointment, time: value})}
                    >
                      <SelectTrigger id="time">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select
                      value={newAppointment.duration}
                      onValueChange={(value) => setNewAppointment({...newAppointment, duration: value})}
                    >
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15 minutes">15 minutes</SelectItem>
                        <SelectItem value="30 minutes">30 minutes</SelectItem>
                        <SelectItem value="45 minutes">45 minutes</SelectItem>
                        <SelectItem value="1 hour">1 hour</SelectItem>
                        <SelectItem value="1.5 hours">1.5 hours</SelectItem>
                        <SelectItem value="2 hours">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAppointmentDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddAppointment}>Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-4">
            <Card className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">
                  Appointments for {date ? format(date, 'MMMM d, yyyy') : 'Today'}
                </h3>
                <Badge variant="outline" className="flex items-center">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {date ? format(date, 'EEEE') : 'Today'}
                </Badge>
              </div>

              {getTodaysAppointments().length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {getTodaysAppointments().map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex justify-between items-start p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex gap-3">
                          <div className="relative">
                            <div className={`absolute top-0 left-0 w-full h-full rounded-full ${getAppointmentStatusColor(appointment.status)} opacity-10`}></div>
                            <UserSquare className="h-10 w-10 text-primary" />
                            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${getAppointmentStatusColor(appointment.status)} border-2 border-background`}></div>
                          </div>
                          <div>
                            <h4 className="font-medium">{appointment.client}</h4>
                            <p className="text-sm text-muted-foreground">{appointment.service}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center text-xs">
                                <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                                {appointment.time}
                              </div>
                              <div className="flex items-center text-xs">
                                <Clock4 className="mr-1 h-3 w-3 text-muted-foreground" />
                                {appointment.duration}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {appointment.status === "pending" ? (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          ) : (
                            <Badge variant={appointment.status === "confirmed" ? "default" : "destructive"}>
                              {appointment.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="text-center">
                    <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No appointments</h3>
                    <p className="text-sm text-muted-foreground">No appointments scheduled for this day</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.client}</TableCell>
                    <TableCell>{appointment.service}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.duration}</TableCell>
                    <TableCell>
                      <Badge variant={appointment.status === "confirmed" ? "default" : appointment.status === "pending" ? "outline" : "destructive"}>
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-destructive">Cancel</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;
