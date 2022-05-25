import { supabase } from "./supabase"

export default async function getProfile(setLoading) {
  try {
    setLoading(true)
    const user = supabase.auth.user()

    let { data, error, status } = await supabase
      .from('users')
      .select(`*, roles(*)`)
      .eq('id', user.id)
      .single()

    if (error && status !== 406) {
      throw error
    }
    if (data) {
      setLoading(false)
      return data
    }
  } catch (error) {
    console.log(error.message)
  }
}
