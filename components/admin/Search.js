import { XCircleIcon } from "@heroicons/react/outline"
import { XIcon } from "@heroicons/react/solid"

const Search = ({ search, setSearch, resetSearch }) => {
  return (
    <div className='relative'>
      <input type='text' value={search} onChange={(e) => setSearch(e.target.value)} name='search' placeholder='Search' className='ml-2 border-detail dark:border-detail-dark' />
      <button onClick={resetSearch} className='absolute top-3 right-2 text-brand-dark/20 hover:text-cta h-max'>
        <XIcon className='w-5' />
      </button>
    </div>
  )
}

export default Search
