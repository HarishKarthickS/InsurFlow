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
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-[#4a5f69]">
        <ChatBubbleLeftRightIcon className="h-4 w-4" />
        <h3 className="section-kicker">Jacket notes</h3>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {initialNotes.length === 0 ? (
          <p className="text-sm text-[#4a5f69] py-3">No internal notes on this file.</p>
        ) : (
          initialNotes.map((n, i) => (
            <div key={i} className="bg-[#e8eef1] p-3 border border-[#c5d0d8]">
              <div className="flex items-center justify-between mb-1">
                <span className="section-kicker text-primary">Adjuster</span>
                <time className="file-id">{format(new Date(n.createdAt), 'MMM d, p')}</time>
              </div>
              <p className="text-sm leading-relaxed">{n.note}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a jacket note…"
          className="input pr-11 py-2 min-h-[88px] resize-none"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !note.trim()}
          className="absolute right-2 bottom-2 p-1.5 btn btn-primary disabled:opacity-50"
        >
          <PaperAirplaneIcon className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
