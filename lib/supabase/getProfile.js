import { supabase } from "../supabase"
import getUserCollections from "./getUserCollections"

export default async function getProfile(walletAddress) {
  if (walletAddress === "0x3FEe331EA072360c8c60F360C8bd2770992FD60d") return 'Contract'

  try {
    // Get user from supabase
    const { data: user, error, status } = await supabase
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
