"use client";

import { useState } from "react";
import InsurerLayout from "@/components/layout/InsurerLayout";
import { getReportData } from "@/lib/actions/reportActions";
import { toast } from "react-hot-toast";
import { 
  DocumentArrowDownIcon, 
  FunnelIcon,
  CalendarDaysIcon,
  ChartPieIcon
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

      // Generate CSV
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
      <div className="space-y-10 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gray-200">
            <DocumentArrowDownIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">DATA EXPORT ENGINE</h1>
          <p className="text-gray-500 mt-2 font-medium">Generate comprehensive CSV reports for auditing and financial review.</p>
        </div>

        <div className="card border-none shadow-2xl shadow-gray-200/50 p-10 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <FunnelIcon className="h-3 w-3" /> Adjudication Status
              </label>
              <select 
                className="input py-3"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <CalendarDaysIcon className="h-3 w-3" /> Time Period
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  className="input py-3" 
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                />
                <span className="text-gray-300 font-bold px-2">to</span>
                <input 
                  type="date" 
                  className="input py-3" 
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-50">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-gray-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl shadow-gray-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isExporting ? (
                <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ChartPieIcon className="h-6 w-6" />
                  GENERATE AGGREGATED CSV
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6 italic">
              Data is aggregated in real-time from your organization's secure workspace.
            </p>
          </div>
        </div>
      </div>
    </InsurerLayout>
  );
}
