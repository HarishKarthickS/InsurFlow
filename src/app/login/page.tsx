"use client";

import { Suspense, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  EnvelopeIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { DEV_DEMO_PASSWORD } from "@/lib/devDemoPassword";

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <p className="text-sm text-[#4a5f69]">Loading desk access…</p>
    </div>
  );
}

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "CredentialsSignin") {
      setErrorMsg("The email or password you entered is incorrect.");
      toast.error("Authentication failed");
    } else if (error) {
      setErrorMsg("An unexpected authentication error occurred.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (!email.includes("@")) {
      setErrorMsg("Please enter a valid work email.");
      setLoading(false);
      return;
    }

    if (password.length < 4) {
      setErrorMsg("Security keys must be at least 4 characters.");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMsg("Access Denied: Invalid email or security key.");
        toast.error("Invalid credentials");
      } else {
        toast.success("Desk unlocked.");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setErrorMsg("Connection error: Unable to reach authentication server.");
      toast.error("Authentication server unreachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <p className="section-kicker">Adjudicator workstation</p>
          <h1 className="text-4xl text-foreground mt-1">InsurFlow</h1>
          <p className="text-sm text-[#4a5f69] mt-1">Unlock the claims queue with a desk credential.</p>
        </div>

        <div className="card p-7">
          <h2 className="text-xl mb-1">Desk access</h2>
          <p className="text-sm text-[#4a5f69] mb-5">Sign in to review medical files.</p>

          {errorMsg && (
            <div className="mb-4 flex items-start gap-2 border border-danger/40 bg-[#f6ecec] p-3">
              <ExclamationCircleIcon className="h-5 w-5 text-danger shrink-0 mt-0.5" />
              <p className="text-xs text-danger">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="section-kicker block mb-1">Work email</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8fa0ab]" />
                <input
                  type="email"
                  className="input pl-9"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="section-kicker block mb-1">Desk key</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8fa0ab]" />
                <input
                  type="password"
                  className="input pl-9"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-2.5">
              {loading ? "Checking…" : "Open queue"}
            </button>
          </form>

          <p className="mt-5 text-sm text-[#4a5f69]">
            New workspace?{" "}
            <Link href="/register" className="text-primary underline underline-offset-2">
              Register a desk
            </Link>
          </p>
        </div>

        <div className="mt-4 border border-[#8fa0ab] bg-folder/80 p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheckIcon className="h-4 w-4 text-success" />
            <span className="section-kicker">Demo desk badges</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => {
                setEmail("admin@insurflow.com");
                setPassword(DEV_DEMO_PASSWORD);
                setErrorMsg("");
              }}
              className="text-left p-2 border border-[#c5d0d8] hover:bg-white"
            >
              <p className="section-kicker">Chief adjuster</p>
              <p className="text-xs font-mono">admin@insurflow.com</p>
            </button>
            <button
              onClick={() => {
                setEmail("adjuster@insurflow.com");
                setPassword(DEV_DEMO_PASSWORD);
                setErrorMsg("");
              }}
              className="text-left p-2 border border-[#c5d0d8] hover:bg-white"
            >
              <p className="section-kicker">Floor adjuster</p>
              <p className="text-xs font-mono">adjuster@insurflow.com</p>
            </button>
          </div>
          <p className="mt-3 text-[10px] text-center text-[#8fa0ab] font-mono">
            DEV ONLY local password: {DEV_DEMO_PASSWORD}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
