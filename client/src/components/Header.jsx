import React, { useRef, useEffect, useState } from 'react'
import { Search, X, Sparkles, ArrowRight } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const Header = () => {
  const { setInput, input } = useAppContext()
  const inputRef = useRef()

  const onSubmitHandler = (e) => {
    e.preventDefault()
    const value = inputRef.current?.value ?? ''
    setInput(value)
  }

  const onClear = () => {
    setInput('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <header className="relative px-6 pt-24 pb-28 sm:pt-32 sm:pb-28 overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">

      {/* Background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br 
        from-purple-600 via-pink-400 to-orange-300 
        opacity-70 -z-10 pointer-events-none rounded-b-3xl"></div>

      {/* Glow Shapes */}
      <div className="absolute -top-32 -right-20 w-72 h-72 bg-purple-700/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-24 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">

        {/* Badge - Staggered Fade In */}
        <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full
            bg-indigo-700/80 backdrop-blur-sm text-white font-semibold
            animate-fade-in-down delay-100">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="text-xs font-bold tracking-widest uppercase">
            ✨ New: AI Power Added
          </span>
        </div>

        {/* Title - Staggered Fade In */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6 
            text-slate-900 dark:text-white animate-fade-in-down delay-200">
          <span className="font-light">Create Smarter</span> <br className="hidden sm:block" />

          <span
            className="bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-800
            font-extrabold"
          >
            Intelligent Blogging
          </span>{" "}
          <span className="font-light">Platform</span>
        </h1>

        {/* Subtitle - Staggered Fade In with Enhanced Typography */}
        <p className="text-slate-800 dark:text-gray-200 text-lg sm:text-xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed tracking-wide
            animate-fade-in-down delay-300">
          Your space to think out loud. Share what matters, write freely,
          and let our AI boost your creativity.
        </p>

        {/* Search Container - Glassmorphism with Staggered Fade In */}
        <form onSubmit={onSubmitHandler} className="relative max-w-2xl mx-auto group animate-lift-in delay-400">
          {/* Glassmorphism wrapper */}
          <div className="glassmorphism rounded-full p-1">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center">
              <Search className="h-6 w-6 text-slate-800/80 dark:text-gray-200" />
            </div>

            <input
              ref={inputRef}
              type="text"
              placeholder="Search for topics, ideas, or stories..."
              className="block w-full pl-14 pr-40 py-4 
                bg-white/50 dark:bg-gray-800/50 border-0
                rounded-full text-gray-800 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 font-medium
                focus:outline-none pulse-glow-focus
                transition-all"
            />

            <div className="absolute inset-y-1.5 right-1.5">
              <button
                type="submit"
                className="h-full px-8 bg-gradient-to-r from-purple-600 to-pink-500
                  hover:from-purple-700 hover:to-pink-600
                  text-white rounded-full font-bold text-sm 
                  transition-all flex items-center gap-2"
              >
                Search <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>

        {/* Clear Button - Staggered Fade In */}
        {input && (
          <div className="mt-8 animate-lift-in delay-500">
            <button
              onClick={onClear}
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 px-4 py-2 rounded-full transition-all"
            >
              <X className="w-4 h-4" />
              Clear search results
            </button>
          </div>
        )}

      </div>
    </header>
  )
}

export default Header
