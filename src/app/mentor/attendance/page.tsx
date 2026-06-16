import { DataTable, PageHeader } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getAttendanceProgressData } from "@/lib/data";
import { recordAttendanceAction, updateProgressAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function MentorAttendancePage() {
  await requireRole(["MENTOR"]);
  const { attendances, modules, participants, progressRecords, schedules } = await getAttendanceProgressData();

  return (
    <>
      <PageHeader
        eyebrow="Mentor"
        title="Absensi dan Progres"
        description="Catat kehadiran peserta dan perkembangan modul sebagai bukti pelaksanaan pelatihan."
      />
      <div className="grid grid-2">
        <section>
          <h2>Catat Absensi</h2>
          <form className="card form-stack" action={recordAttendanceAction}>
            <label>
              Peserta
              <select name="participantId" required>
                {participants.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.user.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Jadwal
              <select name="scheduleId" required>
                {schedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.title} - {schedule.displayDate}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select name="status" defaultValue="PRESENT">
                <option value="PRESENT">PRESENT</option>
                <option value="EXCUSED">EXCUSED</option>
                <option value="ABSENT">ABSENT</option>
              </select>
            </label>
            <button type="submit">Simpan Absensi</button>
          </form>
        </section>
        <section>
          <h2>Update Progres</h2>
          <form className="card form-stack" action={updateProgressAction}>
            <label>
              Peserta
              <select name="participantId" required>
                {participants.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.user.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Modul
              <select name="moduleId" required>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title} - {module.programName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Penyelesaian (%)
              <input name="completion" type="number" min="0" max="100" required />
            </label>
            <label>
              Catatan
              <textarea name="notes" required maxLength={1000} />
            </label>
            <button type="submit">Simpan Progres</button>
          </form>
        </section>
      </div>
      <h2>Riwayat Absensi</h2>
      <DataTable
        headers={["Peserta", "Jadwal", "Status", "Tanggal Input"]}
        rows={attendances.map((item) => [item.participant, item.schedule, item.status, item.createdAt])}
      />
      <h2>Riwayat Progres</h2>
      <DataTable
        headers={["Peserta", "Modul", "Penyelesaian", "Catatan"]}
        rows={progressRecords.map((item) => [item.participant, item.module, `${item.completion}%`, item.notes])}
      />
    </>
  );
}
