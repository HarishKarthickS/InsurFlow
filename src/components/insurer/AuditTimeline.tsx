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
      <div className="p-6 text-center text-[#4a5f69] bg-[#e8eef1] border border-dashed border-[#8fa0ab] text-sm">
        No audit events on this file.
      </div>
    );
  }

  const getIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon className="h-4 w-4 text-success" />;
      case 'rejected': return <XCircleIcon className="h-4 w-4 text-danger" />;
      case 'flagged': return <FlagIcon className="h-4 w-4 text-warning" />;
      default: return <ArrowPathIcon className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="relative pl-7 space-y-5 before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-px before:bg-[#8fa0ab]">
      {events.map((event, idx) => (
        <div key={idx} className="relative">
          <div className="absolute -left-[25px] p-0.5 bg-folder border border-[#8fa0ab]">
            {getIcon(event.toStatus)}
          </div>
          <div>
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-medium capitalize">
                {event.action || 'Status Change'}
              </h4>
              <time className="file-id">
                {format(new Date(event.timestamp), "MMM d, h:mm a")}
              </time>
            </div>
            <p className="text-sm text-[#4a5f69] mt-0.5">
              {event.fromStatus && (
                <span>
                  {event.fromStatus} →{' '}
                </span>
              )}
              <span className="text-foreground capitalize">{event.toStatus || 'Updated'}</span>
            </p>
            {event.note && (
              <div className="mt-2 p-2 bg-[#e8eef1] text-sm border-l-2 border-[#8fa0ab]">
                “{event.note}”
              </div>
            )}
            <div className="mt-1 flex items-center gap-1 section-kicker">
              <UserIcon className="h-3 w-3" />
              Adjuster
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
