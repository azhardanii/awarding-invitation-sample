"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, Building2, Award, Users, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAwardingStore } from "@/store/useAwardingStore";
import { DoubleBezelCard } from "@/components/ui/DoubleBezelCard";
import { EVENT_CONFIG } from "@/config/eventConfig";

const formSchema = z.object({
  nama: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  whatsapp: z.string().min(9, "Nomor WhatsApp tidak valid"),
  instansi: z.string().min(3, "Nama instansi/perusahaan harus diisi"),
  kategori: z.string().min(1, "Pilih salah satu kategori penghargaan"),
  jumlahTamu: z.number().min(1, "Minimal 1 tamu").max(5, "Maksimal 5 tamu pendamping"),
  catatan: z.string().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const SceneFormRegistration: React.FC = () => {
  const { formStep, setFormStep, formData, updateFormData, submitRegistration, setScene } =
    useAwardingStore();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: formData.nama,
      email: formData.email,
      whatsapp: formData.whatsapp,
      instansi: formData.instansi,
      kategori: formData.kategori || EVENT_CONFIG.categories[0].id,
      jumlahTamu: formData.jumlahTamu || 1,
      catatan: formData.catatan || "",
    },
  });

  const nextStep = async () => {
    if (formStep === 1) {
      const isValid = await trigger(["nama", "email", "whatsapp"]);
      if (isValid) {
        updateFormData(getValues());
        setFormStep(2);
      }
    } else if (formStep === 2) {
      const isValid = await trigger(["instansi", "kategori", "jumlahTamu"]);
      if (isValid) {
        updateFormData(getValues());
        setFormStep(3);
      }
    }
  };

  const prevStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    } else {
      setScene("cover");
    }
  };

  const onSubmit = (data: FormSchemaType) => {
    updateFormData(data);
    submitRegistration();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)", y: 20 }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)", y: -20 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="scene-container px-3 sm:px-6 py-6 sm:py-8 justify-center"
    >
      <div className="max-w-2xl w-full">
        {/* Wizard Header & Progress Dots */}
        <div className="mb-4 sm:mb-6 flex flex-col items-center gap-2 text-center">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold px-3 py-1 rounded-full border border-gold-500/20 bg-gold-500/5">
            Langkah {formStep} dari 3
          </span>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-gold-gradient font-light leading-tight text-balance">
            Formulir Konfirmasi Kehadiran
          </h2>

          {/* Progress Line */}
          <div className="flex items-center gap-2 sm:gap-3 w-40 sm:w-48 mt-1">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold transition-all duration-500 ${
                    formStep >= step
                      ? "bg-gold-500 text-black shadow-[0_0_12px_rgba(201,169,97,0.6)]"
                      : "bg-white/10 text-gray-400 border border-white/10"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`h-[2px] flex-1 transition-colors duration-500 ${
                      formStep > step ? "bg-gold-500" : "bg-white/10"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Double Bezel Glass Container */}
        <DoubleBezelCard innerClassName="p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <AnimatePresence mode="wait">
              {/* STEP 1: DATA DIRI */}
              {formStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="border-b border-gold-500/15 pb-2.5">
                    <h3 className="text-xs sm:text-sm font-semibold tracking-wider text-gold-300 uppercase flex items-center gap-2">
                      <User size={15} className="text-gold-400 shrink-0" />
                      <span>1. Data Diri Tamu Undangan</span>
                    </h3>
                  </div>

                  {/* Input Nama */}
                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-medium text-gray-300 tracking-wide block">
                      Nama Lengkap & Gelar *
                    </label>
                    <input
                      {...register("nama")}
                      type="text"
                      placeholder="Contoh: Dr. Ir. Budi Santoso, M.Sc."
                      className="w-full bg-black/50 border border-gold-500/20 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-foreground placeholder:text-gray-500 outline-none transition-all"
                    />
                    {errors.nama && (
                      <p className="text-red-400 text-[11px] mt-1">{errors.nama.message}</p>
                    )}
                  </div>

                  {/* Input Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-medium text-gray-300 tracking-wide flex items-center gap-1.5">
                      <Mail size={13} className="text-gold-400 shrink-0" />
                      <span>Alamat Email *</span>
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="email.resmi@instansi.go.id"
                      className="w-full bg-black/50 border border-gold-500/20 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-foreground placeholder:text-gray-500 outline-none transition-all"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-[11px] mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Input WhatsApp */}
                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-medium text-gray-300 tracking-wide flex items-center gap-1.5">
                      <Phone size={13} className="text-gold-400 shrink-0" />
                      <span>Nomor WhatsApp Aktif *</span>
                    </label>
                    <input
                      {...register("whatsapp")}
                      type="tel"
                      placeholder="081234567890"
                      className="w-full bg-black/50 border border-gold-500/20 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-foreground placeholder:text-gray-500 outline-none transition-all"
                    />
                    {errors.whatsapp && (
                      <p className="text-red-400 text-[11px] mt-1">{errors.whatsapp.message}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: INSTANSI & PENGHARGAAN */}
              {formStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="border-b border-gold-500/15 pb-2.5">
                    <h3 className="text-xs sm:text-sm font-semibold tracking-wider text-gold-300 uppercase flex items-center gap-2">
                      <Building2 size={15} className="text-gold-400 shrink-0" />
                      <span>2. Kehadiran & Instansi</span>
                    </h3>
                  </div>

                  {/* Input Instansi */}
                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-medium text-gray-300 tracking-wide block">
                      Nama Instansi / Perusahaan *
                    </label>
                    <input
                      {...register("instansi")}
                      type="text"
                      placeholder="Contoh: Kementerian Komunikasi & Digital RI"
                      className="w-full bg-black/50 border border-gold-500/20 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-foreground placeholder:text-gray-500 outline-none transition-all"
                    />
                    {errors.instansi && (
                      <p className="text-red-400 text-[11px] mt-1">{errors.instansi.message}</p>
                    )}
                  </div>

                  {/* Dropdown Kategori */}
                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-medium text-gray-300 tracking-wide flex items-center gap-1.5">
                      <Award size={13} className="text-gold-400 shrink-0" />
                      <span>Kategori Undangan *</span>
                    </label>
                    <select
                      {...register("kategori")}
                      className="w-full bg-black/80 border border-gold-500/20 focus:border-gold-400 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-foreground outline-none transition-all"
                    >
                      {EVENT_CONFIG.categories.map((cat) => (
                        <option key={cat.id} value={cat.name} className="bg-gray-900 text-white">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Input Jumlah Tamu */}
                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-medium text-gray-300 tracking-wide flex items-center gap-1.5">
                      <Users size={13} className="text-gold-400 shrink-0" />
                      <span>Jumlah Tamu Pendamping *</span>
                    </label>
                    <select
                      {...register("jumlahTamu", { valueAsNumber: true })}
                      className="w-full bg-black/80 border border-gold-500/20 focus:border-gold-400 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-foreground outline-none transition-all"
                    >
                      <option value={1} className="bg-gray-900 text-white">
                        1 Orang (Utama)
                      </option>
                      <option value={2} className="bg-gray-900 text-white">
                        2 Orang (+1 Pendamping VIP)
                      </option>
                      <option value={3} className="bg-gray-900 text-white">
                        3 Orang (+2 Pendamping VIP)
                      </option>
                    </select>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: REVIEW & CATATAN */}
              {formStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="border-b border-gold-500/15 pb-2.5">
                    <h3 className="text-xs sm:text-sm font-semibold tracking-wider text-gold-300 uppercase flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-gold-400 shrink-0" />
                      <span>3. Review Data & Konfirmasi</span>
                    </h3>
                  </div>

                  {/* Summary Card */}
                  <div className="p-3 sm:p-4 rounded-xl bg-gold-500/5 border border-gold-500/20 space-y-2 text-[11px] sm:text-xs">
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-gray-400">Nama Pendaftar:</span>
                      <span className="font-semibold text-gold-200 truncate ml-2 max-w-[180px]">
                        {getValues("nama")}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-gray-400">Instansi:</span>
                      <span className="font-semibold text-gray-200 truncate ml-2 max-w-[180px]">
                        {getValues("instansi")}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-gray-400">Kategori:</span>
                      <span className="font-semibold text-gold-300 truncate ml-2 max-w-[180px]">
                        {getValues("kategori")}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 font-mono">
                      <span className="text-gray-400">Nominal Konfirmasi:</span>
                      <span className="font-bold text-gold-400 text-xs sm:text-sm">
                        {EVENT_CONFIG.formattedNominal}
                      </span>
                    </div>
                  </div>

                  {/* Input Catatan Khusus */}
                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-medium text-gray-300 tracking-wide block">
                      Catatan Khusus (Opsional)
                    </label>
                    <textarea
                      {...register("catatan")}
                      rows={2}
                      placeholder="Contoh: Vegetarian meal / Akses kursi roda"
                      className="w-full bg-black/50 border border-gold-500/20 focus:border-gold-400 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-gray-500 outline-none transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Action Buttons */}
            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gold-500/15 gap-2">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] sm:text-xs font-medium text-gray-300 transition-all shrink-0"
              >
                <ArrowLeft size={13} />
                <span>{formStep === 1 ? "Kembali" : "Sebelumnya"}</span>
              </button>

              {formStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-gold-luxury flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs uppercase font-semibold shrink-0"
                >
                  <span>Step {formStep + 1}</span>
                  <ArrowRight size={13} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-gold-luxury flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs uppercase font-semibold shadow-gold-glow shrink-0"
                >
                  <span>Bayar QRIS</span>
                  <CheckCircle2 size={14} />
                </button>
              )}
            </div>
          </form>
        </DoubleBezelCard>
      </div>
    </motion.div>
  );
};
