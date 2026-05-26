import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Sign in · Summer 2026 Road Trip" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");
  const { next } = await searchParams;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="font-serif text-canyon text-sm tracking-[0.2em] uppercase mb-2">Summer 2026</p>
          <h1 className="font-serif text-4xl font-semibold text-balance">Glacier · Yellowstone · Tetons</h1>
          <p className="mt-3 text-ink-muted text-pretty">Aug 7 – Sep 24. Enter your email to open the trip planner.</p>
        </div>
        <Suspense fallback={null}>
          <LoginForm next={next} />
        </Suspense>
      </div>
    </main>
  );
}
