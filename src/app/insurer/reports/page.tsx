"use client";

import { useState } from "react";
import InsurerLayout from "@/components/layout/InsurerLayout";
import { getReportData } from "@/lib/actions/reportActions";
import { toast } from "react-hot-toast";
import { 
  DocumentArrowDownIcon, 
  FunnelIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";

export default function ReportsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: ""
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await getReportData(filters);
      
      if (data.length === 0) {
        toast.error("No data found for the selected filters");
        return;
      }

      const headers = Object.keys(data[0]).join(',');
      const rows = data.map((row: any) => Object.values(row).join(',')).join('\n');
      const csvContent = "data:text/csv;charset=utf-8," + headers + '\n' + rows;
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `InsurFlow_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Report downloaded successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <InsurerLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <p className="section-kicker">Audit extract</p>
          <h1 className="text-3xl">CSV pull</h1>
          <p className="text-sm text-[#4a5f69] mt-1">Filter the tray and download a file for finance review.</p>
        </div>

        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="section-kicker flex items-center gap-1 mb-1">
                <FunnelIcon className="h-3 w-3" /> Stamp
              </label>
              <select 
                className="input"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All stamps</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>

            <div>
              <label className="section-kicker flex items-center gap-1 mb-1">
                <CalendarDaysIcon className="h-3 w-3" /> Period
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  className="input" 
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                />
                <span className="text-[#8fa0ab] text-xs">to</span>
                <input 
                  type="date" 
                  className="input" 
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn btn-primary w-full py-2.5 disabled:opacity-50"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            {isExporting ? "Building extract…" : "Generate CSV"}
          </button>
        </div>
      </div>
    </InsurerLayout>
  );
}
