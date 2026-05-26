import { requireSession } from "@/lib/auth";
import { AddForm } from "./add-form";

export const metadata = { title: "Add an idea · Summer 2026" };

export default async function AddPage() {
  const session = await requireSession();
  return (
    <div className="container-prose py-6 md:py-10 max-w-2xl space-y-6">
      <header className="space-y-1">
        <p className="text-canyon text-xs font-medium uppercase tracking-widest">New idea</p>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold">Add something to do</h1>
        <p className="text-ink-muted text-pretty">It shows up on the Ideas board right away. You can pin it to a day later.</p>
      </header>
      <AddForm myProfileId={session.me.id} myName={session.me.name} />
    </div>
  );
}
