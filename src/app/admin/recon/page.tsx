import prisma from "@/lib/prisma"
import { getMyProfile } from "@/actions/auth"
import { redirect } from "next/navigation"
import AdminReconClient from "./AdminReconClient"

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

            <AdminReconClient initialOrders={orders} />
        </div>
    )
}
