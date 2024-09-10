import Link from "next/link";
import { Button } from "@/components/ui/button"; // Ensure you have Shadcn's Button component

export default function NotFound() {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Link href="/" passHref>
            <Button variant="primary" className="px-4 py-2">
              Go back home
            </Button>
          </Link>
          {/* <Link href="/contact" passHref>
            <Button variant="outline" className="px-4 py-2">
              Contact support <span aria-hidden="true">&rarr;</span>
            </Button>
          </Link> */}
        </div>
      </div>
    </main>
  );
}
