import convert from 'crypto-convert'

export default async function convertPrice(req, res) {
  await convert.ready(); //Cache is not yet loaded on first start
  const price = new convert.from("ETH").to("USD").amount(req.body).toFixed(2)
  res.status(200).send(price)
}
