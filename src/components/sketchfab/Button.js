import React from 'react'

export const SketchFabButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-white px-4 w-auto h-10 bg-red-600 rounded-full hover:bg-red-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none"
    >
      <span className="text-2xl">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#000"
          data-darkreader-inline-color=""
          data-darkreader-inline-fill=""
        >
          <title>Object</title>
          <path
            d="M17.5 13.336v-6.67a1.25 1.25 0 00-.62-1.079l-5.938-3.455a1.873 1.873 0 00-1.885 0L3.121 5.587A1.25 1.25 0 002.5 6.666v6.67a1.25 1.25 0 00.62 1.08l5.938 3.455a1.875 1.875 0 001.885 0l5.937-3.456a1.249 1.249 0 00.62-1.079z"
            stroke="#000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-darkreader-inline-stroke=""
          ></path>
          <path
            d="M2.695 6.016L10 10.313l7.305-4.297"
            stroke="#000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-darkreader-inline-stroke=""
          ></path>
          <path
            d="M10 18.125v-7.812"
            stroke="#000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-darkreader-inline-stroke=""
          ></path>
        </svg>
      </span>
    </button>
  )
}
