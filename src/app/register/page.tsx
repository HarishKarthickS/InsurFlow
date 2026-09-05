"use client";

import { useState } from "react";
import Link from "next/link";
import { registerOrganization } from "@/lib/actions/authActions";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

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
        toast.success("Desk registered.");
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
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full">
        <p className="section-kicker">Open a claims desk</p>
        <h1 className="text-3xl mt-1 mb-6">Register workspace</h1>

        <div className="card overflow-visible p-0">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-[38%] bg-rail text-folder p-7">
              <h2 className="text-xl text-folder">Folder the queue, stamp the decision.</h2>
              <p className="text-xs text-[#9aadb8] mt-3 leading-relaxed">
                InsurFlow is a medical-file workstation for adjusters: dense queues, hanging folders, status as ink stamps.
              </p>
            </div>

            <div className="flex-1 p-7">
              <form onSubmit={handleSubmit} className="space-y-5">
                <p className="section-kicker border-b border-[#c5d0d8] pb-1">Carrier</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="section-kicker block mb-1">Company</label>
                    <input name="orgName" type="text" className="input" placeholder="Acme Insurance" required />
                  </div>
                  <div>
                    <label className="section-kicker block mb-1">Workspace ID</label>
                    <div className="flex">
                      <input name="orgSlug" type="text" className="input" placeholder="acme" required />
                    </div>
                  </div>
                </div>

                <p className="section-kicker border-b border-[#c5d0d8] pb-1">Chief adjuster</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="section-kicker block mb-1">Full name</label>
                    <input name="name" type="text" className="input" required />
                  </div>
                  <div>
                    <label className="section-kicker block mb-1">Work email</label>
                    <input name="email" type="email" className="input" required />
                  </div>
                  <div>
                    <label className="section-kicker block mb-1">Password</label>
                    <input name="password" type="password" className="input" required minLength={6} />
                  </div>
                  <div>
                    <label className="section-kicker block mb-1">Confirm</label>
                    <input name="confirmPassword" type="password" className="input" required />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary w-full py-2.5">
                  {loading ? "Filing…" : (
                    <>
                      Open desk
                      <ArrowRightIcon className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-5 text-sm text-[#4a5f69]">
                Already on the floor?{" "}
                <Link href="/login" className="text-primary underline underline-offset-2">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
