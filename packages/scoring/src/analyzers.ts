export interface AnalyzerEntry {
  id: string;
  description: string;
}

export const ANALYZERS: AnalyzerEntry[] = [
  {
    id: "vercel",
    description: "Checks Vercel CLI patterns and platform defaults.",
  },
  {
    id: "supabase",
    description: "Checks Supabase CLI behavior and SQL migration predictability.",
  },
  {
    id: "docker",
    description: "Checks Docker and Compose command ergonomics and output flags.",
  },
  {
    id: "skills.sh",
    description: "Checks skills.sh style shell CLIs for deterministic automation.",
  },
  {
    id: "terraform",
    description: "Checks Terraform command conventions and plan/apply safety flags.",
  },
];
