export const convertEthToUsd = async (price) => {
  const result = await fetch(`https://api.coinconvert.net/convert/eth/usd?amount=${price}`)
  const newPrice = await result.json()
  return newPrice.USD.toFixed(2)
}
