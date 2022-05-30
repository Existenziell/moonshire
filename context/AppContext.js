import { createContext, useState, useContext, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { v4 as uuid } from 'uuid'
import { useRouter } from "next/router"
import { chainId, signMessage } from '../lib/config'
import { ethers } from "ethers"
import getProfile from "../lib/getProfile"
import detectEthereumProvider from '@metamask/detect-provider'

const AppContext = createContext({})

const AppWrapper = ({ children }) => {
  const [session, setSession] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const [username, setUsername] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [notificationMsg, setNotificationMsg] = useState('')

  const [walletAddress, setWalletAddress] = useState(null)
  const [walletConnected, setWalletConnected] = useState(false)
  const [isCorrectChain, setIsCorrectChain] = useState(false)
  const [provider, setProvider] = useState()
  const router = useRouter()

  // Session for Admin
  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    initMetaMask()
  }, [])

  const initMetaMask = async () => {
    const provider = await detectEthereumProvider()
    if (provider) {
      setProvider(provider)
      if (provider.isMetaMask) {
        provider.on('accountsChanged', handleAccountsChanged)
        provider.on('chainChanged', handleChainChanged)
        checkConnection()
      } else {
        notify('Please install MetaMask!')
      }

      // Legacy providers may only have ethereum.sendAsync
      const chainId = await provider.request({
        method: 'eth_chainId'
      })
    } else {
      // if the provider is not detected, detectEthereumProvider resolves to null
      notify('Please install MetaMask!')
    }
  }

  const checkConnection = () => {
    ethereum
      .request({ method: 'eth_accounts' })
      .then(handleAccountsChanged)
      .catch(console.error)
  }

  const handleChainChanged = (chainId) => {
    if (parseInt(chainId) === 4) {
      setIsCorrectChain(true)
    } else {
      notify(`Please change network to Rinkeby in Metamask.`)
      setIsCorrectChain(false)
    }
  }

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setWalletAddress('')
      setWalletConnected(false)
    } else {
      const address = accounts[0]
      setWalletAddress(address)
      setWalletConnected(true)
      checkUser(address)
    }
  }

  // Check if a user exists for this Wallet
  const checkUser = async (address) => {
    const user = await getProfile(address)
    if (user) {
      setUsername(user.username)
      setAvatarUrl(user.avatar_url)
      setCurrentUser(user)
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const nonce = uuid()
      const signMessage = `
Welcome to Project Moonshire!
            
This signature is used to sign you in and accept the Moonshire Terms of Service: https://moonshire.io/tos
           
This request will not trigger a blockchain transaction or cost any gas fees.
              
Your authentication status will reset after 24 hours.

Wallet address: ${address}

Nonce: ${nonce}
      `

      const signature = await signer.signMessage(signMessage)
      createUser(address, nonce, signature)
    }
  }

  // Write new user to DB
  const createUser = async (address, nonce, signature) => {
    const { data, error } = await supabase
      .from('users')
      .insert([
        { id: uuid(), walletAddress: address, nonce, signature },
      ])
    if (!error) {
      notify("Welcome to Project Moonshire.")
      setCurrentUser(data[0])
    }
  }

  const disconnectWallet = async () => {
    // We can only pretend a disconnect by resetting the provider, chainId and selectedAccount
    await setProvider(null)
    await setWalletAddress(null)
    await setWalletConnected(false)
    router.push('/')
  }

  const notify = (msg) => {
    const notification = document.querySelector('.notification')
    notification.classList.remove('-translate-y-20')
    setNotificationMsg(msg)
    setTimeout(() => {
      notification.classList.add('-translate-y-20')
    }, 3500)
  }

  let app = {
    session, setSession,
    currentUser, setCurrentUser,
    userId, setUserId,
    username, setUsername,
    avatar_url, setAvatarUrl,
    notificationMsg, setNotificationMsg,

    walletAddress, setWalletAddress,
    walletConnected, setWalletConnected,
    isCorrectChain, setIsCorrectChain,
    provider, setProvider,

    disconnectWallet,
    notify,
  }

  return (
    <AppContext.Provider value={app}>
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppWrapper, useAppContext }
