import prisma from "@/lib/prisma"
import AdminUsersClient from "./AdminUsersClient"

export default async function AdminUsersPage() {
    // Tarik semua pengguna dari database (diurutkan berdasarkan yang terbaru)
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    })

    // Oper datanya ke Client Component agar Admin bisa berinteraksi dengan tabelnya
    return <AdminUsersClient initialUsers={users} />
}
