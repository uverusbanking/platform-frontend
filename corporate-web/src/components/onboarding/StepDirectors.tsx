import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, Plus, Pencil, Trash2, UserCheck, Mail } from "lucide-react";
import type { Director, DirectorInput, FeedbackItem, DirectorRole, IDType, VerificationStatus } from "@/types/onboarding";
import { DIRECTOR_ROLE_LABELS, ID_TYPE_LABELS } from "@/types/onboarding";

interface Props {
  directors: Director[];
  feedback: FeedbackItem[];
  onSave: (directors: Director[]) => void;
  onBack: () => void;
}

const verificationBadge: Record<VerificationStatus, { label: string; className: string }> = {
  not_sent: { label: "Not Sent", className: "bg-muted text-muted-foreground" },
  email_sent: { label: "Email Sent 📧", className: "bg-primary/10 text-primary border-primary/20" },
  link_opened: { label: "Link Opened 👁️", className: "bg-warning/10 text-warning border-warning/20" },
  verified: { label: "Verified ✅", className: "bg-success/10 text-success border-success/20" },
  failed: { label: "Failed ❌", className: "bg-destructive/10 text-destructive border-destructive/20" },
  expired: { label: "Expired ⏰", className: "bg-muted text-muted-foreground" },
};

const emptyDirector: DirectorInput = {
  full_name: "", role: "director", date_of_birth: "", nationality: "Nigeria",
  bvn: "", phone_number: "", email: "", residential_address: "",
  id_type: "international_passport", id_number: "", id_expiry_date: "",
};

export default function StepDirectors({ directors: initialDirectors, feedback, onSave, onBack }: Props) {
  const [directors, setDirectors] = useState<Director[]>(initialDirectors);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DirectorInput>(emptyDirector);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: keyof DirectorInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (form.full_name.length < 2) errs.full_name = "Full name is required";
    if (!/^[0-9]{11}$/.test(form.bvn)) errs.bvn = "BVN must be exactly 11 digits";
    if (!form.date_of_birth) errs.date_of_birth = "Date of birth is required";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email is required";
    if (!form.phone_number) errs.phone_number = "Phone number is required";
    if (!form.residential_address || form.residential_address.length < 5) errs.residential_address = "Address required";
    if (!form.id_number || form.id_number.length < 5) errs.id_number = "ID number is required";
    if (!form.id_expiry_date) errs.id_expiry_date = "ID expiry date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveDirector = () => {
    if (!validate()) return;
    if (editingId) {
      setDirectors((prev) => prev.map((d) => d.id === editingId ? { ...d, ...form } : d));
    } else {
      const newDir: Director = {
        ...form,
        id: `dir-${Date.now()}`,
        verification_status: "not_sent",
        verification_sent_at: null,
        verification_completed_at: null,
        id_document_uploaded: false,
        passport_photo_uploaded: false,
        signature_uploaded: false,
        created_at: new Date().toISOString(),
      };
      setDirectors((prev) => [...prev, newDir]);
    }
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyDirector);
    setErrors({});
  };

  const openEdit = (dir: Director) => {
    setForm({
      full_name: dir.full_name, role: dir.role, date_of_birth: dir.date_of_birth,
      nationality: dir.nationality, bvn: dir.bvn, phone_number: dir.phone_number,
      email: dir.email, residential_address: dir.residential_address,
      id_type: dir.id_type, id_number: dir.id_number, id_expiry_date: dir.id_expiry_date,
    });
    setEditingId(dir.id);
    setDialogOpen(true);
  };

  const removeDirector = (id: string) => {
    setDirectors((prev) => prev.filter((d) => d.id !== id));
  };

  const simulateVerification = (id: string) => {
    setDirectors((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const transitions: Record<string, VerificationStatus> = {
          not_sent: "email_sent",
          email_sent: "link_opened",
          link_opened: "verified",
        };
        return {
          ...d,
          verification_status: transitions[d.verification_status] ?? d.verification_status,
          verification_sent_at: d.verification_sent_at ?? new Date().toISOString(),
          verification_completed_at: transitions[d.verification_status] === "verified" ? new Date().toISOString() : d.verification_completed_at,
        };
      })
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Directors & Signatories</CardTitle>
            <CardDescription>Step 3 of 5 — Add your company's directors and authorized signatories</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) { setEditingId(null); setForm(emptyDirector); setErrors({}); }
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Person</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit" : "Add"} Director / Signatory</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={form.full_name} onChange={update("full_name")} />
                  {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as DirectorRole }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(DIRECTOR_ROLE_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth *</Label>
                  <Input type="date" value={form.date_of_birth} onChange={update("date_of_birth")} />
                  {errors.date_of_birth && <p className="text-xs text-destructive">{errors.date_of_birth}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Nationality *</Label>
                  <Input value={form.nationality} onChange={update("nationality")} />
                </div>
                <div className="space-y-2">
                  <Label>BVN *</Label>
                  <Input value={form.bvn} onChange={update("bvn")} placeholder="11 digits" maxLength={11} />
                  {errors.bvn && <p className="text-xs text-destructive">{errors.bvn}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input value={form.phone_number} onChange={update("phone_number")} placeholder="+234..." />
                  {errors.phone_number && <p className="text-xs text-destructive">{errors.phone_number}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input type="email" value={form.email} onChange={update("email")} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Residential Address *</Label>
                  <Input value={form.residential_address} onChange={update("residential_address")} />
                  {errors.residential_address && <p className="text-xs text-destructive">{errors.residential_address}</p>}
                </div>
                <div className="space-y-2">
                  <Label>ID Type *</Label>
                  <Select value={form.id_type} onValueChange={(v) => setForm((f) => ({ ...f, id_type: v as IDType }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(ID_TYPE_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ID Number *</Label>
                  <Input value={form.id_number} onChange={update("id_number")} />
                  {errors.id_number && <p className="text-xs text-destructive">{errors.id_number}</p>}
                </div>
                <div className="space-y-2">
                  <Label>ID Expiry Date *</Label>
                  <Input type="date" value={form.id_expiry_date} onChange={update("id_expiry_date")} min={new Date().toISOString().split("T")[0]} />
                  {errors.id_expiry_date && <p className="text-xs text-destructive">{errors.id_expiry_date}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveDirector}>{editingId ? "Update" : "Add"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {directors.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No directors or signatories added yet.</p>
            <p className="text-xs mt-1">At least 1 director and 1 signatory are required.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {directors.map((dir) => {
              const vBadge = verificationBadge[dir.verification_status];
              const fb = feedback.find((f) => f.target_id === dir.id);
              return (
                <div key={dir.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{dir.full_name}</p>
                        <Badge variant="outline" className="text-xs">{DIRECTOR_ROLE_LABELS[dir.role]}</Badge>
                        <Badge variant="outline" className={vBadge.className}>{vBadge.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{dir.email} · {dir.phone_number}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">BVN: {dir.bvn} · ID: {ID_TYPE_LABELS[dir.id_type]}</p>
                      {fb && (
                        <div className="flex items-start gap-1.5 mt-2">
                          <AlertCircle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
                          <span className="text-xs text-destructive">{fb.comment}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {(dir.verification_status === "not_sent" || dir.verification_status === "email_sent" || dir.verification_status === "link_opened") && (
                        <Button size="sm" variant="ghost" onClick={() => simulateVerification(dir.id)} title="Simulate verification step">
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => openEdit(dir)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => removeDirector(dir.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={() => onSave(directors)}>Save & Continue</Button>
        </div>
      </CardContent>
    </Card>
  );
}
