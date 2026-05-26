import { requireSession } from "@/lib/auth";
import { RouteClient } from "./route-client";

export const metadata = { title: "Route · Summer 2026 Road Trip" };

export default async function RoutePage() {
  await requireSession();
  return <RouteClient />;
}
