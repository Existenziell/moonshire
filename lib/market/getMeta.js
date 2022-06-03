import axios from "axios"

export const getMeta = async (tokenURI) => {
  const meta = await axios.get(tokenURI)
  return meta
}
