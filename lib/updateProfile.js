import { supabase } from "./supabase"

export default async function updateProfile({ username, email, is_premium, role, avatar_url, setLoading, notify }) {
  try {
    setLoading(true)
    const user = supabase.auth.user()

    const updates = {
      id: user.id,
      username,
      email,
      is_premium,
      role,
      avatar_url,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('users').upsert(updates, {
      returning: 'minimal', // Don't return the value after inserting
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.log(error.message)
  } finally {
    notify("Your profile has been updated successfully!")
    setLoading(false)
    return true
  }
}
