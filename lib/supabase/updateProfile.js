import { supabase } from "../supabase"

export default async function updateProfile({ id, username, email, is_premium, role, avatar_url, notify }) {
  username = username.replace(/[^a-zA-Z0-9-_]/g, "")
  try {
    const updates = {
      id,
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
    notify(error.message)
  } finally {
    notify("Your profile was updated successfully!")
  }
}
