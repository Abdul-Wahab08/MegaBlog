import { createClient } from '@supabase/supabase-js'
import conf from '../conf/conf'

const supabase = createClient(conf.supabaseUrl, conf.supabaseKey)

export default supabase