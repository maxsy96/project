import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getAllStudentInterests } from "@/lib/runtime-store";
import { csvEscape, fromJsonList, formatDateTime } from "@/lib/utils";

export async function GET() {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const students = (await getAllStudentInterests()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const header = ["Name", "Email", "Academic year", "Major", "Interests", "Opportunity preferences", "Preferred locations", "Created date"];
  const rows = students.map((student) => [
    student.fullName,
    student.email,
    student.academicYear,
    student.major,
    fromJsonList(student.interests).join("; "),
    fromJsonList(student.opportunityPreferences).join("; "),
    fromJsonList(student.preferredLocations).join("; "),
    formatDateTime(student.createdAt),
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=cavm-student-interests.csv",
    },
  });
}
