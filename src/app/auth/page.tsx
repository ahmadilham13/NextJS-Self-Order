'use client'

import { useState, Suspense } from "react"
import { login, signup } from "@/actions/auth"
import { useSearchParams } from "next/navigation"

function AuthForm() {
    const searchParams = useSearchParams()
    const errorMessage = searchParams.get('error')
    const successMessage = searchParams.get('success')

    // State untuk beralih antara mode Login dan Register
    const [isLogin, setIsLogin] = useState(true)

    return (
            <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700">
                
                <h1 className="text-3xl font-black text-yellow-400 text-center mb-2">
                    {isLogin ? 'Selamat Datang! 👋' : 'Bergabunglah! 🚀'}
                </h1>
                <p className="text-gray-400 text-center mb-8">
                    {isLogin ? 'Masuk untuk mengumpulkan poin dan promo' : 'Daftar sekarang untuk menikmati diskon khusus Member'}
                </p>
                {errorMessage && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-xl mb-6 text-sm text-center">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-900/50 border border-green-500 text-green-200 p-3 rounded-xl mb-6 text-sm text-center">
                        {successMessage}
                    </div>
                )}
                {/* Gunakan Action Next.js yang memanggil fungsi buatan saya tadi */}
                <form action={isLogin ? login : signup} className="space-y-5">
                    
                    {!isLogin && (
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">Nama Panggilan</label>
                            <input 
                                name="name" 
                                type="text" 
                                required={!isLogin}
                                className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-colors"
                                placeholder="Cth: Budi"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2">Email</label>
                        <input 
                            name="email" 
                            type="email" 
                            required
                            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-colors"
                            placeholder="nama@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2">Password rahasia</label>
                        <input 
                            name="password" 
                            type="password" 
                            required
                            minLength={6}
                            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-colors"
                            placeholder="Minimal 6 karakter"
                        />
                    </div>
                    
                    {!isLogin && (
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">Konfirmasi Password</label>
                            <input 
                                name="confirmPassword" 
                                type="password" 
                                required={!isLogin}
                                minLength={6}
                                className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-colors"
                                placeholder="Ulangi password di atas"
                            />
                        </div>
                    )}
                    <button 
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-xl shadow-lg transition-transform active:scale-95 text-lg"
                    >
                        {isLogin ? 'MASUK SEKARANG' : 'DAFTAR SEKARANG'}
                    </button>
                </form>
                <div className="mt-8 text-center">
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-gray-400 hover:text-yellow-400 font-semibold transition-colors"
                    >
                        {isLogin ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk di sini'}
                    </button>
                </div>
            </div>
    )
}

export default function AuthPage() {
    return (
        <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <Suspense fallback={<div className="text-white text-xl font-bold">Memuat...</div>}>
                <AuthForm />
            </Suspense>
        </main>
    )
}