export interface AwardingCategory {
  id: string;
  name: string;
  description: string;
}

export interface EventConfig {
  eventName: string;
  organizer: string;
  subTitle: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  nominalPayment: number;
  formattedNominal: string;
  bankInfo: {
    qrisTitle: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  categories: AwardingCategory[];
}

export const EVENT_CONFIG: EventConfig = {
  eventName: "Malam Anugerah Inovasi Nusantara 2026",
  organizer: "Dewan Kehormatan Inovasi & Teknologi Indonesia",
  subTitle: "Penganugerahan Penghargaan Tahunan Insan & Instansi Berprestasi Indonesia",
  date: "Rabu, 28 Oktober 2026",
  time: "18:30 - 22:00 WIB",
  venue: "Grand Ballroom Hotel Indonesia Kempinski",
  city: "Jakarta Pusat",
  nominalPayment: 500000,
  formattedNominal: "Rp 500.000",
  bankInfo: {
    qrisTitle: "QRIS STATIS MAHAMERU AWARDING 2026",
    accountName: "Panitia Malam Anugerah Nusantara",
    accountNumber: "8820-9102-3918",
    bankName: "Bank Central Asia (BCA)",
  },
  categories: [
    {
      id: "tech_innovation",
      name: "Excellence in Digital Innovation",
      description: "Penghargaan untuk terobosan teknologi digital dan AI terbaik tahun 2026",
    },
    {
      id: "public_service",
      name: "Outstanding Public Leadership",
      description: "Penghargaan kepemimpinan dan pelayanan publik berintegritas tinggi",
    },
    {
      id: "sustainable_growth",
      name: "Sustainable Industry & Impact Award",
      description: "Penghargaan atas komitmen keberlanjutan dan dampak sosial positif",
    },
    {
      id: "corporate_excellence",
      name: "National Corporate Transformation",
      description: "Penghargaan transformasi ekosistem bisnis dan kapabilitas nasional",
    },
  ],
};
