"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ next }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: process.env.NEXT_PUBLIC_SHARED_LOGIN_PASSWORD ?? "",
    });
    setPending(false);
    if (error) {
      toast.error("Couldn't sign in with that email. Double-check the spelling, or ask Brian to add you.");
      return;
    }
    router.push(next || "/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="bg-paper border border-edge rounded-lg p-6 shadow-card space-y-4">
      <div>
        <Label htmlFor="email" className="mb-2 block">Your email</Label>
        <Input id="email" type="email" inputMode="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        {pending ? "Opening…" : "Open the planner"}
      </Button>
      <p className="text-xs text-ink-soft text-center">No password needed — just your email. Bookmark the page and you&rsquo;ll stay signed in.</p>
    </form>
  );
}
