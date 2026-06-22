'use client'

import { useState } from "react"
import { updateUserRole } from "@/actions/admin-users"

type User = {
    id: string
    name: string | null
    email: string
    role: 'ADMIN' | 'KITCHEN' | 'CUSTOMER'
    createdAt: Date
}

export default function AdminUsersClient({ initialUsers }: { initialUsers: User[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null)

    // Fitur Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const totalPages = Math.ceil(initialUsers.length / itemsPerPage)
    const currentUsers = initialUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    // Fungsi untuk mengganti jabatan (Role)
    const handleRoleChange = async (userId: string, newRole: 'ADMIN' | 'KITCHEN' | 'CUSTOMER') => {
        if (!confirm(`Apakah kamu yakin ingin mengubah jabatan akun ini menjadi ${newRole}?`)) {
            return
        }

        setLoadingId(userId)
        const res = await updateUserRole(userId, newRole)
        
        if (!res.success) {
            alert(res.error)
        } else {
            alert("✅ Jabatan berhasil diubah!")
        }
        setLoadingId(null)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-gray-800">👥 Manajemen Staf & Pengguna</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                            <th className="p-4 font-bold">Informasi Akun</th>
                            <th className="p-4 font-bold">Tanggal Bergabung</th>
                            <th className="p-4 font-bold text-right">Ubah Jabatan (Role)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-black">
                                <td className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold">{user.name || "Tamu (Belum setting nama)"}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {user.createdAt.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </td>
                                <td className="p-4 text-right">
                                    {/* Dropdown untuk mengubah role */}
                                    <select 
                                        value={user.role}
                                        disabled={loadingId === user.id}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value as 'ADMIN' | 'KITCHEN' | 'CUSTOMER')}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold outline-none border-2 transition-colors cursor-pointer disabled:opacity-50
                                            ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border-purple-200' : 
                                              user.role === 'KITCHEN' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                                              'bg-gray-100 text-gray-700 border-gray-200'}
                                        `}
                                    >
                                        <option value="CUSTOMER">🧑‍💼 Customer</option>
                                        <option value="KITCHEN">👨‍🍳 Kitchen (Dapur)</option>
                                        <option value="ADMIN">👑 Admin (Bos)</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Kontrol Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                        <p className="text-sm text-gray-500 font-bold">Halaman {currentPage} dari {totalPages}</p>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-gray-100"
                            >
                                ← Sebelumnya
                            </button>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-gray-100"
                            >
                                Selanjutnya →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
