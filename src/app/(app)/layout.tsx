import { Nav } from "@/components/nav";
import { requireSession } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  return (
    <>
      <Nav me={session.me} />
      <main className="flex-1 pb-24 md:pb-12">{children}</main>
    </>
  );
}
