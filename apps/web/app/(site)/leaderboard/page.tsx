import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function LeaderboardPage() {
  redirect("/sondages");
}

export default LeaderboardPage;
