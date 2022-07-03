import { ethers } from 'ethers'
import { supabase } from '../lib/supabase'
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers"
import { createContext, ReactNode, useContext, useEffect, useState, } from "react"
import { hasEthereum } from '../lib/ethereum'
import { useRouter } from "next/router"
import { getSigningMsg } from '../lib/getSigningMsg'
import { v4 as uuid } from 'uuid'
import Web3Modal from "web3modal"
import getProfile from "../lib/supabase/getProfile"
import detectEthereumProvider from '@metamask/detect-provider'
import WalletConnectProvider from "@walletconnect/web3-provider"
import { marketplaceAddress } from '../config'

const AppContext = createContext()
const useApp = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  const [signer, setSigner] = useState()
  const [address, setAddress] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [hasMetamask, setHasMetamask] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState('')
  const [chainId, setChainId] = useState(null)
  const [darkmode, setDarkmode] = useState('')
  const [contractBalance, setContractBalance] = useState(null)

  const router = useRouter()

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "073db7ccff3840e4b3d13d4abba27432",
      }
    }
  }

  // Listeners for window.ethereum
  useEffect(() => {
    if (hasEthereum()) {
      setHasMetamask(true)
    } else {
      setHasMetamask(false)
      return
    }
  }, [])

  useEffect(() => {
    const web3modal = new Web3Modal()
    if (web3modal.cachedProvider) connectWallet()
    if (hasMetamask) {
      ethereum.on("accountsChanged", connectWallet)
      ethereum.on("chainChanged", (chainId) => {
        if (checkChain(chainId)) setChainId(parseInt(chainId))
      })
    }
  }, [])

  useEffect(() => {
    if (address) checkUser()
  }, [address])

  const connectWallet = async () => {
    try {
      const web3modal = new Web3Modal({ cacheProvider: true, providerOptions, network: 'rinkeby', })
      const instance = await web3modal.connect()
      const provider = new Web3Provider(instance)
      const signer = provider.getSigner()
      const address = await signer.getAddress()
      const { chainId } = await provider.getNetwork()
      const isCorrectChain = await checkChain(chainId)

      if (!isCorrectChain) return
      setSigner(signer)
      setAddress(address)
      setChainId(parseInt(chainId))

      provider.getBalance(marketplaceAddress).then((balance) => {
        // convert a currency unit from wei to ether
        const balanceInEth = ethers.utils.formatEther(balance)
        setContractBalance(balanceInEth)
      })
    } catch (e) {
      console.log(e)
    }
  }

  async function disconnect() {
    try {
      const web3modal = new Web3Modal({ cacheProvider: true, providerOptions, network: 'rinkeby', })
      await web3modal.clearCachedProvider()
      setSigner(null)
      setAddress(null)
      router.push('/')
    }
    catch (e) {
      console.log(e)
    }
  }

  // System wide notification service
  const notify = (msg, time = 3000) => {
    const notification = document.querySelector('.notification')
    notification.classList.remove('-translate-y-20')
    setNotificationMsg(msg)
    setTimeout(() => {
      notification.classList.add('-translate-y-20')
    }, time)
  }

  // Check if a user exists for this Wallet
  const checkUser = async () => {
    const user = await getProfile(address)
    if (user) {
      setCurrentUser(user)
    } else {
      const nonce = uuid()
      if (nonce && address && signer) {
        const message = getSigningMsg(nonce, address)
        const signature = await signer.signMessage(message)
        createUser(address, nonce, signature)
      }
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

  const checkChain = (chainId) => {
    if (parseInt(chainId) === 4) {  // Local: 1337 - Rinkeby: 4 - Mumbai: 80001
      return true
    } else {
      notify(`Please change network to Rinkeby in Metamask.`)
      return false
    }
  }

  const contextValue = {
    signer, address, connectWallet, disconnect, contractBalance,
    currentUser, setCurrentUser,
    hasMetamask, setHasMetamask, chainId, checkChain,
    notify, notificationMsg, setNotificationMsg, darkmode, setDarkmode,
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export default useApp
