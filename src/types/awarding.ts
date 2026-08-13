export type SceneType = "preloader" | "cover" | "form" | "qris" | "ticket";

export type PaymentStatus = "pending" | "verified" | "rejected";

export interface SubmissionData {
  id: string;
  nama: string;
  email: string;
  whatsapp: string;
  instansi: string;
  kategori: string;
  jumlahTamu: number;
  catatan?: string;
  nominal: number;
  status: PaymentStatus;
  paymentMethod: "qris_static";
  buktiBayarUrl?: string;
  createdAt: string;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
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
