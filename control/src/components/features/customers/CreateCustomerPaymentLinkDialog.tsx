import { useState } from "react";
import { Link, Copy, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface CreateCustomerPaymentLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  customerName: string;
}

export function CreateCustomerPaymentLinkDialog({
  open,
  onOpenChange,
  customerId,
  customerName,
}: CreateCustomerPaymentLinkDialogProps) {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [description, setDescription] = useState("");
  const [linkType, setLinkType] = useState("single-use");
  const [expiryDays, setExpiryDays] = useState("7");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!amount || !purpose) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields",
        richColors: true,
      });
      return;
    }

    const link = `https://platpay.app/pay/customer/${customerId}/${Date.now()}?amount=${amount}&purpose=${encodeURIComponent(purpose)}`;
    setGeneratedLink(link);

    toast("Payment Link Generated", {
      description: `Payment link created for ${customerName}`,
      richColors: true,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast("Copied!", {
      description: "Payment link copied to clipboard",
      richColors: true,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setAmount("");
    setPurpose("");
    setDescription("");
    setGeneratedLink("");
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Payment Link</DialogTitle>
          <DialogDescription>
            Generate a payment link for {customerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₦) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Payment Purpose *</Label>
            <Select value={purpose} onValueChange={setPurpose}>
              <SelectTrigger id="purpose">
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loan-repayment">Loan Repayment</SelectItem>
                <SelectItem value="account-deposit">Account Deposit</SelectItem>
                <SelectItem value="service-fee">Service Fee</SelectItem>
                <SelectItem value="card-payment">Card Payment</SelectItem>
                <SelectItem value="overdraft-settlement">
                  Overdraft Settlement
                </SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Additional details about this payment"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="link-type">Link Type</Label>
              <Select value={linkType} onValueChange={setLinkType}>
                <SelectTrigger id="link-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-use">Single Use</SelectItem>
                  <SelectItem value="reusable">Reusable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">Expires In</Label>
              <Select value={expiryDays} onValueChange={setExpiryDays}>
                <SelectTrigger id="expiry">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Day</SelectItem>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="14">14 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!generatedLink ? (
            <Button
              onClick={handleGenerate}
              className="w-full bg-gradient-primary"
            >
              <Link className="w-4 h-4 mr-2" />
              Generate Payment Link
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-success-light/10 border border-success rounded-md">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-success mb-2">
                      Payment Link Generated
                    </p>
                    <p className="text-xs text-muted-foreground break-all">
                      {generatedLink}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="flex-1"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
                <Button onClick={handleClose} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
