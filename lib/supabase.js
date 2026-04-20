import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rcvzdtwpfzpcprgojiit.supabase.co'
const supabaseAnonKey = 'sb_publishable_sKiDa9w5IGuzcdeMX1QF0g_FehvFI1P'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
