import { prisma } from "@/lib/prisma";

export default async function LeadsPage() {
  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-slate-900">Inquiries &amp; Leads</h1>
      <p className="mt-1 text-sm text-slate-500">
        Submissions from the visitor gate and the contact form.
      </p>

      {inquiries.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
          No inquiries yet.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Reason / Message</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {inquiries.map((inq) => (
                <tr key={inq.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{inq.name}</td>
                  <td className="px-4 py-3 text-slate-600">{inq.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {inq.source}
                    </span>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-slate-600">
                    {[inq.reason, inq.message].filter(Boolean).join(" — ") || "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                    {inq.createdAt.toLocaleDateString()} {inq.createdAt.toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
