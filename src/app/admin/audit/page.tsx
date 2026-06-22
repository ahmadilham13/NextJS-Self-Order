import prisma from "@/lib/prisma"
import { getMyProfile } from "@/actions/auth"
import { redirect } from "next/navigation"
import AdminAuditClient from "./AdminAuditClient"

export default async function AuditLogPage() {
    // Keamanan Ganda (Double Check)
    const profile = await getMyProfile()
    if (!profile || profile.role !== 'ADMIN') redirect('/')

    // Ambil data Audit dari Database
    const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true },
        take: 100 // Ambil 100 log terbaru saja agar tidak berat
    })

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-800">🕵️ Buku Catatan Audit Log</h2>
                <p className="text-gray-500 mt-2">Mata-matai setiap perubahan yang terjadi di dalam sistem Backoffice.</p>
            </div>

            <AdminAuditClient initialLogs={logs} />
        </div>
    )
}
