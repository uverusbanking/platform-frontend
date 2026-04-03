import { useState } from "react";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type NotificationPayload = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  category: string;
  recipients: string;
  recipientType: string;
  deliveryMethod: string;
  timestamp: string;
  status: "sent";
};

interface SendNotificationDialogProps {
  onNotificationSent?: (notification: NotificationPayload) => void;
}

export default function SendNotificationDialog({
  onNotificationSent,
}: SendNotificationDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "success" | "warning" | "error">(
    "info",
  );
  const [category, setCategory] = useState("system");
  const [recipients, setRecipients] = useState("all");
  const [deliveryMethod, setDeliveryMethod] = useState<string[]>(["in-app"]);
  const [recipientType, setRecipientType] = useState("all");
  const [specificUser, setSpecificUser] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const handleSend = () => {
    if (!title || !message) {
      toast.error("Please fill in all required fields");
      return;
    }

    const notification: NotificationPayload = {
      id: Date.now().toString(),
      title,
      message,
      type,
      category,
      recipients:
        recipientType === "single"
          ? specificUser
          : recipientType === "group"
            ? selectedGroup
            : recipientType,
      recipientType,
      deliveryMethod: deliveryMethod.join(", "),
      timestamp: new Date().toLocaleString(),
      status: "sent",
    };

    onNotificationSent?.(notification);

    toast.success("Notification sent successfully");

    setTitle("");
    setMessage("");
    setType("info");
    setCategory("system");
    setRecipients("all");
    setDeliveryMethod(["in-app"]);
    setRecipientType("all");
    setSpecificUser("");
    setSelectedGroup("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer font-bold">
          <Send className="mr-2 h-4 w-4" />
          Send Notification
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogDescription>
            Create and send a notification to users
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              placeholder="Enter notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={type}
                onValueChange={(
                  value: "info" | "success" | "warning" | "error",
                ) => setType(value)}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                  <SelectItem value="loans">Loans</SelectItem>
                  <SelectItem value="transactions">Transactions</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="branches">Branches</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="delivery">Delivery Method</Label>
            <div className="space-y-2">
              {[
                { id: "in-app", label: "In-App Notification" },
                { id: "email", label: "Email" },
                { id: "push", label: "Push Notification" },
                { id: "sms", label: "SMS" },
              ].map((method) => (
                <div key={method.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={method.id}
                    checked={deliveryMethod.includes(method.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setDeliveryMethod([...deliveryMethod, method.id]);
                      } else {
                        setDeliveryMethod(
                          deliveryMethod.filter((m) => m !== method.id),
                        );
                      }
                    }}
                  />
                  <Label
                    htmlFor={method.id}
                    className="cursor-pointer font-normal"
                  >
                    {method.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipientType">Recipient Type</Label>
            <Select value={recipientType} onValueChange={setRecipientType}>
              <SelectTrigger id="recipientType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="admins">Admins Only</SelectItem>
                <SelectItem value="managers">Managers Only</SelectItem>
                <SelectItem value="staff">Staff Only</SelectItem>
                <SelectItem value="single">Single User</SelectItem>
                <SelectItem value="group">Group/Department</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {recipientType === "single" && (
            <div className="space-y-2">
              <Label htmlFor="specificUser">User Email/ID</Label>
              <Input
                id="specificUser"
                placeholder="Enter user email or ID"
                value={specificUser}
                onChange={(e) => setSpecificUser(e.target.value)}
              />
            </div>
          )}
          {recipientType === "group" && (
            <div className="space-y-2">
              <Label htmlFor="group">Select Group</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger id="group">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finance">Finance Department</SelectItem>
                  <SelectItem value="operations">Operations Team</SelectItem>
                  <SelectItem value="customer-service">
                    Customer Service
                  </SelectItem>
                  <SelectItem value="compliance">Compliance Team</SelectItem>
                  <SelectItem value="it">IT Department</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend}>
            <Send className="mr-2 h-4 w-4" />
            Send Notification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
