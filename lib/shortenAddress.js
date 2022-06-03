export const shortenAddress = (address) => {
  if (!address) return ''
  return (
    <span>{address.substring(0, 5)}&#8230;{address.slice(address.length - 4)}</span>
  )
}
