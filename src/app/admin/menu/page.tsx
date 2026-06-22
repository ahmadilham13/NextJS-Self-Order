import prisma from "@/lib/prisma"
import AdminMenuClient from "./AdminMenuClient"

export default async function AdminMenuPage() {
    // Tarik semua menu dari database (diurutkan berdasarkan yang terbaru)
    const menus = await prisma.menu.findMany({
        orderBy: { createdAt: 'desc' }
    })

    // Oper datanya ke Client Component agar bisa diinteraksikan (Klik tombol, Modal, dll)
    return <AdminMenuClient initialMenus={menus} />
}
