import { useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'

const DarkModeToggle = () => {
  const appCtx = useContext(AppContext)
  const { darkmode, setDarkmode } = appCtx

  useEffect(() => {
    // First check localstorage
    if (localStorage.theme === 'dark') {
      setDark()
    } else if (localStorage.theme === 'light') {
      setLight()
    } else if (localStorage.theme === 'auto') {
      setAuto()
    } else {
      // If no theme found, check user preferences
      checkUserPreference()
    }
  }, [])

  const setLight = () => {
    localStorage.theme = 'light'
    document.documentElement.classList.remove('dark')
    setDarkmode('light')
  }

  const setDark = () => {
    localStorage.theme = 'dark'
    document.documentElement.classList.add('dark')
    setDarkmode('dark')
  }

  const setAuto = async () => {
    await checkUserPreference()
    localStorage.theme = 'auto'
    setDarkmode('auto')
  }

  const checkUserPreference = async () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDark()
    } else {
      setLight()
    }
  }

  return (
    <section className='flex items-center gap-3 text-tiny font-serif'>
      <button onClick={setLight} className={darkmode === 'light' ? `text-cta` : ``}>LIGHT</button>
      <button onClick={setDark} className={darkmode === 'dark' ? `text-cta` : ``}>DARK</button>
      <button onClick={setAuto} className={darkmode === 'auto' ? `text-cta` : ``}>AUTO</button>
    </section>
  )
}

export default DarkModeToggle
