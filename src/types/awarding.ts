export type SceneType = "preloader" | "cinematic" | "cover" | "form" | "ticket";

export type AttendanceStatus = "registered" | "attended";

export interface SubmissionData {
  id: string;
  nama: string;
  email: string;
  whatsapp: string;
  instansi: string;
  kategori: string;
  jumlahTamu: number;
  catatan?: string;
  status: AttendanceStatus;
  createdAt: string;
  attendedAt?: string | null;
  ticketCode: string;
  seatZone: string;
}

export interface FormDataInput {
  nama: string;
  email: string;
  whatsapp: string;
  instansi: string;
  kategori: string;
  jumlahTamu: number;
  catatan?: string;
}
