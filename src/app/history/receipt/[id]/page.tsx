import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import PrintButton from "@/components/PrintButton"

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
    // 1. Ambil ID pesanan dari URL
    const { id } = await params;

    // 2. Cari data pesanan di Database
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: { include: { menu: true } },
            user: true
        }
    })

    // Jika pesanan tidak ditemukan, tampilkan halaman 404
    if (!order) return notFound()

    return (
        <main className="min-h-screen bg-gray-200 flex items-center justify-center p-8 print:p-0 print:bg-white">
            {/* Kertas Struk */}
            <div className="bg-white text-black p-8 max-w-sm w-full shadow-2xl print:shadow-none print:max-w-full font-mono text-sm relative">
                
                {/* Header Struk */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-black mb-1">ILM Restauran</h1>
                    <p className="text-xs text-gray-500">Pasar Sarolangun, Suka Sari</p>
                    <p className="text-xs text-gray-500">Kabupaten Sarolangun</p>
                    <div className="mt-4 border-b-2 border-dashed border-gray-300"></div>
                </div>

                {/* Info Pesanan */}
                <div className="mb-6">
                    <div className="flex justify-between mb-1">
                        <span>Waktu:</span>
                        <span>{order.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span>No. Order:</span>
                        <span className="font-bold">{order.id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span>Pelanggan:</span>
                        <span>{order.customerName}</span>
                    </div>
                    <div className="mt-4 border-b-2 border-dashed border-gray-300"></div>
                </div>

                {/* Daftar Item */}
                <div className="mb-6 space-y-3">
                    {order.items.map(item => (
                        <div key={item.id}>
                            <p className="font-bold">{item.menu.name}</p>
                            <div className="flex justify-between">
                                <span>{item.quantity} x {item.price.toLocaleString('id-ID')}</span>
                                <span>{(item.quantity * item.price).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    ))}
                    <div className="mt-4 border-b-2 border-dashed border-gray-300"></div>
                </div>

                {/* Total dan Diskon */}
                <div className="mb-8">
                    <div className="flex justify-between mb-1">
                        <span>Subtotal:</span>
                        <span>Rp {(order.totalAmount + order.discount).toLocaleString('id-ID')}</span>
                    </div>
                    {order.discount > 0 && (
                        <div className="flex justify-between mb-1 text-sm">
                            <span>Diskon Member:</span>
                            <span>- Rp {order.discount.toLocaleString('id-ID')}</span>
                        </div>
                    )}
                    <div className="flex justify-between mt-2 pt-2 border-t border-black text-lg font-black">
                        <span>TOTAL:</span>
                        <span>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                {/* Stempel Lunas */}
                <div className="text-center mb-8">
                    <div className="inline-block border-4 border-green-600 text-green-600 font-black text-2xl px-6 py-2 rounded-lg transform -rotate-12 opacity-80">
                        LUNAS
                    </div>
                </div>

                {/* Footer Struk */}
                <div className="text-center text-xs text-gray-500">
                    <p>Terima kasih atas kunjungan Anda!</p>
                    <p>Silakan tunjukkan struk ini saat mengambil pesanan.</p>
                </div>
            </div>

            {/* Tombol Aksi (Disembunyikan saat di-print) */}
            <div className="fixed bottom-8 right-8 flex gap-4 print:hidden">
                <PrintButton />
            </div>
            
            {/* Supaya otomatis nge-print saat pertama kali dibuka */}
            <script dangerouslySetInnerHTML={{
                __html: `
                    window.onload = function() {
                        window.print();
                    }
                `
            }} />
        </main>
    )
}
