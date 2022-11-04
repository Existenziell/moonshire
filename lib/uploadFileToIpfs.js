import ipfsClient from './ipfsClient'
const projectGateway = process.env.NEXT_PUBLIC_INFURA_GATEWAY

export default async function uploadFileToIpfs(e, setUploading) {
  setUploading(true)
  const file = e.target.files[0]
  try {
    const added = await ipfsClient.add(file)
    const url = `${projectGateway}/ipfs/${added.path}`
    setUploading(false)
    return url
  } catch (error) {
    console.log('Error uploading file: ', error)
    return false
  }
}
