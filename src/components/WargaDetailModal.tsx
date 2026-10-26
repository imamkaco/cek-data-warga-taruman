import React, { useState } from 'react';
import { X, CheckCircle2, Clock, MapPin, Calendar, User, ShieldCheck, Copy, Check, Printer } from 'lucide-react';
import { Warga } from '../types/warga';

interface WargaDetailModalProps {
  warga: Warga | null;
  onClose: () => void;
}

export const WargaDetailModal: React.FC<WargaDetailModalProps> = ({
  warga,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!warga) return null;

  const isValid = warga.valid === 'Valid';

  const handleCopy = () => {
    const text = `Data Warga Desa Taruman:
Nama: ${warga.nama}
Kecamatan: ${warga.kecamatan}
Kelurahan: ${warga.kelurahan}
Tempat Lahir: ${warga.tempat_lahir}
Usia: ${warga.usia} Tahun
Kelamin: ${warga.kelamin}
Alamat: ${warga.alamat}
RT/RW: ${warga.rt}/${warga.rw}
Status: ${warga.valid}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
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
        {/* Header */}
        <div className="bg-emerald-800 text-white p-5 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-700/80 flex items-center justify-center border border-emerald-500/50 shadow-inner">
              <span className="text-2xl">🏛️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">Kartu Informasi Warga</h3>
              </div>
              <p className="text-xs text-emerald-200">
                Pemerintah Desa Taruman • Kecamatan Klambu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup detail warga"
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status bar */}
        <div className={`px-6 py-2.5 flex items-center justify-between text-xs font-semibold ${
          isValid ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-100' : 'bg-amber-50 text-amber-800 border-b border-amber-100'
        }`}>
          <div className="flex items-center gap-1.5">
            {isValid ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-amber-600" />}
            <span>Status Validasi: {warga.valid}</span>
          </div>
          <span className="text-[11px] font-normal text-slate-500">
            ID: {warga.id}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Main Name & Gender */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
              Nama Lengkap Warga
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              {warga.nama}
            </div>
            {warga.pekerjaan && (
              <div className="text-xs text-slate-600 mt-1">
                Pekerjaan: <span className="font-semibold text-slate-800">{warga.pekerjaan}</span>
              </div>
            )}
          </div>

          {/* Grid of Key Properties */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Tempat Lahir</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{warga.tempat_lahir}</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Usia</span>
              <span className="font-bold text-emerald-700 text-sm mt-0.5 block">{warga.usia} Tahun</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Jenis Kelamin</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{warga.kelamin}</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">RT / RW</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">RT {warga.rt} / RW {warga.rw}</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Kelurahan / Desa</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{warga.kelurahan}</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Kecamatan</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{warga.kecamatan}</span>
            </div>
          </div>

          {/* Full Address */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px] mb-1">Alamat Lengkap</span>
            <div className="flex items-start gap-2 text-xs text-slate-800">
              <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">
                {warga.alamat}, RT {warga.rt} / RW {warga.rw}, Desa {warga.kelurahan}, Kec. {warga.kecamatan}
              </span>
            </div>
          </div>

          {/* Official Verification Notice */}
          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              Data ini resmi tercatat dalam basis data kependudukan Pemerintah Desa Taruman. Jika terdapat ketidaksesuaian data, silakan hubungi perangkat desa atau ketua RT/RW setempat.
            </span>
          </div>
        </div>

        {/* Footer: ONLY Close & Share/Copy (Strictly NO edit/delete as instructed) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Info</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 transition shadow-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
