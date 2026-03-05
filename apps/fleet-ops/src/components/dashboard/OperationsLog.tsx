import { operationsLog } from "@/lib/data";
import { CheckCircle2, Clock, AlertCircle, FileText, Droplets, Wrench } from "lucide-react";

export function OperationsLog() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#161b22] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-white">Operations Log</h3>
        <button className="text-xs text-blue-400 hover:text-blue-300">View All</button>
      </div>

      <div className="space-y-3">
        {operationsLog.map((log) => (
          <div key={log.id} className="flex items-start gap-3 rounded-lg border border-white/5 bg-[#0d1117] p-3 transition-colors hover:bg-white/5">
            <div className="mt-0.5">
              {log.action.includes("Wash") ? (
                <Droplets className="h-4 w-4 text-blue-400" />
              ) : log.action.includes("Sale") ? (
                <FileText className="h-4 w-4 text-green-400" />
              ) : log.action.includes("Maintenance") ? (
                <Wrench className="h-4 w-4 text-orange-400" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{log.action}</span>
                <span className="text-xs text-gray-500">{log.timestamp}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs text-gray-400">{log.details}</span>
                <span className={`text-xs font-medium ${
                  log.status === 'Success' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {log.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
