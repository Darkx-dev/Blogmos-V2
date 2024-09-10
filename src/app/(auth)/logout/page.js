"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut({ redirect: false }); // Sign out without redirecting immediately
      router.push("/"); // Redirect to homepage or any other page
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Logout</h1>
          <p className="text-gray-600 mb-4">Are you sure you want to log out?</p>
          <Button
            onClick={handleLogout}
            className="w-full"
            variant="default"
            disabled={loading}
          >
            {loading ? "Logging out..." : "Log out"}
          </Button>
        </div>
      </div>
    </div>
  );
}
