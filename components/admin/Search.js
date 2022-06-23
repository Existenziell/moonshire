import { XCircleIcon } from "@heroicons/react/outline"

const Search = ({ search, setSearch, resetSearch }) => {
  return (
    <div className='relative'>
      <input type='text' value={search} onChange={(e) => setSearch(e.target.value)} name='search' placeholder='Search' className='ml-2 border-detail dark:border-detail-dark' />
      <button onClick={resetSearch} className=' absolute top-3 right-2 hover:text-cta'>
        <XCircleIcon className='w-5' />
      </button>
    </div>
  )
}

export default Search
