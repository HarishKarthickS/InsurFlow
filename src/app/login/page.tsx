"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  ShieldCheckIcon,
  ArrowRightIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for NextAuth error codes in URL
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

    // Basic Validation
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
        // NextAuth v5 usually returns CredentialsSignin
        setErrorMsg("Access Denied: Invalid email or security key.");
        toast.error("Invalid credentials");
      } else {
        toast.success("Identity verified. Entering workspace...");
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
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 font-sans">
      <div className="max-w-md w-full">
        {/* Brand Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-xl shadow-primary/30 mb-4 transform hover:rotate-12 transition-transform duration-300">
            <span className="text-white text-3xl font-black italic">I</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">InsurFlow <span className="text-primary text-xl align-top">B2B</span></h1>
          <p className="text-gray-400 font-medium mt-2 tracking-tight">Enterprise Claims Adjudication</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-gray-100 p-10 lg:p-12 transition-all duration-300">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Workspace Access</h2>
            <p className="text-sm text-gray-400 mt-1">Sign in to your secure insurance dashboard</p>
          </div>

          {/* Validation Error Message */}
          {errorMsg && (
            <div className="mb-6 flex items-start gap-3 bg-danger/5 border border-danger/20 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
              <ExclamationCircleIcon className="h-5 w-5 text-danger shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-danger leading-relaxed">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Corporate Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors">
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  className={`w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-300 ${errorMsg.includes('email') ? 'bg-danger/5 ring-1 ring-danger/20' : ''}`}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if(errorMsg) setErrorMsg(""); }}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Security Key</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors">
                  <LockClosedIcon className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  className={`w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-300 ${errorMsg.includes('password') || errorMsg.includes('key') ? 'bg-danger/5 ring-1 ring-danger/20' : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if(errorMsg) setErrorMsg(""); }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              {loading ? (
                <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Verify Identity
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-400 font-medium">
              Need workspace credentials?{" "}
              <Link href="/register" className="text-primary font-black hover:underline underline-offset-4">
                Initialize Workspace
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials Footer */}
        <div className="mt-8 bg-white/50 backdrop-blur-sm border border-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheckIcon className="h-4 w-4 text-success" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Authorized Demo Access</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => { setEmail('admin@insurflow.com'); setPassword('password'); setErrorMsg(""); }}
              className="text-left space-y-1 hover:bg-white/50 p-2 rounded-lg transition-colors border border-transparent hover:border-primary/10"
            >
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">System Admin</p>
              <p className="text-xs font-bold text-gray-600">admin@insurflow.com</p>
            </button>
            <button 
              onClick={() => { setEmail('adjuster@insurflow.com'); setPassword('password'); setErrorMsg(""); }}
              className="text-left space-y-1 hover:bg-white/50 p-2 rounded-lg transition-colors border border-transparent hover:border-primary/10"
            >
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">Adjuster Pool</p>
              <p className="text-xs font-bold text-gray-600">adjuster@insurflow.com</p>
            </button>
          </div>
          <p className="mt-4 text-[10px] text-center text-gray-300 font-bold italic">Global Security Key: password</p>
        </div>
      </div>
    </div>
  );
}
