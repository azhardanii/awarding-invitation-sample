import { create } from "zustand";
import { SceneType, FormDataInput, SubmissionData, PaymentStatus } from "@/types/awarding";
import { EVENT_CONFIG } from "@/config/eventConfig";
import { saveLocalSubmission, updateLocalSubmissionStatus } from "@/lib/firebase";

interface AwardingStore {
  currentScene: SceneType;
  formStep: number;
  soundEnabled: boolean;
  musicStarted: boolean;          // tracks whether jazz has been triggered at least once
  formData: FormDataInput;
  activeSubmission: SubmissionData | null;

  // Actions
  setScene: (scene: SceneType) => void;
  setFormStep: (step: number) => void;
  toggleSound: () => void;
  startMusic: () => void;         // called when user clicks "Buka Undangan"
  updateFormData: (data: Partial<FormDataInput>) => void;
  submitRegistration: () => SubmissionData;
  uploadPaymentProof: (buktiUrl: string) => void;
  setActiveSubmissionStatus: (status: PaymentStatus) => void;
  loadSubmissionById: (id: string) => void;
  resetForm: () => void;
}

const initialFormData: FormDataInput = {
  nama: "",
  email: "",
  whatsapp: "",
  instansi: "",
  kategori: EVENT_CONFIG.categories[0].id,
  jumlahTamu: 1,
  catatan: "",
};

export const useAwardingStore = create<AwardingStore>((set, get) => ({
  currentScene: "preloader",
  formStep: 1,
  soundEnabled: true,   // default ON — music auto-starts on "Buka Undangan"
  musicStarted: false,
  formData: initialFormData,
  activeSubmission: null,

  setScene: (scene) => set({ currentScene: scene }),
  setFormStep: (step) => set({ formStep: step }),

  toggleSound: () => {
    const { soundEnabled } = get();
    const next = !soundEnabled;
    set({ soundEnabled: next });

    // Control audio manager
    if (typeof window !== "undefined") {
      import("@/lib/audioManager").then(({ getAudioManager }) => {
        const am = getAudioManager();
        if (next) {
          am.play();
        } else {
          am.pause();
        }
      });
    }
  },

  startMusic: () => {
    const { musicStarted, soundEnabled } = get();
    // Only auto-start if sound is enabled (default true) and hasn't started yet
    if (!musicStarted && soundEnabled) {
      set({ musicStarted: true });
      if (typeof window !== "undefined") {
        import("@/lib/audioManager").then(({ getAudioManager }) => {
          getAudioManager().play();
        });
      }
    }
  },

  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  submitRegistration: () => {
    const { formData } = get();
    const idNum = Math.floor(1000 + Math.random() * 9000);
    const submissionId = `SUB-2026-${idNum}`;
    const ticketCode = `TKT-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newSubmission: SubmissionData = {
      id: submissionId,
      nama: formData.nama || "Tamu VIP",
      email: formData.email || "tamu@example.com",
      whatsapp: formData.whatsapp || "08123456789",
      instansi: formData.instansi || "Instansi / Lembaga Mitranegara",
      kategori: formData.kategori || EVENT_CONFIG.categories[0].name,
      jumlahTamu: Number(formData.jumlahTamu) || 1,
      catatan: formData.catatan || "",
      nominal: EVENT_CONFIG.nominalPayment,
      status: "pending",
      paymentMethod: "qris_static",
      createdAt: new Date().toISOString(),
      ticketCode,
      seatZone: "VIP Royal Zone - Row A",
    };

    saveLocalSubmission(newSubmission);
    set({ activeSubmission: newSubmission, currentScene: "qris" });
    return newSubmission;
  },

  uploadPaymentProof: (buktiUrl) => {
    const { activeSubmission } = get();
    if (!activeSubmission) return;

    const updated: SubmissionData = {
      ...activeSubmission,
      buktiBayarUrl: buktiUrl,
    };

    saveLocalSubmission(updated);
    set({ activeSubmission: updated });
  },

  setActiveSubmissionStatus: (status) => {
    const { activeSubmission } = get();
    if (!activeSubmission) return;

    const updated = updateLocalSubmissionStatus(activeSubmission.id, status);
    if (updated) {
      set({ activeSubmission: updated });
    }
  },

  loadSubmissionById: (id) => {
    const { activeSubmission } = get();
    if (activeSubmission && activeSubmission.id === id) return;
    // Handled dynamically via firebase sync listener
  },

  resetForm: () =>
    set({
      currentScene: "cover",
      formStep: 1,
      formData: initialFormData,
      activeSubmission: null,
    }),
}));
