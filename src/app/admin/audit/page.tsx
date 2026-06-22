import prisma from "@/lib/prisma"
import { getMyProfile } from "@/actions/auth"
import { redirect } from "next/navigation"

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

            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                            <th className="p-4 font-bold">Waktu</th>
                            <th className="p-4 font-bold">Pelaku (Staf)</th>
                            <th className="p-4 font-bold">Aksi / Tindakan</th>
                            <th className="p-4 font-bold">Keterangan Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-400 font-bold">
                                    Belum ada catatan aktivitas.
                                </td>
                            </tr>
                        ) : logs.map(log => (
                            <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-black text-sm">
                                <td className="p-4 whitespace-nowrap">
                                    {log.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                </td>
                                <td className="p-4 font-bold text-blue-600">
                                    {log.user?.name || log.user?.email || "Sistem / User Terhapus"}
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border 
                                        ${log.action.includes('DELETE') ? 'bg-red-100 text-red-700 border-red-200' : 
                                          log.action.includes('CREATE') ? 'bg-green-100 text-green-700 border-green-200' : 
                                          'bg-orange-100 text-orange-700 border-orange-200'}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600">
                                    {log.details}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
