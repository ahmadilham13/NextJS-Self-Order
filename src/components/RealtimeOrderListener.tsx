'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function RealtimeOrderListener() {
    const router = useRouter()

    useEffect(() => {
        // 1. Membuka saluran komunikasi (webSocket) ke Supabase
        const channel = supabase.channel('realtime-orders')
        // 2.Dengarkan segala perubahan (INSERT, UPDATE, DELETE) pada tabel 'Order'
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'Order' },
            (payload) => {
                console.log('Ada oerubahan pesanan di dapur!', payload)

                // 3. JURUS RAHASIA NEXT.JS: Perbarui data dari server tanpa me-refresh browser
                router.refresh()
            }
        )
        .subscribe()

        // Bersihkan saluran jika komponen ditutup
        return () => {
            supabase.removeChannel(channel)
        }
    }, [router])

    return null // komponen ini hanya 'mata-mata' dan tidak punya bentuk UI
}