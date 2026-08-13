import { create } from "zustand";
import { SceneType, FormDataInput, SubmissionData } from "@/types/awarding";
import { EVENT_CONFIG } from "@/config/eventConfig";
import { saveLocalSubmission } from "@/lib/firebase";

interface AwardingStore {
  currentScene: SceneType;
  formStep: number;
  soundEnabled: boolean;
  musicStarted: boolean;
  formData: FormDataInput;
  activeSubmission: SubmissionData | null;

  // Actions
  setScene: (scene: SceneType) => void;
  setFormStep: (step: number) => void;
  toggleSound: () => void;
  startMusic: () => void;
  updateFormData: (data: Partial<FormDataInput>) => void;
  submitRegistration: () => SubmissionData;
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
  soundEnabled: true,
  musicStarted: false,
  formData: initialFormData,
  activeSubmission: null,

  setScene: (scene) => set({ currentScene: scene }),
  setFormStep: (step) => set({ formStep: step }),

  toggleSound: () => {
    const { soundEnabled } = get();
    const next = !soundEnabled;
    set({ soundEnabled: next });

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
      instansi: formData.instansi || "Instansi / Lembaga",
      kategori: formData.kategori || EVENT_CONFIG.categories[0].name,
      jumlahTamu: Number(formData.jumlahTamu) || 1,
      catatan: formData.catatan || "",
      status: "registered",
      createdAt: new Date().toISOString(),
      ticketCode,
      seatZone: "VIP Royal Zone - Row A",
    };

    saveLocalSubmission(newSubmission);
    // Skip QRIS → go directly to ticket
    set({ activeSubmission: newSubmission, currentScene: "ticket" });
    return newSubmission;
  },

  loadSubmissionById: (id) => {
    const { activeSubmission } = get();
    if (activeSubmission && activeSubmission.id === id) return;
  },

  resetForm: () =>
    set({
      currentScene: "cover",
      formStep: 1,
      formData: initialFormData,
      activeSubmission: null,
    }),
}));
