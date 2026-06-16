import { PageHeader } from "@/components/dashboard";

export default function ParticipantAssessmentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Peserta"
        title="Asesmen Awal"
        description="Form ini menjadi dasar rekomendasi pelatihan. Pada MVP, isian ditampilkan sebagai rancangan alur sebelum disimpan ke Neon."
      />
      <form className="card form-stack">
        <div>
          <label htmlFor="skill">Keterampilan yang sudah dimiliki</label>
          <textarea id="skill" name="skill" placeholder="Contoh: menjahit dasar, memasak, desain sederhana" />
        </div>
        <div>
          <label htmlFor="interest">Minat pelatihan</label>
          <select id="interest" name="interest">
            <option>Kriya kreatif</option>
            <option>Kuliner lokal</option>
            <option>Pemasaran digital</option>
          </select>
        </div>
        <div>
          <label htmlFor="accessibility">Kebutuhan aksesibilitas</label>
          <textarea id="accessibility" name="accessibility" placeholder="Contoh: navigasi keyboard, teks lebih besar, instruksi visual" />
        </div>
        <button type="button">Simpan Asesmen Demo</button>
      </form>
    </>
  );
}
