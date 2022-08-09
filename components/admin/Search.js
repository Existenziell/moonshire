import { XIcon } from "@heroicons/react/solid"

const Search = ({ search, setSearch, resetSearch }) => {
  return (
    <div className='flex justify-end items-end absolute right-0 -top-[84px]'>
      <div className='relative'>
        <input
          type='search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          name='search'
          placeholder='SEARCH'
          className='h-[40px] min-w-[150px] text-tiny ml-2 border-2 rounded-none focus:ring-0 focus:border-cta dark:focus:border-cta dark:border-detail-dark font-serif bg-brand dark:bg-brand-dark text-black dark:text-white'
          autoComplete='off' autoCorrect='off' spellCheck='false' autoCapitalize='false'
        />
        <button onClick={resetSearch} className='absolute top-4 right-2 text-brand-dark/20 dark:text-brand/20 hover:text-cta dark:hover:text-cta h-max' aria-label='Reset search'>
          <XIcon className='w-5' />
        </button>
      </div>
    </div>
  )
}

export default Search
