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
  .max(15),
  location: z
  .string()
  .min(2, {message: "Please enter a valid location."}),
  role: z
  .enum(["admin", "user"])
})

const EditUser = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        username: "john doe",
        email: "john.doe@example.com",
        phone: "09123456789",
        location: "Manila, Philippines",
        role: "admin",
        },
    });
    
    return (
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="mb-4">Edit User</SheetTitle>
                    <SheetDescription asChild>
                        <Form {...form}>
                            <form className="space-y-8 ">
                                <FormField control={form.control} name="username" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="email" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Only Admin can see your Email.
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
                                             Only Admin can see your phone number.
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
                                            This is your public location.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="role" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <FormControl>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem value="user">User</SelectItem>

                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            Only verified users can be an Admin.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </form>
                        </Form>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
    )
}

export default EditUser