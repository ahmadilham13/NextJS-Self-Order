'use client'

import { useState } from "react"

type AuditLog = {
    id: string
    createdAt: Date
    action: string
    details: string
    user: { name: string | null, email: string } | null
}

export default function AdminAuditClient({ initialLogs }: { initialLogs: AuditLog[] }) {
    // Fitur Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const totalPages = Math.ceil(initialLogs.length / itemsPerPage)
    const currentLogs = initialLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
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
                    {currentLogs.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-gray-400 font-bold">
                                Belum ada catatan aktivitas.
                            </td>
                        </tr>
                    ) : currentLogs.map(log => (
                        <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-black text-sm">
                            <td className="p-4 whitespace-nowrap">
                                {new Date(log.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                            </td>
                            <td className="p-4 font-bold text-blue-600">
                                {log.user?.name || log.user?.email || "Sistem / User Terhapus"}
                            </td>
                            <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border 
                                    ${log.action.includes('DELETE') ? 'bg-red-100 text-red-700 border-red-200' : 
                                      log.action.includes('CREATE') || log.action.includes('ADD') ? 'bg-green-100 text-green-700 border-green-200' : 
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

            {/* Kontrol Pagination */}
            {totalPages > 1 && (
                <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                    <p className="text-sm text-gray-500 font-bold">Halaman {currentPage} dari {totalPages}</p>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-gray-100"
                        >
                            ← Sebelumnya
                        </button>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-gray-100"
                        >
                            Selanjutnya →
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
