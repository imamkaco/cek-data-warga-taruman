import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Warga,
  WargaFilter,
  WargaStats,
} from './types/warga';
import {
  fetchWargaList,
  fetchStats,
  verifyAdminSession,
  clearAdminToken,
  createWarga,
  updateWarga,
  toggleValidStatus,
  deleteWarga,
  batchImportWarga,
} from './services/api';
import { exportWargaToExcel, downloadWargaTemplateExcel } from './utils/excel';

import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { PublicSearch } from './components/PublicSearch';
import { AdminControls } from './components/AdminControls';
import { WargaCard } from './components/WargaCard';
import { WargaTable } from './components/WargaTable';
import { WargaDetailModal } from './components/WargaDetailModal';
import { WargaFormModal } from './components/WargaFormModal';
import { LoginModal } from './components/LoginModal';
import { ImportModal } from './components/ImportModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

import {
  LayoutGrid,
  List,
  SearchX,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  MapPin,
} from 'lucide-react';

export default function App() {
  // State
  const [wargaList, setWargaList] = useState<Warga[]>([]);
  const [stats, setStats] = useState<WargaStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Admin status
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Filter state
  const [filter, setFilter] = useState<WargaFilter>({
    q: '',
    rt: 'ALL',
    rw: 'ALL',
    valid: 'ALL',
    kelamin: 'ALL',
  });

  // View mode: 'cards' or 'table'
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [detailWarga, setDetailWarga] = useState<Warga | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editWarga, setEditWarga] = useState<Warga | null>(null);
  const [deleteTargetWarga, setDeleteTargetWarga] = useState<Warga | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Load Initial Data
  const loadData = useCallback(async (showIndicator = false) => {
    if (showIndicator) setIsRefreshing(true);
    try {
      const [listData, statsData] = await Promise.all([
        fetchWargaList(),
        fetchStats(),
      ]);
      setWargaList(listData);
      setStats(statsData);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('Gagal memuat data warga dari server. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Check admin session on initial mount
  useEffect(() => {
    const checkAuth = async () => {
      const auth = await verifyAdminSession();
      setIsAdmin(auth);
    };
    checkAuth();
    loadData();
  }, [loadData]);

  // Periodic polling for sync (every 25 seconds) to ensure changes made anywhere reflect on public browsers
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(false);
    }, 25000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Client-side filtering for immediate snappy response on search & filters
  const filteredWarga = useMemo(() => {
    let result = [...wargaList];

    if (filter.q.trim()) {
      const query = filter.q.trim().toLowerCase();
      result = result.filter(
        (w) =>
          w.nama.toLowerCase().includes(query) ||
          w.alamat.toLowerCase().includes(query) ||
          w.tempat_lahir.toLowerCase().includes(query) ||
          w.rt.toLowerCase().includes(query) ||
          w.rw.toLowerCase().includes(query) ||
          (w.pekerjaan && w.pekerjaan.toLowerCase().includes(query)) ||
          (w.nik && w.nik.toLowerCase().includes(query))
      );
    }

    if (filter.rt !== 'ALL') {
      const targetRt = filter.rt.padStart(2, '0');
      result = result.filter((w) => w.rt.padStart(2, '0') === targetRt);
    }

    if (filter.rw !== 'ALL') {
      const targetRw = filter.rw.padStart(2, '0');
      result = result.filter((w) => w.rw.padStart(2, '0') === targetRw);
    }

    if (filter.valid !== 'ALL') {
      result = result.filter((w) => w.valid === filter.valid);
    }

    if (filter.kelamin !== 'ALL') {
      result = result.filter((w) => w.kelamin === filter.kelamin);
    }

    return result;
  }, [wargaList, filter]);

  // Handler: Change filter
  const handleFilterChange = (newValues: Partial<WargaFilter>) => {
    setFilter((prev) => ({ ...prev, ...newValues }));
  };

  // Handler: Reset filter
  const handleResetFilter = () => {
    setFilter({
      q: '',
      rt: 'ALL',
      rw: 'ALL',
      valid: 'ALL',
      kelamin: 'ALL',
    });
  };

  // Admin Logout
  const handleLogout = () => {
    clearAdminToken();
    setIsAdmin(false);
    showToast('Anda telah keluar dari mode admin.', 'info');
  };

  // Admin: Save or Update citizen
  const handleFormSubmit = async (formData: Partial<Warga>) => {
    if (editWarga) {
      await updateWarga(editWarga.id, formData);
      showToast(`Data warga "${formData.nama}" berhasil diperbarui!`, 'success');
    } else {
      await createWarga(formData);
      showToast(`Data warga "${formData.nama}" berhasil ditambahkan!`, 'success');
    }
    await loadData();
  };

  // Admin: Toggle validation status
  const handleToggleValid = async (target: Warga) => {
    try {
      const updated = await toggleValidStatus(target.id);
      showToast(`Status "${target.nama}" diubah menjadi ${updated.valid}`, 'success');
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah status', 'error');
    }
  };

  // Admin: Delete citizen
  const handleDeleteConfirm = async (target: Warga) => {
    try {
      await deleteWarga(target.id);
      showToast(`Data warga "${target.nama}" berhasil dihapus.`, 'success');
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus data warga', 'error');
    }
  };

  // Admin: Batch Import from Excel/CSV
  const handleBatchImport = async (items: Partial<Warga>[]) => {
    const count = await batchImportWarga(items);
    showToast(`Berhasil menambahkan ${count} data warga dari file!`, 'success');
    await loadData();
  };

  // Admin: Export to Excel
  const handleExportExcel = () => {
    if (filteredWarga.length === 0) {
      showToast('Tidak ada data yang dapat diekspor.', 'error');
      return;
    }
    setIsExporting(true);
    try {
      const filename = `Laporan_Data_Warga_Desa_Taruman_RT${filter.rt}_RW${filter.rw}`;
      exportWargaToExcel(filteredWarga, filename);
      showToast(`Berhasil mengekspor ${filteredWarga.length} data warga ke Excel!`, 'success');
    } catch (err) {
      showToast('Gagal mengekspor laporan ke Excel.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-xs sm:text-sm font-semibold flex items-center gap-2.5 ${
              toast.type === 'success'
                ? 'bg-emerald-800 text-white border-emerald-700'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-300" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        isAdmin={isAdmin}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onRefresh={() => loadData(true)}
        isRefreshing={isRefreshing}
        totalWarga={wargaList.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Welcome & Informational Hero */}
        <div className="mb-6 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Portal Kependudukan Digital</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Cek Data Warga Desa Taruman
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Masyarakat dapat mengecek data kependudukan secara langsung melalui browser HP tanpa perlu instalasi aplikasi. Data selalu diperbarui dari kantor Desa Taruman.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs text-slate-600">
            <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>Kecamatan Klambu, Kab. Grobogan</span>
          </div>
        </div>

        {/* Admin Controls Toolbar (Only shown when admin is logged in) */}
        {isAdmin && (
          <AdminControls
            onOpenAddModal={() => {
              setEditWarga(null);
              setIsFormOpen(true);
            }}
            onOpenImportModal={() => setIsImportOpen(true)}
            onExportExcel={handleExportExcel}
            onDownloadTemplate={downloadWargaTemplateExcel}
            isExporting={isExporting}
            totalFiltered={filteredWarga.length}
          />
        )}

        {/* Stats Metrics Cards */}
        <StatsBanner
          stats={stats}
          filteredCount={filteredWarga.length}
          isFiltered={
            Boolean(filter.q || filter.rt !== 'ALL' || filter.rw !== 'ALL' || filter.valid !== 'ALL' || filter.kelamin !== 'ALL')
          }
        />

        {/* Search & Filter Bar */}
        <PublicSearch
          filter={filter}
          onChangeFilter={handleFilterChange}
          onResetFilter={handleResetFilter}
          stats={stats}
        />

        {/* View Switcher & Result Count Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="text-xs sm:text-sm font-semibold text-slate-700">
            Menampilkan <span className="text-emerald-800 font-bold">{filteredWarga.length}</span> warga
            {wargaList.length > 0 && wargaList.length !== filteredWarga.length && (
              <span className="text-slate-400 font-normal"> (dari total {wargaList.length})</span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                viewMode === 'cards'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Tampilan Kartu (Nyaman di HP)"
              aria-label="Tampilan Kartu"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Kartu</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                viewMode === 'table'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Tampilan Tabel"
              aria-label="Tampilan Tabel"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Tabel</span>
            </button>
          </div>
        </div>

        {/* Content State: Loading, Empty, or List */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-semibold text-slate-700">Memuat data kependudukan Desa Taruman...</p>
            <p className="text-xs text-slate-400 mt-1">Menghubungkan langsung ke server desa</p>
          </div>
        ) : filteredWarga.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <SearchX className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Data warga tidak ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Tidak ada data warga yang cocok dengan kata kunci atau filter yang Anda pilih. Silakan periksa kembali ejaan nama atau reset filter.
            </p>
            <button
              onClick={handleResetFilter}
              className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition"
            >
              Tampilkan Semua Warga
            </button>
          </div>
        ) : viewMode === 'table' ? (
          <WargaTable
            wargaList={filteredWarga}
            isAdmin={isAdmin}
            onViewDetail={(item) => setDetailWarga(item)}
            onEdit={isAdmin ? (item) => { setEditWarga(item); setIsFormOpen(true); } : undefined}
            onDelete={isAdmin ? (item) => setDeleteTargetWarga(item) : undefined}
            onToggleValid={isAdmin ? handleToggleValid : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredWarga.map((warga) => (
              <WargaCard
                key={warga.id}
                warga={warga}
                isAdmin={isAdmin}
                onViewDetail={(item) => setDetailWarga(item)}
                onEdit={isAdmin ? (item) => { setEditWarga(item); setIsFormOpen(true); } : undefined}
                onDelete={isAdmin ? (item) => setDeleteTargetWarga(item) : undefined}
                onToggleValid={isAdmin ? handleToggleValid : undefined}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">Pemerintah Desa Taruman</span>
            <span>•</span>
            <span>Kecamatan Klambu, Kabupaten Grobogan</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Sistem Informasi Data Warga Ringan & Responsif</span>
            <span>•</span>
            <span>Realtime Server Sync</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* 1. Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdmin(true);
          showToast('Selamat datang! Mode Admin berhasil diaktifkan.', 'success');
        }}
      />

      {/* 2. Detail Modal (Public & Admin: view-only without edit/delete buttons as strictly required) */}
      <WargaDetailModal
        warga={detailWarga}
        onClose={() => setDetailWarga(null)}
      />

      {/* 3. Add / Edit Modal (Admin Only) */}
      <WargaFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditWarga(null);
        }}
        onSubmit={handleFormSubmit}
        editData={editWarga}
      />

      {/* 4. Delete Confirmation Modal (Admin Only - "DAN ADMIN DAPAT MENGHAPUS DATA WARGA") */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTargetWarga)}
        warga={deleteTargetWarga}
        onClose={() => setDeleteTargetWarga(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* 5. Batch Import Modal (Admin Only) */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={handleBatchImport}
      />
    </div>
  );
}
