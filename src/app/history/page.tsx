import { getMyProfile } from "@/actions/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function HistoryPage() {
    // 1. Dapatkan profil pelanggan yang sedang login
    const profile = await getMyProfile()
    
    // Jika ternyata belum login tapi memaksa masuk ke /history, usir ke beranda
    if (!profile) {
        redirect('/')
    }

    // 2. Tarik data pesanan KHUSUS milik pelanggan ini dari database
    const orders = await prisma.order.findMany({
        where: { userId: profile.id }, // KUNCI RAHASIA: Cari yang userId-nya sama dengan profil
        orderBy: { createdAt: 'desc' }, // Urutkan dari pesanan terbaru
        include: {
            items: {
                include: { menu: true } // Tarik sekalian data makanan di dalamnya
            }
        }
    })

    // Fungsi kecil untuk memberi warna Badge berdasarkan status
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
            case 'COOKING': return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
            case 'READY': return 'bg-green-500/20 text-green-400 border-green-500/50'
            case 'COMPLETED': return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
            case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/50'
            default: return 'bg-gray-800 text-gray-400'
        }
    }

    // Fungsi kecil untuk menerjemahkan status ke Bahasa Indonesia
    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Menunggu Pembayaran'
            case 'COOKING': return 'Sedang Dimasak'
            case 'READY': return 'Siap Diambil'
            case 'COMPLETED': return 'Selesai'
            case 'CANCELLED': return 'Dibatalkan'
            default: return status
        }
    }

    return (
        <main className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Halaman */}
                <div className="flex justify-between items-center mb-10 border-b border-gray-700 pb-6">
                    <div>
                        <h1 className="text-4xl font-black text-yellow-400 tracking-wider">📜 RIWAYAT PESANAN</h1>
                        <p className="text-gray-400 mt-2">Daftar semua transaksi yang pernah kamu lakukan.</p>
                    </div>
                    <Link href="/" className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-full font-bold border border-gray-600 transition-colors">
                        Kembali ke Menu
                    </Link>
                </div>

                {/* Tampilan Jika Belum Pernah Memesan */}
                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800/50 rounded-3xl border border-gray-700">
                        <p className="text-6xl mb-4">🍽️</p>
                        <h2 className="text-2xl font-bold text-gray-300">Kamu belum pernah memesan apapun.</h2>
                        <p className="text-gray-500 mt-2">Ayo pesan makanan lezat pertamamu sekarang!</p>
                    </div>
                ) : (
                    /* Daftar Pesanan */
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-gray-800 border border-gray-700 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
                                {/* Kepala Kartu (ID & Status) */}
                                <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-700">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="text-gray-400 text-sm">
                                                Tanggal: {order.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                            </p>
                                            
                                            {/* --- Indikator LUNAS / BELUM BAYAR --- */}
                                            {order.status === 'PENDING' && (
                                                <span className="bg-yellow-500 text-black text-xs font-black px-2 py-1 rounded-md tracking-wider">BELUM BAYAR</span>
                                            )}
                                            {order.status !== 'PENDING' && order.status !== 'CANCELLED' && (
                                                <span className="bg-green-500 text-black text-xs font-black px-2 py-1 rounded-md tracking-wider">LUNAS</span>
                                            )}
                                            {order.status === 'CANCELLED' && (
                                                <span className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded-md tracking-wider">BATAL</span>
                                            )}
                                        </div>
                                        <p className="text-lg font-bold font-mono text-gray-300">#{order.id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full border font-bold text-sm ${getStatusStyle(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </div>
                                </div>

                                {/* Daftar Makanan (Tengah Kartu) */}
                                <div className="space-y-3 mb-6">
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-gray-800 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-yellow-400">
                                                    {item.quantity}x
                                                </div>
                                                <p className="font-semibold">{item.menu.name}</p>
                                            </div>
                                            <p className="text-gray-400">
                                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Ekor Kartu (Total Harga & Tombol Aksi) */}
                                <div className="bg-gray-900 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                                    
                                    {/* Tombol Cetak Struk (Hanya Muncul Jika Sudah Lunas) */}
                                    <div>
                                        {order.status !== 'PENDING' && order.status !== 'CANCELLED' ? (
                                            <Link 
                                                href={`/history/receipt/${order.id}`}
                                                target="_blank" // Buka di tab baru
                                                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl font-semibold transition-colors border border-gray-700"
                                            >
                                                🧾 Lihat Bon / Struk
                                            </Link>
                                        ) : (
                                            <div className="text-sm text-gray-500 italic">
                                                *Struk akan tersedia setelah pembayaran lunas
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                        {order.discount > 0 && (
                                            <div className="flex justify-between w-full min-w-[200px] text-sm text-green-400 font-semibold">
                                                <span>Diskon Member:</span>
                                                <span>- Rp {order.discount.toLocaleString('id-ID')}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between w-full min-w-[200px] text-xl font-black text-yellow-400">
                                            <span>Total Bayar:</span>
                                            <span>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
