
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Clock, Plus, User, CheckCircle2, XCircle, Users, BarChart, CalendarClock, FilterX, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const appointmentStatuses = {
  CONFIRMED: "confirmed",
  PENDING: "pending",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

interface Appointment {
  id: number;
  client: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  status: string;
}

const appointmentsData: Appointment[] = [
  { id: 1, client: "Sarah Johnson", service: "Hair Styling", date: "2023-06-15", time: "10:00 AM", duration: "1h", status: appointmentStatuses.CONFIRMED },
  { id: 2, client: "Michael Chen", service: "Consultation", date: "2023-06-15", time: "1:00 PM", duration: "30m", status: appointmentStatuses.PENDING },
  { id: 3, client: "Jessica Williams", service: "Massage Therapy", date: "2023-06-15", time: "3:30 PM", duration: "1h 30m", status: appointmentStatuses.CONFIRMED },
  { id: 4, client: "David Rodriguez", service: "Financial Planning", date: "2023-06-16", time: "11:00 AM", duration: "2h", status: appointmentStatuses.CANCELLED },
  { id: 5, client: "Emily Taylor", service: "Teeth Cleaning", date: "2023-06-16", time: "2:00 PM", duration: "45m", status: appointmentStatuses.CONFIRMED },
  { id: 6, client: "Robert Johnson", service: "Legal Consultation", date: "2023-06-16", time: "4:00 PM", duration: "1h", status: appointmentStatuses.COMPLETED },
  { id: 7, client: "Amanda Lee", service: "Tax Preparation", date: "2023-06-17", time: "9:30 AM", duration: "1h", status: appointmentStatuses.CONFIRMED },
  { id: 8, client: "James Wilson", service: "Marketing Strategy", date: "2023-06-17", time: "12:00 PM", duration: "2h", status: appointmentStatuses.CONFIRMED },
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const currentDate = new Date();

// Generate date objects for the current week
const generateWeekDays = () => {
  const days = [];
  const day = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Start from Sunday of current week
  const firstDay = new Date(currentDate);
  firstDay.setDate(currentDate.getDate() - day);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + i);
    days.push(date);
  }
  
  return days;
};

const weekDays = generateWeekDays();

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentsData);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const filteredAppointments = appointments.filter(appointment => {
    // Filter by selected date
    const dateMatch = appointment.date === formatDate(selectedDate);
    
    // Filter by status if not "all"
    if (selectedFilter !== "all") {
      return dateMatch && appointment.status === selectedFilter;
    }
    
    return dateMatch;
  });

  const getStatusStyles = (status: string) => {
    switch(status) {
      case appointmentStatuses.CONFIRMED:
        return "bg-blue-100 text-blue-800";
      case appointmentStatuses.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case appointmentStatuses.CANCELLED:
        return "bg-red-100 text-red-800";
      case appointmentStatuses.COMPLETED:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>New Appointment</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(a => a.date === formatDate(currentDate)).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clients Seen (This Week)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(a => a.status === appointmentStatuses.COMPLETED).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Appointment Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((appointments.filter(a => a.status !== appointmentStatuses.CANCELLED).length / appointments.length) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-2 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex gap-2 items-center">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-semibold">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" className="h-8">
              Today
            </Button>
          </div>
          <div className="flex gap-2 items-center w-full sm:w-auto">
            <Select defaultValue="all" onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-full sm:w-[180px] h-8">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All appointments</SelectItem>
                <SelectItem value={appointmentStatuses.CONFIRMED}>Confirmed</SelectItem>
                <SelectItem value={appointmentStatuses.PENDING}>Pending</SelectItem>
                <SelectItem value={appointmentStatuses.CANCELLED}>Cancelled</SelectItem>
                <SelectItem value={appointmentStatuses.COMPLETED}>Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <FilterX className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-6">
          {weekDays.map((date, index) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-md cursor-pointer transition-colors",
                  isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  isToday && !isSelected ? "border border-primary" : ""
                )}
                onClick={() => setSelectedDate(date)}
              >
                <span className="text-xs font-medium">{daysOfWeek[index]}</span>
                <span className={cn(
                  "text-lg font-bold mt-1",
                  isSelected ? "text-primary-foreground" : ""
                )}>
                  {date.getDate()}
                </span>
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sm mb-2">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <div 
                key={appointment.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-2 sm:mb-0">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{appointment.time} ({appointment.duration})</span>
                    </div>
                    <h4 className="font-medium mt-1">{appointment.service}</h4>
                    <div className="flex items-center gap-1 mt-1 text-sm">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span>{appointment.client}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(appointment.status)}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                  <div className="flex">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CalendarClock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No appointments scheduled</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                There are no appointments scheduled for this date or matching your filter criteria.
              </p>
              <Button variant="outline" className="mt-4">
                Add appointment
              </Button>
            </div>
          )}
        </div>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Appointment Analytics</CardTitle>
          <CardDescription>Service breakdown and utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-48 w-10 bg-primary/10 relative rounded-t-md overflow-hidden">
                  <div className="absolute bottom-0 w-full bg-primary h-[60%]"></div>
                </div>
                <span className="text-xs mt-2">Mon</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-48 w-10 bg-primary/10 relative rounded-t-md overflow-hidden">
                  <div className="absolute bottom-0 w-full bg-primary h-[40%]"></div>
                </div>
                <span className="text-xs mt-2">Tue</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-48 w-10 bg-primary/10 relative rounded-t-md overflow-hidden">
                  <div className="absolute bottom-0 w-full bg-primary h-[75%]"></div>
                </div>
                <span className="text-xs mt-2">Wed</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-48 w-10 bg-primary/10 relative rounded-t-md overflow-hidden">
                  <div className="absolute bottom-0 w-full bg-primary h-[65%]"></div>
                </div>
                <span className="text-xs mt-2">Thu</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-48 w-10 bg-primary/10 relative rounded-t-md overflow-hidden">
                  <div className="absolute bottom-0 w-full bg-primary h-[80%]"></div>
                </div>
                <span className="text-xs mt-2">Fri</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-48 w-10 bg-primary/10 relative rounded-t-md overflow-hidden">
                  <div className="absolute bottom-0 w-full bg-primary h-[30%]"></div>
                </div>
                <span className="text-xs mt-2">Sat</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-48 w-10 bg-primary/10 relative rounded-t-md overflow-hidden">
                  <div className="absolute bottom-0 w-full bg-primary h-[15%]"></div>
                </div>
                <span className="text-xs mt-2">Sun</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointments;
