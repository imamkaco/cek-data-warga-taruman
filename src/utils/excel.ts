import * as XLSX from 'xlsx';
import { Warga } from '../types/warga';

/**
 * Export data warga ke file Excel (.xlsx) dengan kolom yang rapi
 */
export function exportWargaToExcel(wargaList: Warga[], title: string = 'Laporan_Data_Warga_Desa_Taruman') {
  const formattedData = wargaList.map((item, index) => ({
    'No': index + 1,
    'Kecamatan': item.kecamatan,
    'Kelurahan/Desa': item.kelurahan,
    'Nama Lengkap': item.nama,
    'Tempat Lahir': item.tempat_lahir,
    'Usia': item.usia,
    'Jenis Kelamin': item.kelamin,
    'Alamat': item.alamat,
    'RT': item.rt,
    'RW': item.rw,
    'Status Validasi': item.valid,
    'NIK': item.nik || '-',
    'Pekerjaan': item.pekerjaan || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 15 }, // Kecamatan
    { wch: 15 }, // Kelurahan
    { wch: 28 }, // Nama
    { wch: 16 }, // Tempat Lahir
    { wch: 8 },  // Usia
    { wch: 14 }, // Kelamin
    { wch: 32 }, // Alamat
    { wch: 8 },  // RT
    { wch: 8 },  // RW
    { wch: 15 }, // Valid
    { wch: 20 }, // NIK
    { wch: 20 }, // Pekerjaan
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Warga');

  const todayStr = new Date().toISOString().slice(0, 10);
  const fullFileName = `${title}_${todayStr}.xlsx`;

  XLSX.writeFile(workbook, fullFileName);
}

/**
 * Generate dan unduh template file Excel untuk mempermudah admin input massal
 */
export function downloadWargaTemplateExcel() {
  const templateRows = [
    {
      'Kecamatan': 'Klambu',
      'Kelurahan': 'Taruman',
      'Nama': 'Contoh Warga Satu',
      'Tempat Lahir': 'Grobogan',
      'Usia': 35,
      'Kelamin': 'Laki-laki',
      'Alamat': 'Dusun Krajan RT 01 RW 01',
      'RT': '01',
      'RW': '01',
      'Valid': 'Valid',
      'NIK': '3315021234560001',
      'Pekerjaan': 'Petani',
    },
    {
      'Kecamatan': 'Klambu',
      'Kelurahan': 'Taruman',
      'Nama': 'Contoh Warga Dua',
      'Tempat Lahir': 'Demak',
      'Usia': 28,
      'Kelamin': 'Perempuan',
      'Alamat': 'Dusun Taruman Timur RT 02 RW 01',
      'RT': '02',
      'RW': '01',
      'Valid': 'Belum Valid',
      'NIK': '3315021234560002',
      'Pekerjaan': 'Wiraswasta',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateRows);
  worksheet['!cols'] = [
    { wch: 15 },
    { wch: 15 },
    { wch: 25 },
    { wch: 16 },
    { wch: 8 },
    { wch: 14 },
    { wch: 30 },
    { wch: 8 },
    { wch: 8 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Warga');
  XLSX.writeFile(workbook, 'Template_Data_Warga_Desa_Taruman.xlsx');
}

/**
 * Parse uploaded Excel / CSV file into Warga partial objects
 */
export async function parseWargaExcelFile(file: File): Promise<Partial<Warga>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        const mappedList: Partial<Warga>[] = rawJson.map((row) => {
          // Find fields with flexible case matching
          const getVal = (keys: string[]) => {
            for (const key of keys) {
              const foundKey = Object.keys(row).find(
                (k) => k.trim().toLowerCase() === key.toLowerCase()
              );
              if (foundKey && row[foundKey] !== undefined && row[foundKey] !== '') {
                return String(row[foundKey]).trim();
              }
            }
            return '';
          };

          const nama = getVal(['nama', 'nama lengkap', 'name']);
          const kecamatan = getVal(['kecamatan', 'kcamatan', 'distrik']) || 'Klambu';
          const kelurahan = getVal(['kelurahan', 'desa', 'kelurahan/desa']) || 'Taruman';
          const tempat_lahir = getVal(['tempat lahir', 'tempat_lahir', 'tempatlahir']) || 'Grobogan';
          const usiaStr = getVal(['usia', 'umur', 'age']);
          const kelaminStr = getVal(['kelamin', 'jenis kelamin', 'gender', 'jk']);
          const alamat = getVal(['alamat', 'domisili', 'alamat lengkap']);
          const rt = getVal(['rt', 'rukun tetangga']);
          const rw = getVal(['rw', 'rukun warga']);
          const validStr = getVal(['valid', 'status valid', 'status validasi', 'status']);
          const nik = getVal(['nik', 'no ktp', 'ktp']);
          const pekerjaan = getVal(['pekerjaan', 'profesi', 'job']);

          const kelamin: 'Laki-laki' | 'Perempuan' =
            kelaminStr.toLowerCase().startsWith('p') ||
            kelaminStr.toLowerCase().includes('wanita') ||
            kelaminStr.toLowerCase().includes('perempuan')
              ? 'Perempuan'
              : 'Laki-laki';

          const valid: 'Valid' | 'Belum Valid' =
            validStr.toLowerCase().includes('belum') ||
            validStr.toLowerCase().includes('tidak') ||
            validStr.toLowerCase().includes('invalid')
              ? 'Belum Valid'
              : 'Valid';

          return {
            nama: nama,
            kecamatan: kecamatan,
            kelurahan: kelurahan,
            tempat_lahir: tempat_lahir,
            usia: parseInt(usiaStr, 10) || 0,
            kelamin: kelamin,
            alamat: alamat || 'Desa Taruman',
            rt: rt ? rt.padStart(2, '0') : '01',
            rw: rw ? rw.padStart(2, '0') : '01',
            valid: valid,
            nik: nik || undefined,
            pekerjaan: pekerjaan || undefined,
          };
        }).filter((w) => w.nama && w.nama.length > 0);

        resolve(mappedList);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
