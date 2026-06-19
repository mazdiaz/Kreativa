import { DataTable, PageHeader, getBadgeClass } from "@/components/dashboard";
import { requireRole } from "@/lib/authorization";
import { getParticipantPrograms } from "@/lib/data";
import { registerProgramAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function ParticipantProgramsPage() {
  const user = await requireRole(["PARTICIPANT"]);
  const { programs } = await getParticipantPrograms(user.id);

  return (
    <>
      <PageHeader
        eyebrow="Peserta"
        title="Daftar Program"
        description="Pilih program pelatihan atau inkubasi yang sesuai dengan minat dan potensi lokal."
      />
      <DataTable
        headers={["Program", "Tipe", "Periode", "Status Program", "Pendaftaran"]}
        rows={programs.map((program) => [
          program.name,
          program.type,
          program.period,
          program.status,
          program.registrationStatus ? (
            <span className={getBadgeClass(program.registrationStatus)} key={`${program.id}-status`}>{program.registrationStatus}</span>
          ) : (
            <form action={registerProgramAction} key={program.id}>
              <input type="hidden" name="programId" value={program.id} />
              <button type="submit">Daftar</button>
            </form>
          ),
        ])}
      />
    </>
  );
}
