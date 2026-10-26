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

export interface WargaStats {
  total: number;
  valid: number;
  belumValid: number;
  lakiLaki: number;
  perempuan: number;
  rtList: string[];
  rwList: string[];
}

export interface WargaFilter {
  q: string;
  rt: string;
  rw: string;
  valid: string;
  kelamin: string;
}
