/* eslint-disable @next/next/no-img-element */
"use client";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconBrandGoogle } from "@tabler/icons-react";

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
    return (
      <h4 className="text-center">
        Logged as {session?.user?.name}
        <br />
        <Link href="/admin/blogList">
          <Button>Admin Panel</Button>
        </Link>
      </h4>
    );
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <Button
            onClick={handleSignIn}
            className="w-full h-12"
            variant="outline"
            disabled={loading}
          >
            {loading ? (
              "Signing in..."
            ) : (
              <span className="text-lg flex items-center gap-2">
                Signin with google <IconBrandGoogle />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
