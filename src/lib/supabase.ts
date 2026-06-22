import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Membuat client Supabase yang akan kita pakai khusus untuk Realtime Subscription
export const supabase = createClient(supabaseUrl, supabaseKey)
