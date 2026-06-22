import prisma from "@/lib/prisma";
import RealtimeOrderListener from "@/components/RealtimeOrderListener";
import CompleteOrderButton from "@/components/CompleteOrderButton";
import { OrderStatus } from "@prisma/client";
import Link from "next/link";
import { getMyProfile } from "@/actions/auth";
import { redirect } from "next/navigation";

// Halaman ini adalah Server Component, jadi kita bisa langsung memanggil database
export default async function KitchenPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {

    const profile = await getMyProfile()
    if (!profile || (profile.role !== 'KITCHEN' && profile.role !== 'ADMIN')) {
        redirect('/')
    }

    // Karena di Next.js 15 searchParams adalah Promise, kita harus await
    const resolvedParams = await searchParams;
    const currentFilter = resolvedParams.filter || 'ALL'

    // Buat Kriteria pencarian database berdasarkan filter
    const whereCondition = currentFilter === 'ALL'
            ? {} // ambil semua
            : { status: currentFilter as OrderStatus }  // Ambil sesuai filter

    // 1. Mengambil data pesanan beserta isinya dari Database
    const orders = await prisma.order.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' }, // Tampilkan yang terbaru di atas
        include: {
            items: {
                include: {
                    menu: true // Sertakan juga data menu agar kita tahu nama makanannya (bukan cuma ID-nya)
                }
            }
        }
    })

    // Komponen kecil untuk membuat tombol Tab Navigasi
    const FilterTab = ({ label, value }: { label: string, value: string }) => {
        const isActive = currentFilter === value
        return (
            <Link
                href={value === 'ALL' ? '/kitchen' : `/kitchen?filter=${value}`}
                className={`px-6 py-2 rounded-full font-bold transition-all ${isActive ? 'bg-yellow-500 text-black shadow-lg scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}>
                {label}
            </Link>
        )
    }

    return (
        <main className="min-h-screen bg-gray-900 text-white p-8">
            <RealtimeOrderListener />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-black text-yellow-400 mb-8 border-b border-gray-700 pb-4 tracking-widest">
                👨‍🍳 KITCHEN DISPLAY
                </h1>


                {/* Barisan Tab Filter */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <FilterTab label="SEMUA" value="ALL" />
                    <FilterTab label="PENDING" value="PENDING" />
                    <FilterTab label="COOKING" value="COOKING" />
                    <FilterTab label="READY" value="READY" />
                    <FilterTab label="COMPLETED" value="COMPLETED" />
                </div>

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
                                    <CompleteOrderButton orderId={order.id} currentStatus={order.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}