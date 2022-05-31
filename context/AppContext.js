import { createContext, useState, useContext, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { v4 as uuid } from 'uuid'
import { useRouter } from "next/router"
import { ethers } from "ethers"
import getProfile from "../lib/getProfile"
import detectEthereumProvider from '@metamask/detect-provider'
import { getSigningMsg } from '../lib/getSigningMsg'
import { useWeb3React } from "@web3-react/core"
import { InjectedConnector } from "@web3-react/injected-connector"
import { injected } from "../components/Connector"
import { hasEthereum } from '../lib/ethereum'

const AppContext = createContext({})

const AppWrapper = ({ children }) => {
  const [session, setSession] = useState(null)
  const [notificationMsg, setNotificationMsg] = useState('')

  const [currentUser, setCurrentUser] = useState(null)
  const [hasMetamask, setHasMetamask] = useState(false)
  const [isCorrectChain, setIsCorrectChain] = useState(false)

  const { account, chainId, active, library: provider, connector, activate, deactivate, error, setError } = useWeb3React()
  const router = useRouter()

  // Session for Admin
  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  // Check if user wallet is connected 
  useEffect(() => {
    if (account) checkUser()
  }, [account])

  // Connect to Metamask wallet
  async function connect() {
    if (hasMetamask) {
      try {
        await activate(injected)
        checkUser()
        localStorage.setItem('walletConnected', true)
      } catch (e) {
        console.log(e)
      }
    }
  }

  // Disconnect from Metamask wallet
  async function disconnect() {
    try {
      localStorage.setItem('walletConnected', false)
      deactivate()
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('walletConnected') === 'true') {
        try {
          await activate(injected)
        } catch (e) {
          console.log(e)
        }
      }
    }
    connectWalletOnPageLoad()
  }, [])

  // Check if a user exists for this Wallet
  const checkUser = async () => {
    const user = await getProfile(account)
    if (user) {
      setCurrentUser(user)
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const nonce = uuid()
      const message = getSigningMsg(nonce, account)
      const signature = await signer.signMessage(message)
      createUser(account, nonce, signature)
    }
  }

  // Create new user in DB
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

  // System wide notification service
  const notify = (msg) => {
    const notification = document.querySelector('.notification')
    notification.classList.remove('-translate-y-20')
    setNotificationMsg(msg)
    setTimeout(() => {
      notification.classList.add('-translate-y-20')
    }, 3500)
  }

  // Listeners for changes in account/chain/network
  useEffect(() => {
    if (hasEthereum()) {
      setHasMetamask(true)
    } else {
      setHasMetamask(false)
      return
    }

    const handleConnect = (accounts) => {
      // console.log("Handling 'connect' event with accounts: ", accounts)
      activate(injected)
    }

    const handleChainChanged = (chainId) => {
      // console.log("Handling 'chainChanged' event with chainId: ", parseInt(chainId))
      if (parseInt(chainId) === 4) {
        setIsCorrectChain(true)
      } else {
        notify(`Please change network to Rinkeby in Metamask.`)
        setIsCorrectChain(false)
      }
    }

    const handleAccountsChanged = (accounts) => {
      // console.log("Handling 'accountsChanged' event with accounts: ", accounts)
      if (accounts.length > 0) {
        activate(injected)
      }
    }

    ethereum.on('connect', handleConnect)
    ethereum.on('accountsChanged', handleAccountsChanged)
    ethereum.on('chainChanged', handleChainChanged)
  }, [])


  let app = {
    session, setSession,
    currentUser, setCurrentUser,
    notificationMsg, setNotificationMsg,
    notify,

    // userId, setUserId,
    // username, setUsername,
    // avatar_url, setAvatarUrl,

    hasMetamask, setHasMetamask,
    isCorrectChain, setIsCorrectChain,
    connect, disconnect,
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
