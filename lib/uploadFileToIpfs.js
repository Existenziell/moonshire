import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default async function uploadFileToIpfs(e) {
  const file = e.target.files[0]
  try {
    const added = await client.add(file)
    // This is the IPFS url to the image of the NFT
    const url = `https://ipfs.infura.io/ipfs/${added.path}`
    return url
  } catch (error) {
    console.log('Error uploading file: ', error)
    return false
  }
}
