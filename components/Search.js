import { XIcon } from "@heroicons/react/solid"

const Search = ({ search, setSearch, resetSearch }) => {
  return (
    <div className='admin'>
      <div className='relative'>
        <input type='text' value={search} onChange={(e) => setSearch(e.target.value)} name='search' placeholder='SEARCH' className='h-[40px] ml-2 border-none ring-detail ring-1 focus:ring-cta dark:focus:ring-cta dark:ring-detail-dark font-serif' />
        <button onClick={resetSearch} className='absolute top-4 right-2 text-brand-dark/20 dark:text-brand/20 hover:text-cta dark:hover:text-cta h-max' aria-label='Reset search'>
          <XIcon className='w-5' />
        </button>
      </div>
    </div>
  )
}

export default Search
