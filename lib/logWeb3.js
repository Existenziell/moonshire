const logWeb3 = (msg) => {
  const output = document.getElementById('mintingInfo')
  const element = document.createElement("div")
  element.style.marginBottom = '10px'
  if (output) output.append(msg, element)
}

export default logWeb3
