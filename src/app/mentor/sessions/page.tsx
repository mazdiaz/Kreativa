import { DataTable, PageHeader } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getAdminParticipants, getMentorDashboardData } from "@/lib/data";
import { createMentoringSessionAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function MentorSessionsPage() {
  const user = await requireRole(["MENTOR"]);
  const [participants, { sessions }] = await Promise.all([getAdminParticipants(), getMentorDashboardData(user.id)]);

  return (
    <>
      <PageHeader eyebrow="Mentor" title="Catatan Sesi Mentoring" description="Catatan sesi menjadi bukti pendampingan dan dasar tindak lanjut peserta." />
      <form className="card form-stack" action={createMentoringSessionAction}>
        <div>
          <label htmlFor="participant">Peserta</label>
          <select id="participant" name="participantId" required>
            {participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="topic">Topik</label>
          <input id="topic" name="topic" required maxLength={255} placeholder="Topik mentoring" />
        </div>
        <div>
          <label htmlFor="notes">Catatan</label>
          <textarea id="notes" name="notes" required maxLength={1000} />
        </div>
        <div>
          <label htmlFor="nextAction">Tindak lanjut</label>
          <textarea id="nextAction" name="nextAction" required maxLength={500} />
        </div>
        <button type="submit">Simpan Catatan</button>
      </form>
      <h2>Riwayat</h2>
      <DataTable headers={["Peserta", "Topik", "Catatan", "Tindak Lanjut"]} rows={sessions.map((item) => [item.participant, item.topic, item.notes, item.nextAction])} />
    </>
  );
}
