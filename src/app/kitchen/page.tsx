import prisma from "@/lib/prisma";
import RealtimeOrderListener from "@/components/RealtimeOrderListener";

// Halaman ini adalah Server Component, jadi kita bisa langsung memanggil database
export default async function KitchenPage() {
    // 1. Mengambil data pesanan beserta isinya dari Database
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' }, // Tampilkan yang terbaru di atas
        include: {
            items: {
                include: {
                    menu: true // Sertakan juga data menu agar kita tahu nama makanannya (bukan cuma ID-nya)
                }
            }
        }
    })

    return (
        <main className="min-h-screen bg-gray-900 text-white p-8">
            <RealtimeOrderListener />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-black text-yellow-400 mb-8 border-b border-gray-700 pb-4 tracking-widest">
                👨‍🍳 KITCHEN DISPLAY
                </h1>

                {orders.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20 text-2xl font-semibold">
                        Belum ada pesanan masuk...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
                        {/* Mengulang setiap pesanan menjadi sebuah "Struk Digital" */}
                        {orders.map(order => (
                            <div key={order.id} className="bg-gray-800 rounded-2xl border-l-8 border-yellow-500 shadow-2xl overflow-hidden flex flex-col transition-transform hover:scale-[1.02]">
                            
                                {/* Header Struk (Nama Pelanggan) */}
                                <div className="bg-gray-700 p-5 flex justify-between items-center shadow-sm">
                                    <div>
                                        <h2 className="text-2xl font-black text-white uppercase tracking-wider">{order.customerName}</h2>
                                        <p className="text-xs text-gray-400 mt-1 font-mono">Order ID: {order.id.slice(-6).toUpperCase()}</p>
                                    </div>
                                    <div className="bg-yellow-500 text-black px-4 py-1.5 rounded-full font-black text-sm tracking-widest shadow-md">
                                        {order.status}
                                    </div>
                                </div>
                                {/* Daftar Makanan yang Dipesan */}
                                <div className="p-5 grow bg-gray-800">
                                    <ul className="space-y-4">
                                        {order.items.map(item => (
                                        <li key={item.id} className="flex justify-between items-center text-lg border-b border-gray-700 pb-3">
                                            <span className="font-bold text-gray-100">{item.menu.name}</span>
                                            <span className="bg-gray-600 text-white px-4 py-1.5 rounded-xl font-black shadow-inner">
                                            {item.quantity}x
                                            </span>
                                        </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Footer Struk (Waktu Pesan & Tombol Selesai) */}
                                <div className="bg-gray-950 p-5 flex justify-between items-center text-sm">
                                    <span className="text-gray-400 font-mono">
                                        {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-xl font-black transition-colors shadow-md active:scale-95">
                                        Selesai
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}