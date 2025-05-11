import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";

export default function AuthButton() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

const handleLogin = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account"
  });

  try {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  } catch (error) {
    console.error("Login error:", error.message);
  }
};


  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // 👈 Redirect after logout
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <div className="flex justify-end p-4">
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Hello, {user.displayName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login with Google
        </button>
      )}
    </div>
  );
}
