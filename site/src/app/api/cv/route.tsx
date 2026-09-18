import { renderToBuffer } from "@react-pdf/renderer";
import { getPublicData } from "@/lib/publicData";
import { CvDocument } from "@/lib/pdf/CvDocument";

export const runtime = "nodejs";

export async function GET() {
  const data = await getPublicData();
  const buffer = await renderToBuffer(<CvDocument data={data} />);

  const fileName = `${(data.profile.name || "cv").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-cv.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
