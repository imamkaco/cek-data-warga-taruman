import React from 'react';
import { Eye, Edit3, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { Warga } from '../types/warga';

interface WargaTableProps {
  wargaList: Warga[];
  isAdmin: boolean;
  onViewDetail: (warga: Warga) => void;
  onEdit?: (warga: Warga) => void;
  onDelete?: (warga: Warga) => void;
  onToggleValid?: (warga: Warga) => void;
}

export const WargaTable: React.FC<WargaTableProps> = ({
  wargaList,
  isAdmin,
  onViewDetail,
  onEdit,
  onDelete,
  onToggleValid,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4 w-12 text-center">No</th>
              <th className="py-3 px-4">Nama Lengkap</th>
              <th className="py-3 px-4">Tempat / Usia</th>
              <th className="py-3 px-4">Kelamin</th>
              <th className="py-3 px-4">Alamat & RT/RW</th>
              <th className="py-3 px-4">Desa / Kec.</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {wargaList.map((item, index) => {
              const isValid = item.valid === 'Valid';
              return (
                <tr key={item.id} className="hover:bg-slate-50/80 transition group">
                  <td className="py-3 px-4 text-center font-mono text-xs text-slate-400">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <span 
                      onClick={() => onViewDetail(item)}
                      className="cursor-pointer hover:text-emerald-700 hover:underline"
                    >
                      {item.nama}
                    </span>
                    {item.pekerjaan && (
                      <span className="block text-[11px] font-normal text-slate-500">
                        {item.pekerjaan}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span>{item.tempat_lahir}</span>
                    <span className="block font-semibold text-emerald-700 text-xs">
                      {item.usia} Tahun
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.kelamin === 'Laki-laki'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-pink-50 text-pink-700 border border-pink-200'
                      }`}
                    >
                      {item.kelamin}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{item.alamat}</div>
                    <div className="text-[11px] text-slate-500">
                      RT {item.rt} / RW {item.rw}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-xs">
                    <div>{item.kelurahan}</div>
                    <div className="text-[11px] text-slate-400">Kec. {item.kecamatan}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {isValid ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Valid</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Belum</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onViewDetail(item)}
                        className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition"
                        title="Lihat Detail Warga"
                        aria-label={`Lihat detail ${item.nama}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* ADMIN EXCLUSIVE ACTIONS */}
                      {isAdmin && (
                        <>
                          {onToggleValid && (
                            <button
                              onClick={() => onToggleValid(item)}
                              className={`p-1.5 rounded-lg transition ${
                                isValid ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                              title={isValid ? 'Tandai Belum Valid' : 'Tandai Valid'}
                              aria-label={`Ubah status ${item.nama}`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition"
                              title="Edit Data Warga"
                              aria-label={`Edit ${item.nama}`}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                              title="Hapus Data Warga"
                              aria-label={`Hapus ${item.nama}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
