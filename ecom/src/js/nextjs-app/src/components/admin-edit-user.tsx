"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/hooks/use-current-user"

import { User, AdminEditUserProps } from "@/types";

const formSchema = z.object({
  username: z
  .string()
  .min(2,{message: "Username must be at least 2 characters."})
  .max(50),
  email: z
  .string()
  .email({message: "Please enter a valid email address."}),
  phone: z
  .string()
  .min(10, {message: "Please enter a valid phone number."})
  .max(15)
  .optional(),
  location: z
  .string()
  .min(2, {message: "Please enter a valid location."})
  .optional(),
  role: z
  .enum(["Admin", "User"])
  .optional(),
})

const AdminEditUser = ({ userId, username, isOpen, onClose, initialData }: AdminEditUserProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { user: currentUser } = useCurrentUser();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: initialData?.username || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      location: initialData?.location || "",
      role: (initialData?.role as "Admin" | "User") || "User",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        username: initialData.username,
        email: initialData.email,
        phone: initialData.phone || "",
        location: initialData.location || "",
        role: (initialData.role as "Admin" | "User"),
      });
    }
  }, [initialData, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/users/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        alert('User updated successfully');
        
        if (values.username !== username) {
          router.push(`/users/${values.username}`);
        } else {
          onClose();
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    } finally {
      setSubmitting(false);
      window.location.reload();
    }
  };

  const isAdmin = currentUser?.role === 'Admin';
  
  return (
    <SheetContent>
      <SheetTitle>Edit User</SheetTitle>
      <SheetHeader>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Edit User Profile</h2>
        </div>
        <SheetDescription asChild>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField control={form.control} name="username" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is the user's display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="email" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled />
                                        </FormControl>
                                        <FormDescription>
                                            Email cannot be changed.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="phone" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                             User's phone number.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="location" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            User's location.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="role" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Admin">Admin</SelectItem>
                                                    <SelectItem value="User">User</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            User's role in the system.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" disabled={submitting}>
                                        {submitting ? "Saving..." : "Save Changes"}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={onClose}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
    )
}

export default AdminEditUser;
