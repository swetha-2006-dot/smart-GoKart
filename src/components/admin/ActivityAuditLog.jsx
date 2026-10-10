import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Scan, 
  CreditCard, 
  Info, 
  Search, 
  Download, 
  Trash2, 
  Filter,
  Radio
} from 'lucide-react';
import { soundFX } from '../../utils/audio';

export default function ActivityAuditLog({ logs, onClearLogs }) {
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter((log) => {
    const matchesType = filterType === 'ALL' || log.type === filterType;
    const matchesSearch = 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.trolleyId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getBadgeStyle = (type, severity) => {
    switch (type) {
      case 'ALERT':
        return 'bg-rose-100 text-rose-700 border-rose-300';
      case 'SCAN':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'CHECKOUT':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'ALERT':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />;
      case 'SCAN':
        return <Scan className="w-3.5 h-3.5 text-emerald-600" />;
      case 'CHECKOUT':
        return <CreditCard className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Info className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const handleExport = () => {
    soundFX.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gokart_audit_log_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-slate-200/80 transition-all">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-slate-900 text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Live Security & Activity Audit Log
              </h2>
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Live Feed</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Cryptographic audit trail of load cell deviations and checkout events
            </p>
          </div>
        </div>

        {/* Right actions: Export & Clear */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            onClick={handleExport}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition flex items-center space-x-1"
            title="Export JSON audit trail"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              onClearLogs();
            }}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold text-slate-400 transition flex items-center space-x-1"
            title="Clear logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        
        {/* Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'ALERT', 'SCAN', 'CHECKOUT', 'SYSTEM'].map((type) => (
            <button
              key={type}
              onClick={() => {
                soundFX.playClick();
                setFilterType(type);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition shrink-0 ${
                filterType === type
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type === 'ALL' ? 'All Events' : type}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-60">
          <input
            type="text"
            placeholder="Search logs or Trolley #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00838F]"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
        </div>

      </div>

      {/* Log Feed Table */}
      <div className="overflow-x-auto max-h-[360px] overflow-y-auto rounded-2xl border border-slate-200/80 mt-1">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10 backdrop-blur-xs">
            <tr>
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Trolley</th>
              <th className="py-2.5 px-3">Event Type</th>
              <th className="py-2.5 px-3">Message & Telemetry Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                  No matching log entries found
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr 
                  key={log.id} 
                  className={`hover:bg-slate-50/80 transition-colors ${
                    log.type === 'ALERT' ? 'bg-rose-50/30' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-bold text-slate-800">
                    {log.trolleyId}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(log.type, log.severity)}`}>
                      {getIcon(log.type)}
                      <span>{log.type}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">
                    <span className={log.type === 'ALERT' ? 'font-semibold text-rose-700' : ''}>
                      {log.message}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
