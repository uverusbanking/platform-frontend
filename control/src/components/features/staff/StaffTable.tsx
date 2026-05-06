"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Loader2, Eye, Edit, Trash2 } from "lucide-react";
import { IUser, UserStatus } from "@/types/user.types";

interface StaffTableProps {
  staffMembers: IUser[];
  isLoading: boolean;
  isError: boolean;
  currentPage: number;
  limit: number;
  meta?: {
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onView: (staff: IUser) => void;
  onEdit: (staff: IUser) => void;
  onDelete: (staff: IUser) => void;
}

export function StaffTable({
  staffMembers,
  isLoading,
  isError,
  currentPage,
  limit,
  meta,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: StaffTableProps) {
  return (
    <div className="space-y-6">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading staff members...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-destructive"
                >
                  Error loading staff members. Please try again.
                </TableCell>
              </TableRow>
            ) : staffMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No staff members found.
                </TableCell>
              </TableRow>
            ) : (
              staffMembers.map((staff) => (
                <TableRow 
                  key={staff.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onView(staff)}
                >
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
                    <StatusBadge
                      status={staff.role
                        .replace("PLATFORM_", "")
                        .replace("_", " ")
                        .toLowerCase()}
                      variant="outline"
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={staff.status.toLowerCase()} />
                  </TableCell>
                  <TableCell>
                    {new Date(staff.created_at).toLocaleDateString("en-CA")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="View details"
                        onClick={() => onView(staff)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit staff"
                        onClick={() => onEdit(staff)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete staff"
                        onClick={() => onDelete(staff)}
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

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * limit + 1} to{" "}
            {Math.min(currentPage * limit, meta.total)} of {meta.total} staff
            members
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="w-8"
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </Button>
                ),
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPageChange(Math.min(meta.totalPages, currentPage + 1))
              }
              disabled={currentPage === meta.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
