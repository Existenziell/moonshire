import Link from "next/link"
import Search from "./Search"

const TabBar = ({ links, extra, view, navigate, setDisplay, display, sortBy, sortAsc, sortByDatePrice, search, setSearch, resetSearch, length }) => {
  return (
    <div className='mb-10 flex justify-between w-full border-b-2 border-detail dark:border-detail-dark'>
      <ul className='md:text-[20px] flex gap-12 transition-colors'>
        {links.map(link => (
          <li key={link} className={view === link || view === undefined ? `relative top-[2px] pb-6 transition-colors border-b-2 border-white text-cta` : `hover:text-cta relative top-[2px]`}>
            <button onClick={navigate} name={`${link}`} className='capitalize'>
              {link}
            </button>
          </li>
        ))}
        {extra &&
          <li className='hover:text-cta'>
            <Link href={`/${extra}`}>
              <a className="capitalize">{extra}</a>
            </Link>
          </li>
        }
      </ul>

      {view !== 'settings' &&
        <div className='hidden md:flex items-center gap-8 relative bottom-2'>
          {length ? <span className='text-brand-dark/20 dark:text-brand/20'>{length} {length === 1 ? `result` : `results`}</span> : null}

          <button onClick={() => setDisplay('grid')}>
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
              className={`w-[14px] hover:text-cta dark:hover:text-cta ${display === 'grid' ? `text-cta` : `text-brand-dark/20 dark:text-white`}`}>
              <g transform="matrix(7.14286,0,0,7.14286,-6936.59,-905.458)" fill="currentColor">
                <g transform="matrix(0.304236,0,0,1.51041,683.691,-64.222)"><rect x="944.767" y="126.447" width="19.722" height="3.972" /></g>
                <g transform="matrix(0.304236,0,0,1.51041,691.691,-64.222)"><rect x="944.767" y="126.447" width="19.722" height="3.972" /></g>
                <g transform="matrix(0.304236,0,0,1.51041,683.691,-56.222)"><rect x="944.767" y="126.447" width="19.722" height="3.972" /></g>
                <g transform="matrix(0.304236,0,0,1.51041,691.691,-56.222)"><rect x="944.767" y="126.447" width="19.722" height="3.972" /></g>
              </g>
            </svg>
          </button>
          <button onClick={() => setDisplay('list')}>
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
              className={`w-[14px] hover:text-cta dark:hover:text-cta ${display === 'list' ? `text-cta` : `text-brand-dark/20 dark:text-white`}`} >
              <g transform="matrix(5,0,0,7.14286,-4980.62,-905.458)" fill="currentColor">
                <g transform="matrix(1.01412,0,0,0.503469,38.0171,63.1021)"><rect x="944.767" y="126.447" width="19.722" height="3.972" /></g>
                <g transform="matrix(1.01412,0,0,0.503469,38.0171,67.1021)"><rect x="944.767" y="126.447" width="19.722" height="3.972" /></g>
                <g transform="matrix(1.01412,0,0,0.503469,38.0171,71.1021)"><rect x="944.767" y="126.447" width="19.722" height="3.972" /></g>
                <g transform="matrix(1.01412,0,0,0.503469,38.0171,75.1021)"><rect x="944.767" y="126.447" width="19.722" height="3.972" /></g>
              </g>
            </svg>
          </button>

          <button className='uppercase hover:text-cta relative bottom-1' onClick={() => sortByDatePrice('created_at')}>
            <span className={`font-serif text-tiny w-8 inline-block ${sortBy === 'created_at' ? `text-cta` : `hover:text-cta dark:hover:text-cta`}`}>
              {sortBy === 'created_at' ?
                sortAsc ? `Old` : `New`
                :
                `Date`
              }
            </span>
          </button>
          <button className='uppercase hover:text-cta relative bottom-1' onClick={() => sortByDatePrice('price')}>
            <span className={`font-serif text-tiny w-8 inline-block ${sortBy === 'price' ? `text-cta` : `hover:text-cta dark:hover:text-cta`}`}>
              {sortBy === 'price' ?
                sortAsc ? `Low` : `High`
                :
                `Price`
              }
            </span>
          </button>
          <Search search={search} setSearch={setSearch} resetSearch={resetSearch} />
        </div>
      }
    </div>
  )
}

export default TabBar
