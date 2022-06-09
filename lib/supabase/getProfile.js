import { supabase } from "../supabase"
import getUserCollections from "./getUserCollections"

export default async function getProfile(walletAddress) {
  try {
    // Get user from supabase
    let { data: user, error, status } = await supabase
      .from('users')
      .select(`*, roles(*)`)
      .eq('walletAddress', walletAddress)
      .single()

    if (error && status !== 406) {
      throw error
    }

    if (user) {
      user.collections = await getUserCollections(user.id)
      return user
    }
  } catch (error) {
    console.log(error.message)
  }
}
