"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  UserPlus,
  Search,
  Download,
  Edit,
  Trash2,
  Shield,
  Wallet,
  DollarSign,
  Calendar,
  Lock,
  Eye,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useGetCompanyUsers } from "@/hooks/queries/useCompanyQueries";
import {
  useAddBrandUser,
  useUpdateBrandUser,
  useDeleteBrandUser,
} from "@/hooks/mutations/useCompanyMutations";
import { useGetEncryptionPublicKey } from "@/hooks/queries/useAuthQueries";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { encryptPassword } from "@shared/core";
import { getApiErrorMessage } from "@/utils/apiClient";
import { IUser } from "@/types/user.types";
import { Pagination } from "@/components/shared/Pagination";
import { staffSchema } from "@/lib/schemas/staff/staff.schema";
import { Gender } from "@/types/enums";
import { staffRoles } from "@/auth/roles";

const StaffFormSchema = staffSchema;

type StaffFormValues = z.infer<typeof StaffFormSchema>;

const roles = [
  { id: 1, name: "Super Admin", users: 2, description: "Full system access" },
  {
    id: 2,
    name: "Branch Manager",
    users: 5,
    description: "Branch-level management",
  },
  { id: 3, name: "Cashier", users: 12, description: "Transaction processing" },
  { id: 4, name: "Support Staff", users: 8, description: "Customer support" },
];

const permissions = [
  {
    module: "Dashboard",
    view: true,
    create: false,
    edit: false,
    delete: false,
  },
  { module: "Customers", view: true, create: true, edit: true, delete: false },
  {
    module: "Transactions",
    view: true,
    create: true,
    edit: true,
    delete: false,
  },
  { module: "Loans", view: true, create: true, edit: true, delete: true },
  { module: "Cards", view: true, create: true, edit: false, delete: false },
  { module: "Reports", view: true, create: false, edit: false, delete: false },
  {
    module: "Settings",
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
];

const payrollRecords = [
  {
    id: 1,
    staff: "John Doe",
    month: "January 2025",
    basicSalary: 500000,
    commission: 25000,
    deductions: 50000,
    netPay: 475000,
    status: "paid",
    paidOn: "2025-01-25",
  },
  {
    id: 2,
    staff: "Jane Smith",
    month: "January 2025",
    basicSalary: 250000,
    commission: 15000,
    deductions: 25000,
    netPay: 240000,
    status: "pending",
    paidOn: "-",
  },
];

const vaults = [
  {
    id: 1,
    name: "Vault A",
    branch: "Lagos Main",
    balance: 5000000,
    assignedTo: "John Doe",
    status: "active",
    lastUpdated: "2025-01-20 14:30",
  },
  {
    id: 2,
    name: "Vault B",
    branch: "Abuja Center",
    balance: 3500000,
    assignedTo: "Jane Smith",
    status: "active",
    lastUpdated: "2025-01-20 15:45",
  },
];

export default function Staff() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: staffData,
    isLoading,
    isError,
  } = useGetCompanyUsers({
    search: debouncedSearch || undefined,
    role: selectedRole === "all" ? undefined : selectedRole,
    page: currentPage,
    limit,
  });

  // Handle different potential response structures
  const staffMembers = staffData?.data || [];

  const meta = staffData?.meta;

  const { mutate: addStaffMutation, isPending: isAddingStaff } =
    useAddBrandUser();
  const { mutate: updateStaffMutation } = useUpdateBrandUser();
  const { mutate: deleteStaffMutation } = useDeleteBrandUser();
  const { data: publicKey } = useGetEncryptionPublicKey();

  const [selectedStaff, setSelectedStaff] = useState<IUser | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(StaffFormSchema),
    defaultValues: {
      middle_name: "",
      gender: Gender.MALE,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editForm = useForm<any>({
    resolver: zodResolver(
      StaffFormSchema.omit({ email: true, password: true }),
    ),
  });

  useEffect(() => {
    if (selectedStaff && isEditModalOpen) {
      editForm.reset({
        first_name: selectedStaff.first_name,
        last_name: selectedStaff.last_name,
        middle_name: selectedStaff.middle_name || "",
        phone_number: selectedStaff.phone_number,
        role: selectedStaff.role,
        gender: selectedStaff.gender,
      });
    }
  }, [selectedStaff, isEditModalOpen, editForm]);

  const onSubmit = async (data: StaffFormValues) => {
    if (!publicKey) {
      toast.error("Encryption key not found");
      return;
    }

    const encryptedPassword = await encryptPassword(
      data.password,
      publicKey.data.public_key,
    );

    const payload = {
      ...data,
      middle_name: data.middle_name || "",
      password: encryptedPassword,
    };

    addStaffMutation(payload, {
      onSuccess: () => {
        toast.success("Staff member added successfully");
        setIsDialogOpen(false);
        reset();
      },
      onError: (error: unknown) => {
        const message = getApiErrorMessage(error, "Failed to add staff member");
        toast.error(message);
      },
    });
  };

  const onEditSubmit = (data: Partial<IUser>) => {
    if (!selectedStaff) return;

    const payload = {
      userId: selectedStaff.id,
      first_name: data.first_name,
      last_name: data.last_name,
      middle_name: data.middle_name || "",
      phone_number: data.phone_number,
      role: data.role,
      gender: data.gender,
    };

    updateStaffMutation(payload, {
      onSuccess: () => {
        toast.success("Staff member updated successfully");
        setIsEditModalOpen(false);
        setSelectedStaff(null);
      },
      onError: (error: unknown) => {
        const message = getApiErrorMessage(
          error,
          "Failed to update staff member",
        );
        toast.error(message);
      },
    });
  };

  const handleDelete = async () => {
    if (!selectedStaff) return;
    setIsDeleting(true);

    deleteStaffMutation(selectedStaff.id, {
      onSuccess: () => {
        toast.success("Staff member deleted successfully");
        setIsDeleteModalOpen(false);
        setSelectedStaff(null);
        setIsDeleting(false);
      },
      onError: (error: unknown) => {
        setIsDeleting(false);
        const message = getApiErrorMessage(
          error,
          "Failed to delete staff member",
        );
        toast.error(message);
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Staff & Vault Management
          </h1>
          <p className="text-muted-foreground">
            Manage staff, roles, payroll, and vault operations
          </p>
        </div>
      </div>

      <Tabs defaultValue="staff" className="space-y-6">
        {/* <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="vault">Vault</TabsTrigger>
        </TabsList> */}

        {/* Staff Management Tab */}
        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Staff Members</CardTitle>
                  <CardDescription>
                    Manage staff and their commissions
                  </CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="cursor-pointer">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Staff
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <DialogHeader>
                        <DialogTitle>Add New Staff Member</DialogTitle>
                        <DialogDescription>
                          Enter staff member details
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name</Label>
                          <Input
                            id="first_name"
                            placeholder="John"
                            {...register("first_name")}
                          />
                          {errors.first_name && (
                            <p className="text-xs text-destructive">
                              {errors.first_name.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input
                            id="last_name"
                            placeholder="Doe"
                            {...register("last_name")}
                          />
                          {errors.last_name && (
                            <p className="text-xs text-destructive">
                              {errors.last_name.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="middle_name">Middle Name</Label>
                          <Input
                            id="middle_name"
                            placeholder="Anne"
                            {...register("middle_name")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@platpay.com"
                            {...register("email")}
                          />
                          {errors.email && (
                            <p className="text-xs text-destructive">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone_number">Phone Number</Label>
                          <Input
                            id="phone_number"
                            placeholder="+234 800 000 0000"
                            {...register("phone_number")}
                          />
                          {errors.phone_number && (
                            <p className="text-xs text-destructive">
                              {errors.phone_number.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register("password")}
                          />
                          {errors.password && (
                            <p className="text-xs text-destructive">
                              {errors.password.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger id="role">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {staffRoles.map(({ value, label }) => (
                                    <SelectItem key={value} value={value}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.role && (
                            <p className="text-xs text-destructive">
                              {errors.role.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger id="gender">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="MALE">Male</SelectItem>
                                  <SelectItem value="FEMALE">Female</SelectItem>
                                  <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.gender && (
                            <p className="text-xs text-destructive">
                              {errors.gender.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                          {isAddingStaff ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Adding Staff...
                            </>
                          ) : (
                            "Add Staff Member"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search staff..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={selectedRole}
                  onValueChange={(val) => {
                    setSelectedRole(val);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {staffRoles.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Loading staff members...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : isError ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="h-24 text-center text-destructive"
                        >
                          Error loading staff members. Please try again.
                        </TableCell>
                      </TableRow>
                    ) : staffMembers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No staff members found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      (staffMembers as IUser[]).map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {staff.first_name} {staff.last_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {staff.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {staff.role.replace("_", " ").toLowerCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                staff.status.toLowerCase() === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {staff.status.toLowerCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="View details"
                                onClick={() => {
                                  setSelectedStaff(staff);
                                  setIsViewModalOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Edit staff"
                                onClick={() => {
                                  setSelectedStaff(staff);
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Delete staff"
                                onClick={() => {
                                  setSelectedStaff(staff);
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={meta?.pagination?.total_pages || 0}
                  onPageChange={setCurrentPage}
                  isLoading={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & Permissions Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Roles</CardTitle>
                    <CardDescription>Manage user roles</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Shield className="mr-2 h-4 w-4" />
                        Add Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Role</DialogTitle>
                        <DialogDescription>
                          Define a new user role
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="roleName">Role Name</Label>
                          <Input
                            id="roleName"
                            placeholder="e.g., Branch Manager"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="roleDesc">Description</Label>
                          <Input id="roleDesc" placeholder="Role description" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() =>
                            toast.success("Role created successfully")
                          }
                        >
                          Create Role
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{role.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {role.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {role.users} users assigned
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Permissions Matrix</CardTitle>
                <CardDescription>Configure role permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-2 text-sm font-medium pb-2 border-b">
                    <div>Module</div>
                    <div className="text-center">View</div>
                    <div className="text-center">Create</div>
                    <div className="text-center">Edit</div>
                    <div className="text-center">Delete</div>
                  </div>
                  {permissions.map((perm, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 gap-2 items-center"
                    >
                      <div className="text-sm font-medium">{perm.module}</div>
                      <div className="flex justify-center">
                        <Checkbox checked={perm.view} />
                      </div>
                      <div className="flex justify-center">
                        <Checkbox checked={perm.create} />
                      </div>
                      <div className="flex justify-center">
                        <Checkbox checked={perm.edit} />
                      </div>
                      <div className="flex justify-center">
                        <Checkbox checked={perm.delete} />
                      </div>
                    </div>
                  ))}
                  <div className="pt-4">
                    <Button className="w-full">Save Permissions</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payroll Management</CardTitle>
                  <CardDescription>
                    Process and track staff payroll
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Process Payroll
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Process Monthly Payroll</DialogTitle>
                        <DialogDescription>
                          Select month and generate payroll
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="month">Month</Label>
                          <Select>
                            <SelectTrigger id="month">
                              <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="jan">January 2025</SelectItem>
                              <SelectItem value="feb">February 2025</SelectItem>
                              <SelectItem value="mar">March 2025</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() =>
                            toast.success("Payroll processed successfully")
                          }
                        >
                          Process Payroll
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Basic Salary</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.staff}
                        </TableCell>
                        <TableCell>{record.month}</TableCell>
                        <TableCell>
                          ₦{record.basicSalary.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ₦{record.commission.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ₦{record.deductions.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          ₦{record.netPay.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              record.status === "paid" ? "default" : "secondary"
                            }
                          >
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                            {record.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  toast.success(
                                    "Payment processed successfully",
                                  )
                                }
                              >
                                Pay Now
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payroll Logs</CardTitle>
              <CardDescription>View payroll processing history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        January 2025 Payroll Processed
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Processed on 2025-01-25 at 10:30 AM
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Completed</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        December 2024 Payroll Processed
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Processed on 2024-12-25 at 09:15 AM
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vault Tab */}
        <TabsContent value="vault" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Vault Management</CardTitle>
                  <CardDescription>Monitor and manage vaults</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Wallet className="mr-2 h-4 w-4" />
                      Add Vault
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Vault</DialogTitle>
                      <DialogDescription>Set up a new vault</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="vaultName">Vault Name</Label>
                        <Input id="vaultName" placeholder="Vault C" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vaultBranch">Branch</Label>
                        <Select>
                          <SelectTrigger id="vaultBranch">
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lagos">Lagos Main</SelectItem>
                            <SelectItem value="abuja">Abuja Center</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignStaff">Assign to Staff</Label>
                        <Select>
                          <SelectTrigger id="assignStaff">
                            <SelectValue placeholder="Select staff" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="john">John Doe</SelectItem>
                            <SelectItem value="jane">Jane Smith</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="initialBalance">
                          Initial Balance (₦)
                        </Label>
                        <Input
                          id="initialBalance"
                          type="number"
                          placeholder="1000000"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() =>
                          toast.success("Vault created successfully")
                        }
                      >
                        Create Vault
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {vaults.map((vault) => (
                  <div key={vault.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <Wallet className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium">{vault.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {vault.branch}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          vault.status === "active" ? "default" : "secondary"
                        }
                      >
                        {vault.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Balance</p>
                        <p className="text-lg font-bold">
                          ₦{vault.balance.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Assigned To
                        </p>
                        <p className="text-sm font-medium">
                          {vault.assignedTo}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Last Updated
                        </p>
                        <p className="text-sm">{vault.lastUpdated}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Lock className="mr-2 h-4 w-4" />
                        Lock
                      </Button>
                      <Button variant="outline" size="sm">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Adjust Balance
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View Logs
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Staff Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Staff Details</DialogTitle>
            <DialogDescription>
              Viewing information for {selectedStaff?.first_name}{" "}
              {selectedStaff?.last_name}
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">First Name</Label>
                  <p className="font-medium">{selectedStaff.first_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Name</Label>
                  <p className="font-medium">{selectedStaff.last_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedStaff.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{selectedStaff.phone_number}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Role</Label>
                  <p className="font-medium capitalize">
                    {selectedStaff.role?.replace("_", " ").toLowerCase()}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Gender</Label>
                  <p className="font-medium capitalize">
                    {selectedStaff.gender?.toLowerCase()}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge
                    variant={
                      selectedStaff.status?.toLowerCase() === "active"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {selectedStaff.status?.toLowerCase()}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={editForm.handleSubmit(onEditSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
              <DialogDescription>
                Update details for {selectedStaff?.first_name}{" "}
                {selectedStaff?.last_name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit_first_name">First Name</Label>
                <Input
                  id="edit_first_name"
                  placeholder="John"
                  {...editForm.register("first_name")}
                />
                {editForm.formState.errors.first_name && (
                  <p className="text-xs text-destructive">
                    {String(editForm.formState.errors.first_name.message)}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_last_name">Last Name</Label>
                <Input
                  id="edit_last_name"
                  placeholder="Doe"
                  {...editForm.register("last_name")}
                />
                {editForm.formState.errors.last_name && (
                  <p className="text-xs text-destructive">
                    {String(editForm.formState.errors.last_name.message)}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_middle_name">Middle Name</Label>
                <Input
                  id="edit_middle_name"
                  placeholder="Anne"
                  {...editForm.register("middle_name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_phone_number">Phone Number</Label>
                <Input
                  id="edit_phone_number"
                  placeholder="+234 800 000 0000"
                  {...editForm.register("phone_number")}
                />
                {editForm.formState.errors.phone_number && (
                  <p className="text-xs text-destructive">
                    {String(editForm.formState.errors.phone_number.message)}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_role">Role</Label>
                <Controller
                  name="role"
                  control={editForm.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="edit_role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {staffRoles.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {editForm.formState.errors.role && (
                  <p className="text-xs text-destructive">
                    {String(editForm.formState.errors.role.message)}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_gender">Gender</Label>
                <Controller
                  name="gender"
                  control={editForm.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="edit_gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {editForm.formState.errors.gender && (
                  <p className="text-xs text-destructive">
                    {String(editForm.formState.errors.gender.message)}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editForm.formState.isSubmitting}>
                {editForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Staff...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Staff Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Staff Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedStaff?.first_name}{" "}
              {selectedStaff?.last_name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Staff"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
