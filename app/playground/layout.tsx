import { notFound } from "next/navigation";

/** The component playground is a developer tool. It doesn't exist in production. */
export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") notFound();
  return children;
}
