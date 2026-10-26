import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

export interface Warga {
  id: string;
  kecamatan: string;
  kelurahan: string;
  nama: string;
  tempat_lahir: string;
  usia: number;
  kelamin: 'Laki-laki' | 'Perempuan';
  alamat: string;
  rt: string;
  rw: string;
  valid: 'Valid' | 'Belum Valid';
  nik?: string;
  pekerjaan?: string;
  created_at?: string;
  updated_at?: string;
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'TARUMAN123#';

// Storage paths: Support both local development and Vercel serverless environments
const BUNDLED_FILE = path.resolve(process.cwd(), 'data', 'warga.json');
const TMP_FILE = path.resolve('/tmp', 'warga.json');

// In-memory cache for fast response and warm lambda persistence
let inMemoryWargaCache: Warga[] | null = null;
const activeAdminTokens = new Set<string>();

export function loadWarga(): Warga[] {
  if (inMemoryWargaCache && inMemoryWargaCache.length > 0) {
    return inMemoryWargaCache;
  }

  // 1. Try reading from /tmp on Vercel
  try {
    if (fs.existsSync(TMP_FILE)) {
      const data = fs.readFileSync(TMP_FILE, 'utf-8');
      inMemoryWargaCache = JSON.parse(data);
      return inMemoryWargaCache!;
    }
  } catch (err) {
    console.warn('Could not read from /tmp/warga.json:', err);
  }

  // 2. Try reading from project bundled file
  try {
    if (fs.existsSync(BUNDLED_FILE)) {
      const data = fs.readFileSync(BUNDLED_FILE, 'utf-8');
      inMemoryWargaCache = JSON.parse(data);
      return inMemoryWargaCache!;
    }
  } catch (err) {
    console.warn('Could not read from bundled data/warga.json:', err);
  }

  return [];
}

export function saveWarga(wargaList: Warga[]): boolean {
  inMemoryWargaCache = wargaList;

  // Try saving to /tmp (always writable on Vercel serverless functions)
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(wargaList, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to /tmp:', err);
  }

  // Also try saving to local project data folder (works in local development and Docker)
  try {
    const dir = path.dirname(BUNDLED_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(BUNDLED_FILE, JSON.stringify(wargaList, null, 2), 'utf-8');
  } catch (err) {
    // Expected on Vercel read-only filesystem, safe to ignore
  }

  return true;
}

export function checkAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Akses ditolak: Autentikasi Admin diperlukan.' });
  }

  const token = authHeader.replace(/^Bearer\s+/, '').trim();
  if (token === ADMIN_PASSWORD || activeAdminTokens.has(token)) {
    return next();
  }

  return res.status(403).json({ error: 'Akses ditolak: Token admin tidak valid.' });
}

export const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Admin login endpoint
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = `taruman-admin-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    activeAdminTokens.add(token);
    return res.json({ success: true, token, message: 'Berhasil login sebagai Administrator Desa Taruman' });
  }
  return res.status(401).json({ success: false, error: 'Password admin salah! Silakan coba lagi.' });
});

// Verify admin session endpoint
app.get('/api/admin/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ authenticated: false });
  }
  const token = authHeader.replace(/^Bearer\s+/, '').trim();
  if (token === ADMIN_PASSWORD || activeAdminTokens.has(token)) {
    return res.json({ authenticated: true });
  }
  return res.json({ authenticated: false });
});

// Public endpoint: Get statistics
app.get('/api/stats', (_req: Request, res: Response) => {
  const list = loadWarga();
  const total = list.length;
  const valid = list.filter((w) => w.valid === 'Valid').length;
  const belumValid = list.filter((w) => w.valid === 'Belum Valid').length;
  const lakiLaki = list.filter((w) => w.kelamin === 'Laki-laki').length;
  const perempuan = list.filter((w) => w.kelamin === 'Perempuan').length;

  const rtSet = new Set<string>();
  const rwSet = new Set<string>();
  list.forEach((w) => {
    if (w.rt) rtSet.add(w.rt.padStart(2, '0'));
    if (w.rw) rwSet.add(w.rw.padStart(2, '0'));
  });

  return res.json({
    total,
    valid,
    belumValid,
    lakiLaki,
    perempuan,
    rtList: Array.from(rtSet).sort(),
    rwList: Array.from(rwSet).sort(),
  });
});

// Public endpoint: Get list of citizen data with filtering & search
app.get('/api/warga', (req: Request, res: Response) => {
  const { q, rt, rw, valid, kelamin } = req.query;
  let list = loadWarga();

  if (typeof q === 'string' && q.trim()) {
    const query = q.trim().toLowerCase();
    list = list.filter((w) => {
      return (
        w.nama.toLowerCase().includes(query) ||
        w.alamat.toLowerCase().includes(query) ||
        w.tempat_lahir.toLowerCase().includes(query) ||
        w.rt.toLowerCase().includes(query) ||
        w.rw.toLowerCase().includes(query) ||
        (w.pekerjaan && w.pekerjaan.toLowerCase().includes(query)) ||
        (w.nik && w.nik.toLowerCase().includes(query))
      );
    });
  }

  if (typeof rt === 'string' && rt !== '' && rt !== 'ALL') {
    const normalizedRt = rt.padStart(2, '0');
    list = list.filter((w) => w.rt.padStart(2, '0') === normalizedRt);
  }

  if (typeof rw === 'string' && rw !== '' && rw !== 'ALL') {
    const normalizedRw = rw.padStart(2, '0');
    list = list.filter((w) => w.rw.padStart(2, '0') === normalizedRw);
  }

  if (typeof valid === 'string' && valid !== '' && valid !== 'ALL') {
    list = list.filter((w) => w.valid === valid);
  }

  if (typeof kelamin === 'string' && kelamin !== '' && kelamin !== 'ALL') {
    list = list.filter((w) => w.kelamin === kelamin);
  }

  list.sort((a, b) => a.nama.localeCompare(b.nama));
  return res.json(list);
});

// Public endpoint: Get citizen detail
app.get('/api/warga/:id', (req: Request, res: Response) => {
  const list = loadWarga();
  const item = list.find((w) => w.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Data warga tidak ditemukan' });
  }
  return res.json(item);
});

// Admin endpoint: Create single citizen
app.post('/api/warga', checkAdminAuth, (req: Request, res: Response) => {
  const data = req.body;
  if (!data.nama || !data.alamat) {
    return res.status(400).json({ error: 'Nama dan Alamat wajib diisi' });
  }

  const list = loadWarga();
  const newId = `warga-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const newWarga: Warga = {
    id: newId,
    kecamatan: (data.kecamatan || 'Klambu').trim(),
    kelurahan: (data.kelurahan || 'Taruman').trim(),
    nama: data.nama.trim(),
    tempat_lahir: (data.tempat_lahir || 'Grobogan').trim(),
    usia: Math.max(0, parseInt(data.usia, 10) || 0),
    kelamin: data.kelamin === 'Perempuan' ? 'Perempuan' : 'Laki-laki',
    alamat: data.alamat.trim(),
    rt: String(data.rt || '01').padStart(2, '0'),
    rw: String(data.rw || '01').padStart(2, '0'),
    valid: data.valid === 'Belum Valid' ? 'Belum Valid' : 'Valid',
    nik: data.nik ? String(data.nik).trim() : undefined,
    pekerjaan: data.pekerjaan ? String(data.pekerjaan).trim() : undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  list.unshift(newWarga);
  saveWarga(list);

  return res.status(201).json({ success: true, data: newWarga });
});

// Admin endpoint: Batch import citizens
app.post('/api/warga/batch-import', checkAdminAuth, (req: Request, res: Response) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Data import tidak valid atau kosong' });
  }

  const list = loadWarga();
  let importedCount = 0;

  items.forEach((item, index) => {
    if (!item.nama) return;
    const newWarga: Warga = {
      id: `warga-imp-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
      kecamatan: (item.kecamatan || 'Klambu').trim(),
      kelurahan: (item.kelurahan || 'Taruman').trim(),
      nama: String(item.nama).trim(),
      tempat_lahir: String(item.tempat_lahir || 'Grobogan').trim(),
      usia: Math.max(0, parseInt(item.usia, 10) || 0),
      kelamin:
        String(item.kelamin).toLowerCase().includes('p') ||
        String(item.kelamin).toLowerCase().includes('wanita')
          ? 'Perempuan'
          : 'Laki-laki',
      alamat: String(item.alamat || 'Desa Taruman').trim(),
      rt: String(item.rt || '01').padStart(2, '0'),
      rw: String(item.rw || '01').padStart(2, '0'),
      valid:
        String(item.valid).toLowerCase().includes('belum') ||
        String(item.valid).toLowerCase().includes('tidak') ||
        String(item.valid).toLowerCase().includes('invalid')
          ? 'Belum Valid'
          : 'Valid',
      nik: item.nik ? String(item.nik).trim() : undefined,
      pekerjaan: item.pekerjaan ? String(item.pekerjaan).trim() : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    list.unshift(newWarga);
    importedCount++;
  });

  saveWarga(list);
  return res.json({ success: true, count: importedCount, message: `Berhasil mengimpor ${importedCount} data warga.` });
});

// Admin endpoint: Update citizen
app.put('/api/warga/:id', checkAdminAuth, (req: Request, res: Response) => {
  const list = loadWarga();
  const index = list.findIndex((w) => w.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Data warga tidak ditemukan' });
  }

  const data = req.body;
  const existing = list[index];

  list[index] = {
    ...existing,
    kecamatan: (data.kecamatan ?? existing.kecamatan).trim(),
    kelurahan: (data.kelurahan ?? existing.kelurahan).trim(),
    nama: (data.nama ?? existing.nama).trim(),
    tempat_lahir: (data.tempat_lahir ?? existing.tempat_lahir).trim(),
    usia: data.usia !== undefined ? Math.max(0, parseInt(data.usia, 10) || 0) : existing.usia,
    kelamin: data.kelamin === 'Perempuan' ? 'Perempuan' : 'Laki-laki',
    alamat: (data.alamat ?? existing.alamat).trim(),
    rt: String(data.rt ?? existing.rt).padStart(2, '0'),
    rw: String(data.rw ?? existing.rw).padStart(2, '0'),
    valid: data.valid === 'Belum Valid' ? 'Belum Valid' : 'Valid',
    nik: data.nik !== undefined ? String(data.nik).trim() : existing.nik,
    pekerjaan: data.pekerjaan !== undefined ? String(data.pekerjaan).trim() : existing.pekerjaan,
    updated_at: new Date().toISOString(),
  };

  saveWarga(list);
  return res.json({ success: true, data: list[index] });
});

// Admin endpoint: Toggle validation status
app.patch('/api/warga/:id/toggle-valid', checkAdminAuth, (req: Request, res: Response) => {
  const list = loadWarga();
  const index = list.findIndex((w) => w.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Data warga tidak ditemukan' });
  }

  const current = list[index].valid;
  list[index].valid = current === 'Valid' ? 'Belum Valid' : 'Valid';
  list[index].updated_at = new Date().toISOString();

  saveWarga(list);
  return res.json({ success: true, valid: list[index].valid, data: list[index] });
});

// Admin endpoint: Delete citizen
app.delete('/api/warga/:id', checkAdminAuth, (req: Request, res: Response) => {
  const list = loadWarga();
  const index = list.findIndex((w) => w.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Data warga tidak ditemukan' });
  }

  const deletedItem = list.splice(index, 1)[0];
  saveWarga(list);
  return res.json({ success: true, message: `Data warga "${deletedItem.nama}" berhasil dihapus.`, id: req.params.id });
});

// Default export for Vercel Serverless Function
export default app;
