import React from 'react';
import { UserPlus, FileSpreadsheet, Upload, Download, Sparkles } from 'lucide-react';

interface AdminControlsProps {
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  onExportExcel: () => void;
  onDownloadTemplate: () => void;
  isExporting: boolean;
  totalFiltered: number;
}

export const AdminControls: React.FC<AdminControlsProps> = ({
  onOpenAddModal,
  onOpenImportModal,
  onExportExcel,
  onDownloadTemplate,
  isExporting,
  totalFiltered,
}) => {
  return (
    <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-4 sm:p-5 text-white shadow-md mb-6 border border-emerald-700/60">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 bg-amber-400/20 text-amber-300 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-sm sm:text-base font-bold">Panel Administrasi Data Warga</h2>
          </div>
          <p className="text-xs text-emerald-200 mt-1">
            Tambah warga baru, kelola status validasi, atau ekspor laporan resmi kependudukan ke format Excel (.xlsx).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Add Citizen */}
          <button
            onClick={onOpenAddModal}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Tambah Warga</span>
          </button>

          {/* Export Excel */}
          <button
            onClick={onExportExcel}
            disabled={isExporting || totalFiltered === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition border border-emerald-400/40 shadow-sm disabled:opacity-50"
            title="Ekspor data saat ini ke Excel .xlsx"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>{isExporting ? 'Mengekspor...' : `Export Excel (${totalFiltered})`}</span>
          </button>

          {/* Import Excel */}
          <button
            onClick={onOpenImportModal}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-700/80 hover:bg-emerald-700 text-emerald-100 rounded-xl text-xs font-medium transition border border-emerald-600"
            title="Import data warga dari file Excel atau CSV"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Import Excel</span>
          </button>

          {/* Download Template */}
          <button
            onClick={onDownloadTemplate}
            className="inline-flex items-center justify-center gap-1 px-2.5 py-2 text-emerald-300 hover:text-white hover:bg-emerald-700/50 rounded-xl text-xs font-medium transition"
            title="Unduh format template Excel untuk data warga"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Template</span>
          </button>
        </div>
      </div>
    </div>
  );
};
