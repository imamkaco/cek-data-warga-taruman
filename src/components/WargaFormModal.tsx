import React, { useState, useEffect } from 'react';
import { X, Save, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { Warga } from '../types/warga';

interface WargaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<Warga>) => Promise<void>;
  editData?: Warga | null;
}

export const WargaFormModal: React.FC<WargaFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editData,
}) => {
  const [formData, setFormData] = useState({
    kecamatan: 'Klambu',
    kelurahan: 'Taruman',
    nama: '',
    tempat_lahir: 'Grobogan',
    usia: 25,
    kelamin: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    alamat: 'Dusun Krajan',
    rt: '01',
    rw: '01',
    valid: 'Valid' as 'Valid' | 'Belum Valid',
    nik: '',
    pekerjaan: 'Petani',
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        kecamatan: editData.kecamatan || 'Klambu',
        kelurahan: editData.kelurahan || 'Taruman',
        nama: editData.nama || '',
        tempat_lahir: editData.tempat_lahir || '',
        usia: editData.usia || 0,
        kelamin: editData.kelamin || 'Laki-laki',
        alamat: editData.alamat || '',
        rt: editData.rt || '01',
        rw: editData.rw || '01',
        valid: editData.valid || 'Valid',
        nik: editData.nik || '',
        pekerjaan: editData.pekerjaan || '',
      });
    } else {
      setFormData({
        kecamatan: 'Klambu',
        kelurahan: 'Taruman',
        nama: '',
        tempat_lahir: 'Grobogan',
        usia: 30,
        kelamin: 'Laki-laki',
        alamat: 'Dusun Krajan',
        rt: '01',
        rw: '01',
        valid: 'Valid',
        nik: '',
        pekerjaan: 'Petani',
      });
    }
    setError(null);
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nama.trim()) {
      setError('Nama lengkap warga wajib diisi.');
      return;
    }

    if (!formData.alamat.trim()) {
      setError('Alamat domisili warga wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        usia: Number(formData.usia),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data warga.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center border border-emerald-600">
              <UserPlus className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {editData ? 'Edit Data Warga' : 'Tambah Data Warga Baru'}
              </h3>
              <p className="text-xs text-emerald-200">
                Pemerintah Desa Taruman, Kecamatan Klambu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup form"
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Row 1: Nama Lengkap */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Lengkap Warga <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Contoh: Bambang Sutrisno"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Row 2: Tempat Lahir & Usia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tempat Lahir <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.tempat_lahir}
                onChange={(e) => setFormData({ ...formData, tempat_lahir: e.target.value })}
                placeholder="Contoh: Grobogan"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Usia (Tahun) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="125"
                required
                value={formData.usia}
                onChange={(e) => setFormData({ ...formData, usia: parseInt(e.target.value, 10) || 0 })}
                placeholder="Contoh: 35"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Row 3: Jenis Kelamin & Status Validasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jenis Kelamin <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.kelamin}
                onChange={(e) => setFormData({ ...formData, kelamin: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Status Validasi Data <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.valid}
                onChange={(e) => setFormData({ ...formData, valid: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Valid">Valid</option>
                <option value="Belum Valid">Belum Valid</option>
              </select>
            </div>
          </div>

          {/* Row 4: Alamat */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Alamat Domisili / Dusun <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              placeholder="Contoh: Dusun Krajan / Dusun Taruman Timur"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Row 5: RT & RW */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                RT <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={formData.rt}
                onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                placeholder="01"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                RW <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={formData.rw}
                onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                placeholder="01"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Row 6: Kelurahan & Kecamatan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kelurahan / Desa
              </label>
              <input
                type="text"
                value={formData.kelurahan}
                onChange={(e) => setFormData({ ...formData, kelurahan: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kecamatan
              </label>
              <input
                type="text"
                value={formData.kecamatan}
                onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Optional: Pekerjaan & NIK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pekerjaan (Opsional)
              </label>
              <input
                type="text"
                value={formData.pekerjaan}
                onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                placeholder="Petani / Wiraswasta"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIK (Opsional)
              </label>
              <input
                type="text"
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                placeholder="331502..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-semibold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : editData ? 'Simpan Perubahan' : 'Tambahkan Warga'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
