// pages/login.js
import AuthButton from "../components/AuthButton";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/dashboard");
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to Smart Career Coach</h1>
      <AuthButton />
    </div>
  );
}
