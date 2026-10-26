import React from 'react';
import { ShieldCheck, LogIn, LogOut, CheckCircle2, RefreshCw } from 'lucide-react';

interface NavbarProps {
  isAdmin: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  totalWarga: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdmin,
  onOpenLogin,
  onLogout,
  onRefresh,
  isRefreshing,
  totalWarga,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-emerald-800 text-white shadow-md border-b border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Village Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-700/80 border-2 border-emerald-300/40 flex items-center justify-center shadow-inner flex-shrink-0">
              <span className="text-xl sm:text-2xl font-black text-amber-300">🏛️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                  Cek Data Warga
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-700 text-emerald-100 border border-emerald-600">
                  Desa Taruman
                </span>
              </div>
              <p className="text-xs text-emerald-200 hidden sm:block">
                Kecamatan Klambu • Kabupaten Grobogan • Sistem Informasi Warga Terpadu
              </p>
              <p className="text-xs text-emerald-200 sm:hidden">
                Kec. Klambu • {totalWarga} Data
              </p>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Perbarui Data Langsung dari Server"
              aria-label="Refresh data warga"
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700 active:scale-95 transition flex items-center gap-1.5 text-xs font-medium border border-emerald-700/60"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-300' : ''}`} />
              <span className="hidden md:inline">Sinkron Data</span>
            </button>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-amber-500/20 border border-amber-400/40 text-amber-200 px-2.5 py-1 rounded-lg text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-amber-300" />
                  <span>Admin Desa</span>
                </div>
                <button
                  onClick={onLogout}
                  className="px-2.5 sm:px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-lg text-xs font-medium transition flex items-center gap-1 shadow-sm"
                  title="Keluar dari Akun Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 border border-emerald-500/50 shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-200" />
                <span>Masuk Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub-bar for public notice */}
      <div className="bg-emerald-950/80 px-4 py-1 text-center text-[11px] sm:text-xs text-emerald-200/90 border-t border-emerald-900/60 flex items-center justify-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
        <span>
          {isAdmin
            ? 'Mode Administrator Aktif: Anda dapat menambah, mengubah, mengekspor Excel, dan menghapus data warga.'
            : 'Akses Publik: Hanya untuk memeriksa data kependudukan secara langsung tanpa login / unduh aplikasi.'}
        </span>
      </div>
    </header>
  );
};
