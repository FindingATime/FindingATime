import { useState } from 'react'

interface ToggleButtonProps {
  timeSegmentType: string
  setTimeSegmentType: React.Dispatch<React.SetStateAction<string>>
}

export default function ToggleButton({
  timeSegmentType,
  setTimeSegmentType,
}: ToggleButtonProps) {
  const handleToggle = () => {
    setTimeSegmentType((prevType) =>
      prevType === 'Regular' ? 'Preferred' : 'Regular',
    )
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex w-40 items-center rounded-full px-4 py-2 transition-colors duration-300
        ${timeSegmentType === 'Regular' ? 'bg-emerald-300' : 'bg-sky-300'}`}
    >
      <span
        className={`mr-3 truncate font-medium text-white`}
        style={{ maxWidth: 'calc(100% - 2rem)' }} // Ensure text does not overflow the button
      >
        {timeSegmentType}
      </span>
      <div
        className={`h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300
          ${timeSegmentType === 'Regular' ? 'translate-x-0' : 'translate-x-6'}`}
      ></div>
    </button>
  )
}
