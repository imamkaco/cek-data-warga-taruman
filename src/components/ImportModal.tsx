import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { Warga } from '../types/warga';
import { parseWargaExcelFile, downloadWargaTemplateExcel } from '../utils/excel';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (items: Partial<Warga>[]) => Promise<void>;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Partial<Warga>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError(null);
    setIsLoading(true);

    try {
      const items = await parseWargaExcelFile(file);
      if (items.length === 0) {
        setError('Tidak ada data valid yang terdeteksi dari file ini. Pastikan kolom nama terisi.');
        setParsedData([]);
      } else {
        setParsedData(items);
      }
    } catch (err: any) {
      setError(`Gagal membaca file: ${err.message || 'Format tidak didukung'}`);
      setParsedData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;
    setIsLoading(true);
    try {
      await onImportSuccess(parsedData);
      setSelectedFile(null);
      setParsedData([]);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data import ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center border border-emerald-600">
              <Upload className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">Import Data Warga dari Excel</h3>
              <p className="text-xs text-emerald-200">Format .xlsx atau .csv</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal import"
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-700">
          <p className="leading-relaxed">
            Anda dapat memasukkan data banyak warga sekaligus dengan mengunggah file Excel (.xlsx) atau CSV.
          </p>

          {/* Download template callout */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span className="font-medium text-emerald-900">Belum punya format Excel?</span>
            </div>
            <button
              onClick={downloadWargaTemplateExcel}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-white hover:bg-emerald-100 rounded-lg border border-emerald-300 transition"
            >
              <Download className="w-3 h-3" />
              <span>Unduh Template</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Upload Dropzone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            <FileSpreadsheet className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-800 text-sm">
              {selectedFile ? selectedFile.name : 'Klik untuk memilih file Excel / CSV'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Kolom didukung: Kecamatan, Kelurahan, Nama, Tempat Lahir, Usia, Kelamin, Alamat, RT, RW, Valid
            </p>
          </div>

          {/* Parsed Preview */}
          {parsedData.length > 0 && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between font-bold text-teal-900">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>{parsedData.length} Data Siap Diimpor</span>
                </span>
              </div>
              <p className="text-[11px] text-teal-800">
                Contoh: {parsedData.slice(0, 3).map((w) => w.nama).join(', ')}
                {parsedData.length > 3 ? `, dan ${parsedData.length - 3} lainnya.` : '.'}
              </p>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={isLoading || parsedData.length === 0}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-semibold transition shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>{isLoading ? 'Memproses...' : `Impor ${parsedData.length} Warga`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
