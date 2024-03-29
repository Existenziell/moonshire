import { marketplaceAddress } from '../config'

export const addToMetamask = async () => {
  const tokenAddress = marketplaceAddress
  const tokenSymbol = 'MOON'
  const tokenDecimals = 0.1
  const tokenImage = 'https://moonshire.vercel.app/token.png'

  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    })

    if (wasAdded) {
      // Do stuff
    } else {
      // user doesn't want it
    }
  } catch (error) {
    console.log(error)
  }
}
