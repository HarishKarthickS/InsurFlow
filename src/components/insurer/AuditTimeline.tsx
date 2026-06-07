"use client";

import { format } from "date-fns";
import { 
  CheckCircleIcon, 
  ArrowPathIcon, 
  XCircleIcon,
  FlagIcon,
  UserIcon
} from "@heroicons/react/24/outline";

export default function AuditTimeline({ events }: { events: any[] }) {
  if (!events || events.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        No audit events recorded yet.
      </div>
    );
  }

  const getIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon className="h-5 w-5 text-success" />;
      case 'rejected': return <XCircleIcon className="h-5 w-5 text-danger" />;
      case 'flagged': return <FlagIcon className="h-5 w-5 text-warning" />;
      default: return <ArrowPathIcon className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
      {events.map((event, idx) => (
        <div key={idx} className="relative">
          <div className="absolute -left-[29px] p-1 bg-white border border-gray-100 rounded-full shadow-sm">
            {getIcon(event.toStatus)}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 capitalize">
                {event.action || 'Status Change'}
              </h4>
              <time className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {format(new Date(event.timestamp), "MMM d, h:mm a")}
              </time>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {event.fromStatus && (
                <span className="font-medium text-gray-400">
                  {event.fromStatus} &rarr;{' '}
                </span>
              )}
              <span className="font-bold text-gray-800 capitalize">{event.toStatus || 'Updated'}</span>
            </p>
            {event.note && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 italic border-l-2 border-gray-200">
                &ldquo;{event.note}&rdquo;
              </div>
            )}
            <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              <UserIcon className="h-3 w-3" />
              Adjuster Action
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
