'use server'

import prisma from "@/lib/prisma"
import { getMyProfile } from "./auth"

export async function getDashboardStats() {
    // Pastikan pemanggil adalah Admin
    const profile = await getMyProfile()
    if (!profile || profile.role !== 'ADMIN') {
        throw new Error("Akses Ditolak!")
    }

    // 1. Hitung Total Pesanan Berhasil (Lunas / Selesai)
    const totalOrdersCount = await prisma.order.count({
        where: {
            status: { in: ['COOKING', 'READY', 'COMPLETED'] }
        }
    })

    // 2. Hitung Total Pendapatan Kotor (Lunas / Selesai)
    const completedOrders = await prisma.order.findMany({
        where: { status: { in: ['COOKING', 'READY', 'COMPLETED'] } },
        select: { totalAmount: true }
    })
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0)

    // 3. Cari 3 Menu Paling Laris
    // Kita harus mengambil semua OrderItem dari pesanan yang sukses, lalu mengelompokkannya
    const topItemsData = await prisma.orderItem.groupBy({
        by: ['menuId'],
        where: {
            order: { status: { in: ['COOKING', 'READY', 'COMPLETED'] } }
        },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 3
    })

    // Kita ambil nama menu dari ID tersebut
    const menuDetails = await prisma.menu.findMany({
        where: { id: { in: topItemsData.map(t => t.menuId) } }
    })

    // Gabungkan data
    const topMenus = topItemsData.map(item => {
        const menu = menuDetails.find(m => m.id === item.menuId)
        return {
            name: menu?.name || "Menu Dihapus",
            sold: item._sum.quantity || 0,
            imageUrl: menu?.imageUrl
        }
    })

    return {
        totalOrdersCount,
        totalRevenue,
        topMenus
    }
}
