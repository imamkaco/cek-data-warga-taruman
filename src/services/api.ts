import { Warga, WargaFilter, WargaStats } from '../types/warga';

const TOKEN_KEY = 'taruman_admin_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string, persist: boolean = true) {
  if (persist) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getAdminToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function loginAdmin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setAdminToken(data.token, true);
      return { success: true, token: data.token };
    }
    return { success: false, error: data.error || 'Password admin salah' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal terhubung ke server' };
  }
}

export async function verifyAdminSession(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;
  try {
    const res = await fetch('/api/admin/verify', {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!data.authenticated) {
      clearAdminToken();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function fetchWargaList(filter?: Partial<WargaFilter>): Promise<Warga[]> {
  const params = new URLSearchParams();
  if (filter?.q) params.set('q', filter.q);
  if (filter?.rt && filter.rt !== 'ALL') params.set('rt', filter.rt);
  if (filter?.rw && filter.rw !== 'ALL') params.set('rw', filter.rw);
  if (filter?.valid && filter.valid !== 'ALL') params.set('valid', filter.valid);
  if (filter?.kelamin && filter.kelamin !== 'ALL') params.set('kelamin', filter.kelamin);

  const res = await fetch(`/api/warga?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Gagal mengambil data warga');
  }
  return res.json();
}

export async function fetchWargaById(id: string): Promise<Warga> {
  const res = await fetch(`/api/warga/${id}`);
  if (!res.ok) {
    throw new Error('Data warga tidak ditemukan');
  }
  return res.json();
}

export async function fetchStats(): Promise<WargaStats> {
  const res = await fetch('/api/stats');
  if (!res.ok) {
    throw new Error('Gagal mengambil statistik warga');
  }
  return res.json();
}

export async function createWarga(wargaData: Partial<Warga>): Promise<Warga> {
  const res = await fetch('/api/warga', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(wargaData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal menambahkan data warga');
  }
  const result = await res.json();
  return result.data;
}

export async function updateWarga(id: string, wargaData: Partial<Warga>): Promise<Warga> {
  const res = await fetch(`/api/warga/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(wargaData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal memperbarui data warga');
  }
  const result = await res.json();
  return result.data;
}

export async function toggleValidStatus(id: string): Promise<Warga> {
  const res = await fetch(`/api/warga/${id}/toggle-valid`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal mengubah status validasi');
  }
  const result = await res.json();
  return result.data;
}

export async function deleteWarga(id: string): Promise<boolean> {
  const res = await fetch(`/api/warga/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal menghapus data warga');
  }
  return true;
}

export async function batchImportWarga(items: Partial<Warga>[]): Promise<number> {
  const res = await fetch('/api/warga/batch-import', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ items }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal mengimpor data warga');
  }
  const result = await res.json();
  return result.count;
}
