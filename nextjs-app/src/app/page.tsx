"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppBarChart from "@/components/app-bar-chart";
import AppAreaChart from "@/components/app-area-chart";
import AppPieChart from "@/components/app-pie-chart";
import CardList from "@/components/card-list";
import ToDoList from "@/components/to-do-list";
import { Button } from "@/components/ui/button";

const Homepage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.log('Not authenticated');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-3xl font-bold">Welcome to NextJS App</h1>
        <p className="text-muted-foreground">Please login or register to continue</p>
        <div className="space-x-4">
          <Button onClick={() => router.push('/auth/login')}>Login</Button>
          <Button variant="outline" onClick={() => router.push('/auth/register')}>Register</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome back, {user.username}!</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2"><AppBarChart /></div>
        <div className="bg-primary-foreground p-4 rounded-lg"><CardList title="Latest Transactions" /></div>
        <div className="bg-primary-foreground p-4 rounded-lg"><AppPieChart /></div>
        <div className="bg-primary-foreground p-4 rounded-lg"><ToDoList /></div>
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2"><AppAreaChart /></div>
        <div className="bg-primary-foreground p-4 rounded-lg"><CardList title="Popular Content" /></div>
      </div>
    </div>
  );
}

export default Homepage;