import React, { useState } from "react"
import { createContext, useContext, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { uuid } from "../lib/uuid"
import getProfile from "../lib/getProfile"

const AppContext = createContext({})

const AppWrapper = ({ children }) => {
  const [session, setSession] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [notificationMsg, setNotificationMsg] = useState('')

  const [walletAddress, setWalletAddress] = useState('')
  const [walletConnected, setWalletConnected] = useState(false)
  const [isCorrectChain, setIsCorrectChain] = useState(false)
  const [provider, setProvider] = useState()

  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    if (walletAddress) checkUser()
  }, [walletAddress])

  // Check of a user exists for this Wallet
  const checkUser = async () => {
    const user = await getProfile(walletAddress)
    if (user) {
      setCurrentUser(user)
    } else {
      createUser()
    }
  }

  // Write new user to DB
  const createUser = async () => {
    const { data, error } = await supabase
      .from('users')
      .insert([
        { id: uuid(), wallet: walletAddress },
      ])
    if (!error) {
      notify("Welcome to Project Moonshire.")
      setCurrentUser(data[0])
    }
  }

  const disconnectWallet = () => {
    // We can only pretend a disconnect by resetting the provider, chainId and selectedAccount
    setProvider(null)
    setWalletAddress(null)
    setWalletConnected(false)
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
