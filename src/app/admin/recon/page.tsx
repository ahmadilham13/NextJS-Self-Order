import prisma from "@/lib/prisma"
import { getMyProfile } from "@/actions/auth"
import { redirect } from "next/navigation"

export default async function ReconPage() {
    const profile = await getMyProfile()
    if (!profile || profile.role !== 'ADMIN') redirect('/')

    // Mengambil semua pesanan untuk dicocokkan dengan uang yang masuk ke Midtrans
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-800">💰 Rekonsiliasi Midtrans</h2>
                <p className="text-gray-500 mt-2">Gunakan halaman ini untuk mencocokkan uang yang tercatat di database dengan uang yang ada di rekening Midtrans kamu.</p>
            </div>

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
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-400 font-bold">
                                    Belum ada transaksi.
                                </td>
                            </tr>
                        ) : orders.map(order => {
                            const isPaid = order.status !== 'PENDING' && order.status !== 'CANCELLED'
                            return (
                                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-black text-sm">
                                    <td className="p-4">
                                        {order.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
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
            </div>
        </div>
    )
}
