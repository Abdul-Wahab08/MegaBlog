import { createClient } from '@supabase/supabase-js'
import conf from '../conf/conf'

export default supabase = createClient(conf.supabaseUrl, conf.supabaseKey)