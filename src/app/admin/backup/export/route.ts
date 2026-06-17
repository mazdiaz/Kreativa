import { NextResponse } from "next/server";

import { getBackupData } from "@/lib/data";
import { currentUser } from "@/lib/session";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const data = await getBackupData();
  return NextResponse.json(data, {
    headers: {
      "Content-Disposition": `attachment; filename="backup-kreativa.json"`,
    },
  });
}
