import { DataTable, PageHeader } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { formatDate, getAdminParticipants, getAdminRegistrations } from "@/lib/data";
import { createParticipantAction, deleteParticipantAction, updateParticipantAction, updateRegistrationStatusAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminParticipantsPage() {
  await requireRole(["ADMIN"]);
  const [participants, registrations] = await Promise.all([getAdminParticipants(), getAdminRegistrations()]);

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Manajemen Peserta"
        description="Daftar peserta, kebutuhan aksesibilitas, potensi lokal, dan status pelatihan."
      />
      <h2>Tambah Peserta</h2>
      <form className="card form-stack" action={createParticipantAction}>
        <div className="grid grid-2">
          <label>
            Nama
            <input name="name" required maxLength={255} />
          </label>
          <label>
            Email
            <input name="email" type="email" required maxLength={255} />
          </label>
          <label>
            Alamat
            <input name="address" required maxLength={500} />
          </label>
          <label>
            Status akun
            <select name="status" defaultValue="ACTIVE">
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>
        </div>
        <label>
          Kebutuhan aksesibilitas
          <textarea name="disabilityNeed" required maxLength={500} />
        </label>
        <label>
          Potensi lokal
          <textarea name="localPotential" required maxLength={500} />
        </label>
        <label className="checkbox-row">
          <input name="consentStatus" type="checkbox" />
          Peserta menyetujui penggunaan data untuk kebutuhan program
        </label>
        <p className="form-note">Kredensial awal peserta dikelola oleh administrator program.</p>
        <button type="submit">Simpan Peserta</button>
      </form>
      <h2>Daftar Peserta</h2>
      <DataTable
        headers={["Nama", "Email", "Program", "Progres", "Status", "Kelola"]}
        rows={participants.map((item) => [
          item.name,
          item.email,
          item.program,
          `${item.progress}%`,
          <span className="badge" key={`${item.id}-status`}>{item.userStatus}</span>,
          <details key={item.id}>
            <summary>Ubah</summary>
            <form className="form-stack" action={updateParticipantAction}>
              <input type="hidden" name="userId" value={item.userId} />
              <input type="hidden" name="profileId" value={item.id} />
              <label>
                Nama
                <input name="name" defaultValue={item.name} required maxLength={255} />
              </label>
              <label>
                Email
                <input name="email" type="email" defaultValue={item.email} required maxLength={255} />
              </label>
              <label>
                Alamat
                <input name="address" defaultValue={item.address} required maxLength={500} />
              </label>
              <label>
                Kebutuhan aksesibilitas
                <textarea name="disabilityNeed" defaultValue={item.disabilityNeed} required maxLength={500} />
              </label>
              <label>
                Potensi lokal
                <textarea name="localPotential" defaultValue={item.localPotential} required maxLength={500} />
              </label>
              <label>
                Status akun
                <select name="status" defaultValue={item.userStatus}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </label>
              <label className="checkbox-row">
                <input name="consentStatus" type="checkbox" defaultChecked={item.consentStatus} />
                Persetujuan data aktif
              </label>
              <button type="submit">Update Peserta</button>
            </form>
            <form action={deleteParticipantAction}>
              <input type="hidden" name="userId" value={item.userId} />
              <button className="danger" type="submit">Hapus Peserta</button>
            </form>
          </details>,
        ])}
      />
      <h2>Pendaftaran Program</h2>
      <DataTable
        headers={["Peserta", "Program", "Tanggal", "Status", "Validasi"]}
        rows={registrations.map((item) => [
          item.participant.user.name,
          item.program.name,
          formatDate(item.createdAt),
          <span className="badge" key={`${item.id}-status`}>{item.status}</span>,
          <form className="inline-form" action={updateRegistrationStatusAction} key={item.id}>
            <input type="hidden" name="registrationId" value={item.id} />
            <select name="status" defaultValue={item.status} aria-label={`Status ${item.participant.user.name}`}>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <button type="submit">Simpan</button>
          </form>,
        ])}
      />
    </>
  );
}
