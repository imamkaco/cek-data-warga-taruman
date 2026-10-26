import React from 'react';
import { Users, CheckCircle, Clock, UserCheck, ShieldAlert } from 'lucide-react';
import { WargaStats } from '../types/warga';

interface StatsBannerProps {
  stats: WargaStats | null;
  filteredCount: number;
  isFiltered: boolean;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  stats,
  filteredCount,
  isFiltered,
}) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mb-6">
      {/* Total Card */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200/90 shadow-xs flex items-center gap-3">
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
          <Users className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider truncate">
            {isFiltered ? 'Hasil Filter' : 'Total Warga'}
          </p>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900 leading-tight">
              {isFiltered ? filteredCount : stats.total}
            </h3>
            {isFiltered && (
              <span className="text-[11px] text-slate-400">/ {stats.total}</span>
            )}
          </div>
        </div>
      </div>

      {/* Valid Card */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200/90 shadow-xs flex items-center gap-3">
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider truncate">
            Data Valid
          </p>
          <h3 className="text-lg sm:text-2xl font-bold text-teal-800 leading-tight">
            {stats.valid}
          </h3>
        </div>
      </div>

      {/* Belum Valid Card */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200/90 shadow-xs flex items-center gap-3">
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider truncate">
            Belum Valid
          </p>
          <h3 className="text-lg sm:text-2xl font-bold text-amber-800 leading-tight">
            {stats.belumValid}
          </h3>
        </div>
      </div>

      {/* Gender Balance Card */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200/90 shadow-xs flex items-center gap-3">
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
          <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider truncate">
            Laki / Perempuan
          </p>
          <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-tight">
            {stats.lakiLaki} <span className="text-slate-400 font-normal">/</span> {stats.perempuan}
          </h3>
        </div>
      </div>
    </div>
  );
};
