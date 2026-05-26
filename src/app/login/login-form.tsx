"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ next, sent: initialSent }: { next?: string; sent: boolean }) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(initialSent);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setPending(true);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: redirectTo, shouldCreateUser: false },
    });
    setPending(false);
    if (error) {
      toast.error(error.message.toLowerCase().includes("signups")
        ? "Hmm — that email isn't on the trip yet. Check the address, or ask Brian to add you."
        : error.message);
      return;
    }
    setSent(true);
    router.replace(`/login?sent=1${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  if (sent) {
    return (
      <div className="bg-paper border border-edge rounded-lg p-6 shadow-card text-center">
        <div className="h-12 w-12 rounded-full bg-pine-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-6 w-6 text-pine" />
        </div>
        <h2 className="font-serif text-2xl font-semibold mb-2">Check your inbox</h2>
        <p className="text-ink-muted text-pretty mb-4">We sent a sign-in link. Open it on this device.</p>
        <Button variant="ghost" size="sm" onClick={() => setSent(false)}>Use a different email</Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="bg-paper border border-edge rounded-lg p-6 shadow-card space-y-4">
      <div>
        <Label htmlFor="email" className="mb-2 block">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        {pending ? "Sending link…" : "Send me a sign-in link"}
      </Button>
    </form>
  );
}
