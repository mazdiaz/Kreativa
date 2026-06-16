import { DataTable, PageHeader } from "@/components/dashboard";
import { mentoringSessions } from "@/lib/demo-data";

export default function MentorSessionsPage() {
  return (
    <>
      <PageHeader eyebrow="Mentor" title="Catatan Sesi Mentoring" description="Catatan sesi menjadi bukti pendampingan dan dasar tindak lanjut peserta." />
      <form className="card form-stack">
        <div>
          <label htmlFor="participant">Peserta</label>
          <input id="participant" name="participant" placeholder="Nama peserta" />
        </div>
        <div>
          <label htmlFor="topic">Topik</label>
          <input id="topic" name="topic" placeholder="Topik mentoring" />
        </div>
        <div>
          <label htmlFor="notes">Catatan</label>
          <textarea id="notes" name="notes" />
        </div>
        <button type="button">Simpan Catatan Demo</button>
      </form>
      <h2>Riwayat</h2>
      <DataTable headers={["Peserta", "Topik", "Catatan", "Tindak Lanjut"]} rows={mentoringSessions.map((item) => [item.participant, item.topic, item.notes, item.nextAction])} />
    </>
  );
}
