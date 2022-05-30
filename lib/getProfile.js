import { supabase } from "./supabase"

export default async function getProfile(walletAddress) {
  try {
    let { data, error, status } = await supabase
      .from('users')
      .select(`*, roles(*)`)
      .eq('walletAddress', walletAddress)
    // .single()

    if (error && status !== 406) {
      throw error
    }
    if (data) {
      return data[0]
    }
  } catch (error) {
    console.log(error.message)
  }
}
