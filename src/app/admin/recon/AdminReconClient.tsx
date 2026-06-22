'use client'

import { useState } from "react"

type Order = {
    id: string
    createdAt: Date
    status: string
    totalAmount: number
}

export default function AdminReconClient({ initialOrders }: { initialOrders: Order[] }) {
    // Fitur Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const totalPages = Math.ceil(initialOrders.length / itemsPerPage)
    const currentOrders = initialOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                        <th className="p-4 font-bold">Waktu Order</th>
                        <th className="p-4 font-bold">Order ID (Sama dengan Midtrans)</th>
                        <th className="p-4 font-bold">Status Pembayaran</th>
                        <th className="p-4 font-bold text-right">Nominal Uang</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-gray-400 font-bold">
                                Belum ada transaksi.
                            </td>
                        </tr>
                    ) : currentOrders.map(order => {
                        const isPaid = order.status !== 'PENDING' && order.status !== 'CANCELLED'
                        return (
                            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-black text-sm">
                                <td className="p-4">
                                    {new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                </td>
                                <td className="p-4 font-mono text-gray-600">
                                    {order.id}
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border 
                                        ${isPaid ? 'bg-green-100 text-green-700 border-green-200' : 
                                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 border-red-200' : 
                                          'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                        {isPaid ? 'BERHASIL' : order.status === 'CANCELLED' ? 'BATAL' : 'BELUM DIBAYAR'}
                                    </span>
                                </td>
                                <td className={`p-4 text-right font-bold font-mono ${isPaid ? 'text-green-600' : 'text-gray-400'}`}>
                                    Rp {order.totalAmount.toLocaleString('id-ID')}
                                </td>
                            </tr>
                        )
                    })}
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
