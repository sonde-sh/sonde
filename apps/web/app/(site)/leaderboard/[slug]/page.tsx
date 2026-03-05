import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface LeaderboardReportPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LeaderboardReportPage({ params }: LeaderboardReportPageProps) {
  const { slug } = await params;
  redirect(`/sondages/${slug}`);
}
