import { useContext } from "react"
import { AppContext } from '../context/AppContext'

const ControlPanel = ({ contents }) => {
  const appCtx = useContext(AppContext)

  return (
    <div className='flex'>
      <div className='controlPanel flex items-center gap-4 -translate-y-16 transition-all duration-300' >
        {contents}
      </div>
      <button onClick={appCtx.toggleControlPanel} className='mr-2 ml-4 controlPanelTrigger' aria-label='Trigger Control Panel'>
        {appCtx.showControlPanel ?
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand hover:text-slate-400 hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
          </svg>
          :
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand hover:text-slate-400 hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
          </svg>
        }
      </button>
    </div>
  )
}

export default ControlPanel
