import { supabase } from "../../../lib/supabase"
import { ethers } from 'ethers'

const walletApi = async (req, res) => {
  try {
    const { walletAddress, signature, nonce } = req.body
    const signerAddress = ethers.utils.verifyMessage(nonce, signature)

    if (signerAddress !== walletAddress) {
      throw new Error("Wrong Signature!")
    }

    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq({ 'walletAddress': walletAddress })
      .eq({ 'nonce': nonce })
      .single()

    res.status(200).json({ user })

  } catch (error) {
    console.log('error', error.message)
    res.status(400).json({ error: error.message })
  }
}

export default walletApi
