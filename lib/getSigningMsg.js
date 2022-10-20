export const getSigningMsg = (account, nonce) => {
  return `
Welcome to Project Moonshire!
            
This signature is used to sign you in and accept the Moonshire Terms of Service: https://moonshire.io/tos
           
This request will not trigger a blockchain transaction or cost any gas fees.
              
Your authentication status will reset after 24 hours.

Wallet address: ${account}

Nonce: ${nonce}
`
}
