import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { OrderStatus } from "@prisma/client"

// Midtrans akan memanggil jalur POST ini secara diam-diam saat pelanggan selesai membayar
export async function POST(req: Request) {
    try {
        const data = await req.json()
        
        // Data penting dari Midtrans
        const orderId = data.order_id
        const transactionStatus = data.transaction_status
        const fraudStatus = data.fraud_status

        console.log(`[Midtrans Webhook] Menerima update untuk Order ${orderId}: ${transactionStatus}`)

        // Tentukan nasib pesanan berdasarkan status transaksi Midtrans
        if (transactionStatus === 'capture') {
            if (fraudStatus === 'accept') {
                // Lunas (Kartu Kredit)
                await updateOrderStatus(orderId, 'COOKING')
            }
        } else if (transactionStatus === 'settlement') {
            // Lunas (Gopay, QRIS, Virtual Account)
            await updateOrderStatus(orderId, 'COOKING')
        } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
            // Batal atau Kadaluarsa
            await updateOrderStatus(orderId, 'CANCELLED')
        } else if (transactionStatus === 'pending') {
            // Masih Pending (Menunggu pelanggan transfer)
            // Biarkan saja, tidak perlu diubah karena defaultnya PENDING
        }

        // Kembalikan status 200 OK ke Midtrans agar Midtrans tahu kita sudah sukses menerima pesannya
        return NextResponse.json({ message: "OK" })
    } catch (error) {
        console.error("Webhook Error:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

// Fungsi pembantu untuk merubah status di Database
async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    await prisma.order.update({
        where: { id: orderId },
        data: { status: newStatus }
    })
    console.log(`[Database] Status Order ${orderId} dirubah menjadi ${newStatus}`)
}
