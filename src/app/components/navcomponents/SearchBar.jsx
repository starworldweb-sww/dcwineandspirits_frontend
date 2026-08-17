"use client";

import { Search } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'


const ROTATING_WORDS = [
  "wine",
  "champagne",
  "veuve clicquot",
  "gift baskets",
  "caymus",
  "birthday gifts",
  "dom perignon"
  
]

const STATIC_PREFIX = "Search for"

// 2. Typewriter timing (ms mein) 
const TYPING_SPEED = 80
const DELETING_SPEED = 40
const PAUSE_AFTER_TYPE = 1400
const PAUSE_AFTER_DELETE = 300

const SearchBar = () => {
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  // 3. User type kar raha ho ya field focused ho to animation ki zaroorat
  //    nahi — real placeholder-jaisa behavior sirf tabhi dikhega jab
  //    input khaali aur unfocused ho.
  const showAnimatedPlaceholder = inputValue.length === 0 && !isFocused

  useEffect(() => {
    if (!showAnimatedPlaceholder) return

    const currentWord = ROTATING_WORDS[wordIndex]
    let timeout

    if (!isDeleting && displayedText.length < currentWord.length) {
      timeout = setTimeout(() => {
        setDisplayedText(currentWord.slice(0, displayedText.length + 1))
      }, TYPING_SPEED)
    } else if (!isDeleting && displayedText.length === currentWord.length) {
      timeout = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE)
    } else if (isDeleting && displayedText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayedText(currentWord.slice(0, displayedText.length - 1))
      }, DELETING_SPEED)
    } else if (isDeleting && displayedText.length === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length)
      }, PAUSE_AFTER_DELETE)
    }

    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, wordIndex, showAnimatedPlaceholder])

  return (
    <>
       <div className="order-3 lg:order-none w-full lg:flex-1 lg:max-w-[635px]">
        <div className="relative flex items-center border border-gray-300 rounded-full overflow-hidden h-[38px] md:h-[44px]">
          <input
            type="text"
            name="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoComplete="off"
            spellCheck="false"
            dir="auto"
            className="w-full h-full px-5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
          />

          {/* 4. Animated overlay — asli placeholder ke upar bilkul same
                position pe baithta hai, sirf jab input khaali/unfocused ho. */}
          {showAnimatedPlaceholder && (
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-sm text-gray-400 flex items-center gap-1">
              {STATIC_PREFIX}
              <span>{displayedText}</span>
              <span className="ml-0.5 w-[1px] h-[14px] bg-gray-400 animate-caret" />
            </span>
          )}

          <button className="shrink-0 bg-[#98022e] hover:bg-[#7e1a3c] text-white h-full aspect-square flex items-center justify-center transition-colors cursor-pointer" title='Search'>
            <Search size={18} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .animate-caret {
          animation: caretBlink 800ms steps(1) infinite;
        }
        @keyframes caretBlink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
      `}</style>
    </>
  )
}

export default SearchBar