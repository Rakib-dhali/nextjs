import { Metadata } from "next";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "reel.up — Dashboard",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
