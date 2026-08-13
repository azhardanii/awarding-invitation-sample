import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { SubmissionData, AttendanceStatus } from "@/types/awarding";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForAwardingPrototype2026",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "awarding-prototype.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "awarding-prototype",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "awarding-prototype.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// LOCAL SYNCHRONIZER LAYER FOR SEAMLESS PROTOTYPE REAL-TIME VERIFICATION
const LOCAL_STORAGE_KEY = "awarding_submissions_db";
const BROADCAST_CHANNEL_NAME = "awarding_realtime_sync";

// Helper to get initial demo submissions if storage is empty
export const getInitialDemoSubmissions = (): SubmissionData[] => {
  return [
    {
      id: "SUB-2026-8812",
      nama: "Dr. Ir. Hendra Kusuma, M.Sc.",
      email: "hendra.kusuma@inovasi.go.id",
      whatsapp: "081298765432",
      instansi: "Badan Riset & Inovasi Nasional",
      kategori: "Excellence in Digital Innovation",
      jumlahTamu: 1,
      catatan: "Mohon konfirmasi meja VIP Utama dekat panggung.",
      status: "registered",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      ticketCode: "TKT-8812-BRIN",
      seatZone: "VIP Zone Alpha - Row A1",
    },
    {
      id: "SUB-2026-9043",
      nama: "Siti Rahmawati, S.T., M.B.A.",
      email: "siti.rahmawati@telkom-tech.co.id",
      whatsapp: "085678901234",
      instansi: "PT Telkom Teknologi Nusantara",
      kategori: "National Corporate Transformation",
      jumlahTamu: 2,
      catatan: "Perlu akses wusata/pembicara.",
      status: "attended",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      attendedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      ticketCode: "TKT-9043-TELKOM",
      seatZone: "VIP Zone Gold - Row B4",
    },
    {
      id: "SUB-2026-7721",
      nama: "Prof. Dr. Ahmad Fadillah",
      email: "ahmad.fadillah@ugm.ac.id",
      whatsapp: "081377889900",
      instansi: "Universitas Gadjah Mada",
      kategori: "Outstanding Public Leadership",
      jumlahTamu: 1,
      status: "registered",
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      ticketCode: "TKT-7721-UGM",
      seatZone: "VIP Zone Alpha - Row A3",
    },
    {
      id: "SUB-2026-6554",
      nama: "Dewi Kartika Sari, M.M.",
      email: "dewi.kartika@pertamina.com",
      whatsapp: "085299112233",
      instansi: "PT Pertamina (Persero)",
      kategori: "Sustainable Industry & Impact Award",
      jumlahTamu: 3,
      catatan: "Delegasi lengkap termasuk Direktur Utama.",
      status: "registered",
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      ticketCode: "TKT-6554-PTMN",
      seatZone: "VIP Zone Gold - Row B1",
    },
  ];
};

// Retrieve all submissions from LocalStorage fallback
export const getLocalSubmissions = (): SubmissionData[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialDemoSubmissions();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading local submissions", e);
    return getInitialDemoSubmissions();
  }
};

// Save a new submission
export const saveLocalSubmission = (submission: SubmissionData): void => {
  if (typeof window === "undefined") return;
  const current = getLocalSubmissions();
  const updated = [submission, ...current.filter((item) => item.id !== submission.id)];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  notifySync({ type: "UPSERT", data: submission });
};

// Update attendance status
export const updateAttendanceStatus = (
  id: string,
  status: AttendanceStatus
): SubmissionData | null => {
  if (typeof window === "undefined") return null;
  const current = getLocalSubmissions();
  let updatedDoc: SubmissionData | null = null;
  const nextList = current.map((item) => {
    if (item.id === id) {
      updatedDoc = {
        ...item,
        status,
        attendedAt: status === "attended" ? new Date().toISOString() : item.attendedAt,
      };
      return updatedDoc;
    }
    return item;
  });

  if (updatedDoc) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextList));
    notifySync({ type: "STATUS_UPDATE", id, status, updatedDoc });
  }
  return updatedDoc;
};

// Lookup submission by ticket code (for QR scanner)
export const getSubmissionByTicketCode = (ticketCode: string): SubmissionData | null => {
  const submissions = getLocalSubmissions();
  return submissions.find((s) => s.ticketCode === ticketCode) || null;
};

// Broadcast channel sync helper
interface SyncPayload {
  type: "UPSERT" | "STATUS_UPDATE";
  id?: string;
  status?: AttendanceStatus;
  data?: SubmissionData;
  updatedDoc?: SubmissionData;
}

const notifySync = (payload: SyncPayload) => {
  if (typeof window === "undefined") return;
  try {
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage(payload);
      channel.close();
    }
    window.dispatchEvent(new CustomEvent("awarding_sync_event", { detail: payload }));
  } catch (e) {
    console.error("Error broadcasting sync event", e);
  }
};

// Subscribe to real-time changes for a specific submission ID
export const subscribeToSubmission = (
  submissionId: string,
  onUpdate: (data: SubmissionData) => void
) => {
  if (typeof window === "undefined") return () => {};

  const current = getLocalSubmissions();
  const found = current.find((s) => s.id === submissionId);
  if (found) {
    onUpdate(found);
  }

  const handleMessage = (event: MessageEvent) => {
    if (event.data && (event.data.id === submissionId || event.data.data?.id === submissionId)) {
      const updated = getLocalSubmissions().find((s) => s.id === submissionId);
      if (updated) onUpdate(updated);
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_KEY) {
      const updated = getLocalSubmissions().find((s) => s.id === submissionId);
      if (updated) onUpdate(updated);
    }
  };

  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<SyncPayload>;
    if (customEvent.detail && (customEvent.detail.id === submissionId || customEvent.detail.data?.id === submissionId)) {
      const updated = getLocalSubmissions().find((s) => s.id === submissionId);
      if (updated) onUpdate(updated);
    }
  };

  let channel: BroadcastChannel | null = null;
  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    channel.onmessage = handleMessage;
  }

  window.addEventListener("storage", handleStorageEvent);
  window.addEventListener("awarding_sync_event", handleCustomEvent);

  return () => {
    if (channel) channel.close();
    window.removeEventListener("storage", handleStorageEvent);
    window.removeEventListener("awarding_sync_event", handleCustomEvent);
  };
};

// Subscribe to all submissions (used on Admin Dashboard)
export const subscribeToAllSubmissions = (onUpdate: (data: SubmissionData[]) => void) => {
  if (typeof window === "undefined") return () => {};

  onUpdate(getLocalSubmissions());

  const handleUpdate = () => {
    onUpdate(getLocalSubmissions());
  };

  let channel: BroadcastChannel | null = null;
  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    channel.onmessage = handleUpdate;
  }

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_KEY) handleUpdate();
  };

  window.addEventListener("storage", handleStorageEvent);
  window.addEventListener("awarding_sync_event", handleUpdate);

  return () => {
    if (channel) channel.close();
    window.removeEventListener("storage", handleStorageEvent);
    window.removeEventListener("awarding_sync_event", handleUpdate);
  };
};
