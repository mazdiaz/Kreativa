import { NextResponse } from "next/server";

import { getAdminParticipants, getAdminReportsData } from "@/lib/data";
import { currentUser } from "@/lib/session";

function csvValue(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function csvRow(values: unknown[]) {
  return values.map(csvValue).join(",");
}

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [participants, reports] = await Promise.all([getAdminParticipants(), getAdminReportsData()]);
  const rows = [
    csvRow(["Bagian", "Nama", "Detail 1", "Detail 2", "Status"]),
    ...reports.stats.map((item) => csvRow(["Statistik", item.label, item.value, item.detail, ""])),
    ...participants.map((item) => csvRow(["Peserta", item.name, item.program, `${item.progress}%`, item.status])),
    ...reports.businessIdeas.map((item) => csvRow(["Ide Usaha", item.title, item.participant, item.localPotential, item.status])),
    ...reports.products.map((item) => csvRow(["Produk", item.name, item.participant, item.category, "PUBLISHED"])),
  ];

  return new NextResponse(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="laporan-inklusi-karya.csv"`,
    },
  });
}
