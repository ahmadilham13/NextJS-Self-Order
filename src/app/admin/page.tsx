import { getDashboardStats } from "@/actions/admin-analytics"
import { Analytics } from '@vercel/analytics/next';

export default async function AdminDashboardPage() {
    // Tarik data statistik dari Database
    const stats = await getDashboardStats()

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-black mb-1 text-gray-800">📊 Dashboard Utama</h2>
                    <p className="text-gray-500">Ringkasan performa bisnismu hari ini.</p>
                </div>
            </div>

            <Analytics />
            
            {/* Kartu Metrik Utama */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl">
                        🛒
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold text-sm">Total Pesanan Sukses</p>
                        <p className="text-4xl font-black text-gray-800">{stats.totalOrdersCount} <span className="text-xl text-gray-400">Order</span></p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl">
                        💰
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold text-sm">Total Pendapatan Kotor</p>
                        <p className="text-4xl font-black text-green-600">Rp {stats.totalRevenue.toLocaleString('id-ID')}</p>
                    </div>
                </div>
            </div>

            {/* Menu Paling Laris */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    🔥 Menu Paling Laris
                </h3>
                
                {stats.topMenus.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        Belum ada pesanan yang diselesaikan.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {stats.topMenus.map((menu, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-100">
                                <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                                    {menu.imageUrl ? (
                                        <img src={menu.imageUrl} alt={menu.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-bold">No Img</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-lg text-gray-800">{menu.name}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                        <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${Math.min((menu.sold / 50) * 100, 100)}%` }}></div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-orange-600">{menu.sold}</p>
                                    <p className="text-xs text-gray-500 font-bold">Porsi Terjual</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
