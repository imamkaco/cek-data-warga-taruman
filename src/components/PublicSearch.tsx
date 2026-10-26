import React from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';
import { WargaFilter, WargaStats } from '../types/warga';

interface PublicSearchProps {
  filter: WargaFilter;
  onChangeFilter: (newFilter: Partial<WargaFilter>) => void;
  onResetFilter: () => void;
  stats: WargaStats | null;
}

export const PublicSearch: React.FC<PublicSearchProps> = ({
  filter,
  onChangeFilter,
  onResetFilter,
  stats,
}) => {
  const isFiltered = Boolean(
    filter.q ||
    (filter.rt && filter.rt !== 'ALL') ||
    (filter.rw && filter.rw !== 'ALL') ||
    (filter.valid && filter.valid !== 'ALL') ||
    (filter.kelamin && filter.kelamin !== 'ALL')
  );

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs mb-6 space-y-3.5">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-emerald-700" />
        </div>
        <input
          type="text"
          value={filter.q}
          onChange={(e) => onChangeFilter({ q: e.target.value })}
          placeholder="Cari berdasarkan nama warga, dusun, alamat, RT, RW, tempat lahir..."
          className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-slate-900 placeholder:text-slate-400"
        />
        {filter.q && (
          <button
            onClick={() => onChangeFilter({ q: '' })}
            aria-label="Bersihkan pencarian"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <div className="flex items-center text-slate-500 font-medium mr-1">
          <Filter className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          <span>Filter:</span>
        </div>

        {/* Filter RT */}
        <select
          value={filter.rt}
          onChange={(e) => onChangeFilter({ rt: e.target.value })}
          aria-label="Filter berdasarkan RT"
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        >
          <option value="ALL">Semua RT</option>
          {stats?.rtList && stats.rtList.length > 0 ? (
            stats.rtList.map((rt) => (
              <option key={rt} value={rt}>
                RT {rt}
              </option>
            ))
          ) : (
            <>
              <option value="01">RT 01</option>
              <option value="02">RT 02</option>
              <option value="03">RT 03</option>
              <option value="04">RT 04</option>
            </>
          )}
        </select>

        {/* Filter RW */}
        <select
          value={filter.rw}
          onChange={(e) => onChangeFilter({ rw: e.target.value })}
          aria-label="Filter berdasarkan RW"
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        >
          <option value="ALL">Semua RW</option>
          {stats?.rwList && stats.rwList.length > 0 ? (
            stats.rwList.map((rw) => (
              <option key={rw} value={rw}>
                RW {rw}
              </option>
            ))
          ) : (
            <>
              <option value="01">RW 01</option>
              <option value="02">RW 02</option>
              <option value="03">RW 03</option>
            </>
          )}
        </select>

        {/* Filter Kelamin */}
        <select
          value={filter.kelamin}
          onChange={(e) => onChangeFilter({ kelamin: e.target.value })}
          aria-label="Filter berdasarkan jenis kelamin"
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        >
          <option value="ALL">Semua Kelamin</option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>

        {/* Filter Validitas */}
        <select
          value={filter.valid}
          onChange={(e) => onChangeFilter({ valid: e.target.value })}
          aria-label="Filter berdasarkan status validasi"
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        >
          <option value="ALL">Semua Status</option>
          <option value="Valid">Valid</option>
          <option value="Belum Valid">Belum Valid</option>
        </select>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            onClick={onResetFilter}
            className="ml-auto inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg font-medium transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filter</span>
          </button>
        )}
      </div>
    </div>
  );
};
