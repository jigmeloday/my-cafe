import { getCurrentUser } from "@/lib/session";
import { registrationService } from "@/services/registration/registration.service";

/** The list of people registered for one of the signed-in owner's events, as a spreadsheet file. */
export async function GET(_request: Request, { params }: RouteContext<"/api/business/registrations/[id]/csv">) {
  const user = await getCurrentUser();
  if (!user || user.role !== "BUSINESS_OWNER") return new Response("Please log in with a business account.", { status: 401 });

  const { id } = await params;
  const file = await registrationService.csv(user.id, id);
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(file.body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${file.filename}"`,
      // Names and phone numbers: never kept by a shared cache.
      "Cache-Control": "private, no-store",
    },
  });
}
