import { Metadata } from "next";
import LoginClient from "./login-client";

export const metadata: Metadata = {
  title: "reel.up — Sign In",
};

export default function LoginPage() {
  return <LoginClient />;
}
