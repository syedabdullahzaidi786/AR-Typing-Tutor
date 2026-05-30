import { auth } from "@/lib/auth";
import TestClient from "./TestClient";
import { getTestConfig } from "@/actions/admin";

export default async function TestPage() {
  const session = await auth();
  const config = await getTestConfig();
  return <TestClient session={session} config={config} />;
}
