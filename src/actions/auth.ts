'use server'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  
  if (error) {
    return redirect('/auth?error=Login Gagal. Email atau Password salah.')
  }
  
  redirect('/') // Ke halaman utama kalau berhasil
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const name = formData.get('name') as string

  // Validasi tambahan: Pastikan password cocok
  if (password !== confirmPassword) {
    return redirect('/auth?error=Pendaftaran Gagal. Konfirmasi password tidak sama dengan password!')
  }
  
  const supabase = await createClient()
  
  // 1. Buat User di Supabase Auth
  const { data, error } = await supabase.auth.signUp({ email, password })
  
  if (error || !data.user) {
    return redirect('/auth?error=Gagal mendaftar: ' + (error?.message || ''))
  }
  
  // 2. Simpan User di Database Prisma kita!
  try {
    await prisma.user.create({
      data: {
        id: data.user.id, // WAJIB SAMA DENGAN ID SUPABASE
        email: email,
        name: name,
        // Role otomatis menjadi CUSTOMER sesuai default di schema
      }
    })
  } catch (dbError) {
    console.error("Gagal simpan ke Prisma:", dbError)
  }
  
  redirect('/auth?success=Berhasil mendaftar! Silakan Login.')
}

// Mengambil data profil user yang sedang login
export async function getMyProfile() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()

  if (!authData.user) return null // jika tamu, kembalikan null

  // Cari data lengkapnya di Prisma
  const user = await prisma.user.findUnique({
    where: { id: authData.user.id }
  })

  return user;
}
