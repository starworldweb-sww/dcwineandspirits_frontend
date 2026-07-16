import { Search } from 'lucide-react'
import React from 'react'

const SearchBar = () => {
  return (
    <>
       <div className="order-3 lg:order-none w-full lg:flex-1 lg:max-w-[635px]">
        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden h-[38px] md:h-[44px]">
          <input
            type="text"
            name="search"
            placeholder="Search here..."
            autoComplete="off"
            spellCheck="false"
            dir="auto"
            className="w-full h-full px-5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
          />
          <button className="shrink-0 bg-[#98022e] hover:bg-[#7e1a3c] text-white h-full aspect-square flex items-center justify-center transition-colors cursor-pointer" title='Search'>
            <Search size={18} />
          </button>
        </div>
      </div>
    </>
  )
}

export default SearchBar
