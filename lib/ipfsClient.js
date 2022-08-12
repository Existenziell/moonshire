import { create as ipfsHttpClient } from 'ipfs-http-client'

const projectId = process.env.NEXT_PUBLIC_INFURA_ID
const projectSecret = process.env.NEXT_PUBLIC_INFURA_SECRET
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfsClient = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
})
export default ipfsClient
