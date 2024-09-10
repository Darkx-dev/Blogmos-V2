"use client";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setLoading(false);
    }
  };
  if (session?.user?.isAdmin) {
    return <h1>Already Logged as : {session?.user?.name}</h1>;
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
            Login with{" "}
            <i>
              <img
                src="https://www.google.co.in/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                alt=""
                width={70}
              />
            </i>
          </h1>
          <Button
            onClick={handleSignIn}
            className="w-full"
            variant="default"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </div>
      </div>
    </div>
  );
}
