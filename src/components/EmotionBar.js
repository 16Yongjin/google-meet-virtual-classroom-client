import React, { useMemo } from 'react'
import MessageDelivery from './MessageInteractions'

export const EmotionButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-white px-4 w-auto h-10 bg-red-600 rounded-full hover:bg-red-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none"
    >
      <span className="text-2xl">{text}</span>
    </button>
  )
}

export const EmotionBar = () => {
  const MD = useMemo(() => new MessageDelivery(), [])

  return (
    <div className="flex gap-2 mr-4">
      <EmotionButton
        text={'👏'}
        onClick={() => MD.deliver('action', 'Clapping')}
      />
      <EmotionButton
        text={'💃'}
        onClick={() => MD.deliver('action', 'TwistDance')}
      />
      <EmotionButton
        text={'🤷'}
        onClick={() => MD.deliver('action', 'Shrugging')}
      />
    </div>
  )
}
