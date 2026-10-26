import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Warga } from '../types/warga';

interface DeleteConfirmModalProps {
  warga: Warga | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (warga: Warga) => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  warga,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !warga) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(warga);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-rose-200 w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-rose-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-700 flex items-center justify-center border border-rose-500">
              <AlertTriangle className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-base font-bold">Hapus Data Warga</h3>
              <p className="text-xs text-rose-100">Konfirmasi Penghapusan Permanen</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup konfirmasi hapus"
            className="text-rose-200 hover:text-white p-1 rounded-lg hover:bg-rose-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Apakah Anda yakin ingin menghapus data warga berikut dari sistem kependudukan Desa Taruman?
          </p>

          <div className="p-3.5 bg-rose-50/80 rounded-xl border border-rose-200 text-xs space-y-1">
            <div className="font-bold text-slate-900 text-sm">{warga.nama}</div>
            <div className="text-slate-600">
              {warga.alamat} (RT {warga.rt} / RW {warga.rw})
            </div>
            <div className="text-slate-500 text-[11px]">
              Kec. {warga.kecamatan}, Desa {warga.kelurahan} • Usia {warga.usia} Th ({warga.kelamin})
            </div>
          </div>

          <p className="text-[11px] text-rose-600 font-medium">
            * Perhatian: Data yang dihapus tidak dapat dipulihkan kembali dan akan langsung hilang dari pencarian publik.
          </p>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-xs hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-xs transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Data Warga'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
