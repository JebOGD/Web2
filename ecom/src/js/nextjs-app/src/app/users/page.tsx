"use client";
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AdminEditUser from "@/components/admin-edit-user";
import { User, UsersResponse } from "@/types";
import { useApi } from "@/hooks/use-api";
import { API_ENDPOINTS, USER_ROLES, PAGINATION } from "@/constants";

const UsersPage = () => {
  const { user: currentUser, loading: authLoading } = useCurrentUser();
  const { execute: fetchUsersApi, data: usersData, loading: usersLoading, error: usersError } = useApi<UsersResponse>();
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    pages: number;
  }>({
    page: PAGINATION.DEFAULT_PAGE,
    limit: PAGINATION.DEFAULT_LIMIT,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    role: "",
    search: "",
  });
  const [editUser, setEditUser] = useState<{ username: string; isOpen: boolean }>({
    username: "",
    isOpen: false,
  });

  useEffect(() => {
    if (authLoading || !currentUser) return;

    if (currentUser.role !== USER_ROLES.ADMIN) {
      return;
    }

    fetchUsers();
  }, [currentUser, authLoading, pagination.page, filters]);

  const fetchUsers = async () => {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(filters.role && filters.role !== "all" && { role: filters.role }),
    });

    await fetchUsersApi(`${API_ENDPOINTS.USERS}?${params}`);
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (authLoading || usersLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (usersError || !currentUser) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        {usersError || "Authentication required"}
      </div>
    );
  }

  if (currentUser.role !== USER_ROLES.ADMIN) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        Admin access required
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users Management</h1>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search users..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="max-w-sm"
        />
        <Select value={filters.role} onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value={USER_ROLES.ADMIN}>{USER_ROLES.ADMIN}</SelectItem>
            <SelectItem value={USER_ROLES.USER}>{USER_ROLES.USER}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersData?.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <a href={`/users/${user.username}`} className="text-blue-600 hover:underline">
                    {user.username}
                  </a>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || "-"}</TableCell>
                <TableCell>{user.location || "-"}</TableCell>
                <TableCell>
                  <Badge variant={user.role === USER_ROLES.ADMIN ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/users/${user.username}`}>View</a>
                    </Button>
                    <Sheet open={editUser.isOpen && editUser.username === user.username} onOpenChange={(open) => setEditUser(prev => ({ ...prev, isOpen: open }))}>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditUser({ username: user.username, isOpen: true })}>
                          Edit
                        </Button>
                      </SheetTrigger>
                      <AdminEditUser 
                        userId={user.id}
                        username={editUser.username}
                        isOpen={editUser.isOpen}
                        onClose={() => setEditUser(prev => ({ ...prev, isOpen: false }))}
                        initialData={usersData?.users.find(u => u.username === editUser.username)}
                      />
                    </Sheet>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default UsersPage;