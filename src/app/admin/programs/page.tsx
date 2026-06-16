import { DataTable, PageHeader } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getProgramManagementData } from "@/lib/data";
import { createModuleAction, createProgramAction, createScheduleAction, deleteProgramAction, updateProgramAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProgramsPage() {
  await requireRole(["ADMIN"]);
  const { modules, programs, schedules } = await getProgramManagementData();

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Program, Modul, dan Jadwal"
        description="Kelola data operasional inti yang tersimpan di Neon."
      />
      <h2>Tambah Program</h2>
      <form className="card form-stack" action={createProgramAction}>
        <div className="grid grid-2">
          <div>
            <label htmlFor="program-name">Nama program</label>
            <input id="program-name" name="name" required maxLength={255} />
          </div>
          <div>
            <label htmlFor="program-type">Tipe</label>
            <input id="program-type" name="type" required maxLength={80} placeholder="Vokasional / Inkubasi" />
          </div>
          <div>
            <label htmlFor="program-period">Periode</label>
            <input id="program-period" name="period" required maxLength={80} placeholder="2026-Q3" />
          </div>
          <div>
            <label htmlFor="program-status">Status</label>
            <select id="program-status" name="status" defaultValue="OPEN">
              <option value="OPEN">OPEN</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="program-description">Deskripsi</label>
          <textarea id="program-description" name="description" required maxLength={1000} />
        </div>
        <button type="submit">Simpan Program</button>
      </form>
      <h2>Program</h2>
      <DataTable
        headers={["Nama", "Tipe", "Periode", "Status", "Kelola"]}
        rows={programs.map((program) => [
          program.name,
          program.type,
          program.period,
          program.status,
          <details key={program.id}>
            <summary>Ubah</summary>
            <form className="form-stack" action={updateProgramAction}>
              <input type="hidden" name="id" value={program.id} />
              <label>
                Nama
                <input name="name" defaultValue={program.name} required maxLength={255} />
              </label>
              <label>
                Tipe
                <input name="type" defaultValue={program.type} required maxLength={80} />
              </label>
              <label>
                Periode
                <input name="period" defaultValue={program.period} required maxLength={80} />
              </label>
              <label>
                Status
                <select name="status" defaultValue={program.status}>
                  <option value="OPEN">OPEN</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </label>
              <label>
                Deskripsi
                <textarea name="description" defaultValue={program.description} required maxLength={1000} />
              </label>
              <button type="submit">Update</button>
            </form>
            <form action={deleteProgramAction}>
              <input type="hidden" name="id" value={program.id} />
              <button type="submit">Hapus</button>
            </form>
          </details>,
        ])}
      />
      <h2>Tambah Modul</h2>
      <form className="card form-stack" action={createModuleAction}>
        <div>
          <label htmlFor="module-program">Program</label>
          <select id="module-program" name="programId" required>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="module-title">Judul modul</label>
          <input id="module-title" name="title" required maxLength={255} />
        </div>
        <div>
          <label htmlFor="module-description">Deskripsi</label>
          <textarea id="module-description" name="description" required maxLength={1000} />
        </div>
        <div>
          <label htmlFor="module-url">URL materi</label>
          <input id="module-url" name="materialUrl" type="url" maxLength={500} />
        </div>
        <button type="submit">Simpan Modul</button>
      </form>
      <h2>Modul</h2>
      <DataTable headers={["Modul", "Program", "Deskripsi"]} rows={modules.map((item) => [item.title, item.programName, item.description])} />
      <h2>Tambah Jadwal</h2>
      <form className="card form-stack" action={createScheduleAction}>
        <div>
          <label htmlFor="schedule-program">Program</label>
          <select id="schedule-program" name="programId" required>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-2">
          <div>
            <label htmlFor="schedule-title">Judul kegiatan</label>
            <input id="schedule-title" name="title" required maxLength={255} />
          </div>
          <div>
            <label htmlFor="schedule-date">Tanggal</label>
            <input id="schedule-date" name="date" type="datetime-local" required />
          </div>
        </div>
        <div>
          <label htmlFor="schedule-location">Lokasi</label>
          <input id="schedule-location" name="location" required maxLength={255} />
        </div>
        <button type="submit">Simpan Jadwal</button>
      </form>
      <h2>Jadwal</h2>
      <DataTable headers={["Judul", "Program", "Tanggal", "Lokasi"]} rows={schedules.map((item) => [item.title, item.programName, item.displayDate, item.location])} />
    </>
  );
}
