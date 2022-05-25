import React, { useState } from "react"
import { createContext, useContext, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import getProfile from "../lib/getProfile"

const AppContext = createContext({})

const AppWrapper = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState(null)
  const [notificationMsg, setNotificationMsg] = useState('')
  const [showControlPanel, setShowControlPanel] = useState(false)

  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const setUser = async () => {
    const authUser = supabase.auth.user()
    if (!authUser) return

    const user = await getProfile(() => { })
    if (user) {
      setCurrentUser(user)
    }
  }

  useEffect(() => {
    setUser()
  }, [session])

  const toggleControlPanel = (e) => {
    e.preventDefault()
    const trigger = document.getElementsByClassName('controlPanelTrigger')[0]
    const panel = document.getElementsByClassName('controlPanel')[0]

    panel.classList.toggle('-translate-y-16')
    trigger.classList.add('animate-ping')
    setTimeout(() => {
      trigger.classList.remove('animate-ping')
    }, 400)
    setShowControlPanel(!showControlPanel)
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
    currentUser,
    session,
    loading,
    theme,
    notificationMsg,
    showControlPanel,
    setCurrentUser,
    setSession,
    setLoading,
    setTheme,
    setNotificationMsg,
    setShowControlPanel,

    toggleControlPanel,
    notify
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
