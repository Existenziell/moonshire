import axios from "axios"

export const fetchMeta = async (tokenURI) => {
  const meta = await axios.get(tokenURI)
  return meta
}
