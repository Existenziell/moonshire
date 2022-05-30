import { supabase } from "../../../lib/supabase"
import { v4 as uuid } from 'uuid'

const nonceApi = async (req, res) => {
  const { walletAddress } = req.body
  const nonce = uuid()

  const { data, error } = await supabase
    .from('users')
    .select('nonce')
    .eq('walletAddress', walletAddress)

  if (data?.length > 0) {
    console.log('existing user, update nonce');
    let { data, error } = await supabase.from('users').update({ nonce }).match({ walletAddress })

  } else {
    console.log("new user, new nonce", nonce, walletAddress);
    let { data, error } = await supabase.from('users').insert({ id: nonce, nonce, walletAddress })
  }

  if (error) {
    res.status(400).json({ error: error.message })
  } else {
    res.status(200).json({ nonce })
  }

}

export default nonceApi
