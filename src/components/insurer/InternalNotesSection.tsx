"use client";

import { useState } from "react";
import { addInternalNote } from "@/lib/actions/adjudicationActions";
import { toast } from "react-hot-toast";
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

export default function InternalNotesSection({ claimId, initialNotes }: { claimId: string, initialNotes: any[] }) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    setIsSubmitting(true);
    try {
      await addInternalNote(claimId, note);
      setNote("");
      toast.success("Note added");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-gray-400">
        <ChatBubbleLeftRightIcon className="h-5 w-5" />
        <h3 className="text-sm font-bold uppercase tracking-widest">Internal Adjudicator Notes</h3>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {initialNotes.length === 0 ? (
          <p className="text-sm text-gray-500 italic py-4">No internal discussion for this claim yet.</p>
        ) : (
          initialNotes.map((n, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-tighter bg-primary/5 px-2 py-0.5 rounded">Adjuster</span>
                <time className="text-[10px] text-gray-400 font-bold">{format(new Date(n.createdAt), 'MMM d, p')}</time>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{n.note}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative mt-6">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add an internal note or observation..."
          className="input pr-12 py-3 min-h-[100px] resize-none"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !note.trim()}
          className="absolute right-3 bottom-3 p-2 bg-primary text-white rounded-lg shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
