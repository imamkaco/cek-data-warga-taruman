import React from 'react';
import { MapPin, Calendar, CheckCircle2, Clock, Trash2, Edit3, Eye, ShieldCheck } from 'lucide-react';
import { Warga } from '../types/warga';

interface WargaCardProps {
  warga: Warga;
  isAdmin: boolean;
  onViewDetail: (warga: Warga) => void;
  onEdit?: (warga: Warga) => void;
  onDelete?: (warga: Warga) => void;
  onToggleValid?: (warga: Warga) => void;
}

export const WargaCard: React.FC<WargaCardProps> = ({
  warga,
  isAdmin,
  onViewDetail,
  onEdit,
  onDelete,
  onToggleValid,
}) => {
  const isValid = warga.valid === 'Valid';

  return (
    <div 
      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
    >
      <div>
        {/* Top Badges & Status */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              RT {warga.rt} / RW {warga.rw}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                warga.kelamin === 'Laki-laki'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-pink-50 text-pink-700 border border-pink-200'
              }`}
            >
              {warga.kelamin}
            </span>
          </div>

          {/* Validation Status Badge */}
          <div className="flex items-center">
            {isValid ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Valid</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Belum Valid</span>
              </span>
            )}
          </div>
        </div>

        {/* Resident Name */}
        <h3 
          onClick={() => onViewDetail(warga)}
          className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition cursor-pointer leading-snug line-clamp-1"
        >
          {warga.nama}
        </h3>

        {/* Demographics */}
        <div className="mt-2 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-2 text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>
              Lahir di <strong className="font-semibold text-slate-800">{warga.tempat_lahir}</strong>, Usia <strong className="font-semibold text-emerald-700">{warga.usia} th</strong>
            </span>
          </div>

          <div className="flex items-start gap-2 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              {warga.alamat}, Ds. {warga.kelurahan}, Kec. {warga.kecamatan}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Detail Button - Always present for everyone */}
        <button
          onClick={() => onViewDetail(warga)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 transition"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Lihat Detail</span>
        </button>

        {/* ADMIN EXCLUSIVE ACTIONS */}
        {isAdmin && (
          <div className="flex items-center gap-1.5">
            {/* Quick Toggle Valid */}
            {onToggleValid && (
              <button
                onClick={() => onToggleValid(warga)}
                title={isValid ? 'Ubah status ke Belum Valid' : 'Ubah status ke Valid'}
                aria-label={`Ubah status validasi ${warga.nama}`}
                className={`p-1.5 rounded-lg border text-xs transition ${
                  isValid
                    ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                    : 'border-amber-300 text-amber-700 hover:bg-amber-50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Edit */}
            {onEdit && (
              <button
                onClick={() => onEdit(warga)}
                title="Edit data warga"
                aria-label={`Edit ${warga.nama}`}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Delete */}
            {onDelete && (
              <button
                onClick={() => onDelete(warga)}
                title="Hapus data warga"
                aria-label={`Hapus ${warga.nama}`}
                className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
