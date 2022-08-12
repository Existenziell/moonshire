import { create as ipfsHttpClient } from 'ipfs-http-client'

const projectId = process.env.NEXT_PUBLIC_INFURA_ID
const projectSecret = process.env.NEXT_PUBLIC_INFURA_SECRET
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
})

export default async function uploadFileToIpfs(e) {
  const file = e.target.files[0]
  try {
    const added = await client.add(file)
    // This is the IPFS url to the image of the NFT
    const url = ` https://moonshire.infura-ipfs.io/ipfs/${added.path}`
    return url
  } catch (error) {
    console.log('Error uploading file: ', error)
    return false
  }
}
