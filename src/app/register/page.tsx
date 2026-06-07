"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerOrganization } from "@/lib/actions/authActions";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { 
  BuildingOfficeIcon, 
  UserCircleIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  SparklesIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await registerOrganization(formData);
      if (result.success) {
        toast.success("Workspace initialized successfully!");
        await signIn("credentials", {
          email: formData.get("email"),
          password,
          callbackUrl: "/insurer/dashboard",
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to initialize workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 py-12 font-sans">
      <div className="max-w-2xl w-full">
        {/* Brand Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl shadow-lg shadow-primary/20 mb-4">
            <span className="text-white text-xl font-black italic">I</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">InsurFlow <span className="text-primary">B2B</span></h1>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar Promo */}
            <div className="md:w-1/3 bg-primary p-10 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <SparklesIcon className="h-10 w-10 mb-6 text-white/40" />
                <h2 className="text-2xl font-bold leading-tight">Build your adjudication engine.</h2>
                <p className="text-indigo-100 text-xs mt-4 font-medium leading-relaxed opacity-80">
                  Join hundreds of insurance providers using InsurFlow to automate their claim workflows.
                </p>
              </div>
              <div className="mt-12 relative z-10">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-indigo-400" />
                  ))}
                </div>
                <p className="text-[10px] font-bold text-indigo-200 mt-3 uppercase tracking-widest">Trusted by Enterprise</p>
              </div>
              
              {/* Decorative Circle */}
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50" />
            </div>

            {/* Form Area */}
            <div className="flex-1 p-10 lg:p-12">
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800">Launch Workspace</h2>
                <p className="text-sm text-gray-400 mt-1">Initialize your secure B2B environment.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] border-b border-gray-50 pb-2">Business Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Company Name</label>
                      <input name="orgName" type="text" className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary/10 transition-all" placeholder="Acme Insurance" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Workspace ID</label>
                      <div className="flex items-center">
                        <input name="orgSlug" type="text" className="w-full bg-gray-50 border-none rounded-l-xl py-3 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary/10 transition-all" placeholder="acme" required />
                        <span className="bg-gray-100 px-3 py-3 text-[10px] text-gray-400 rounded-r-xl font-black border-l border-white">.APP</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] border-b border-gray-50 pb-2">Primary Administrator</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Full Name</label>
                      <input name="name" type="text" className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary/10 transition-all" placeholder="Jane Doe" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Work Email</label>
                      <input name="email" type="email" className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary/10 transition-all" placeholder="jane@company.com" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Password</label>
                      <input name="password" type="password" className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary/10 transition-all" placeholder="••••••••" required minLength={6} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Confirm</label>
                      <input name="confirmPassword" type="password" className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary/10 transition-all" placeholder="••••••••" required />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-xl shadow-gray-200 flex items-center justify-center gap-2 transform hover:scale-[1.01] active:scale-95 transition-all duration-200"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Initialize Workspace
                      <ArrowRightIcon className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 text-center text-sm">
                <p className="text-gray-400 font-medium">
                  Already a member?{" "}
                  <Link href="/login" className="text-primary font-black hover:underline underline-offset-4">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
