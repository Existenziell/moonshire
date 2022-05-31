import { useContext } from "react"
import { AppContext } from '../context/AppContext'

const Notification = () => {
  const appCtx = useContext(AppContext)

  return (
    <div className="notification fixed top-0 left-0 right-0 w-full -translate-y-20 transition-all duration-500 z-30">
      <div className='bg-cta text-white flex items-center justify-center py-6 '>
        {appCtx.notificationMsg}
      </div>
    </div>
  )
}

export default Notification
