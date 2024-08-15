'use client'

import { Toaster, toast } from 'react-hot-toast'
import React from 'react'

const ViewEvent = () => {
  const copyToClipboard = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Copied Link!')
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  return (
    <div onClick={copyToClipboard}>
      <button className="btn btn-primary">Copy Link</button>
      <Toaster />
    </div>
  )
}

export default ViewEvent
