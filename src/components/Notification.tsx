'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle,
  AlertCircle,
  Info,
  X
} from 'lucide-react'


export default function Notification({ message, type = 'info', onClose, duration = 5000 }: { message: string; type?: 'success' | 'error' | 'info'; onClose?: () => void; duration?: number }) {
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose && onClose(), 300)
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])
  
  if (!isVisible) return null
  
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500',
      textColor: 'text-white',
      borderColor: 'border-green-600'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-500',
      textColor: 'text-white',
      borderColor: 'border-red-600'
    },
    info: {
      icon: Info,
      bgColor: 'bg-[#f7af00]',
      textColor: 'text-[#050504]',
      borderColor: 'border-[#e09e00]'
    }
  }
  
  const { icon: Icon, bgColor, textColor, borderColor } = config[type as keyof typeof config] || config.info
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`
        ${bgColor} ${textColor} ${borderColor}
        border-l-4 rounded-lg shadow-lg p-4 max-w-md
        transform transition-all duration-300 ease-in-out
      `}>
        <div className="flex items-start">
          <Icon className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1 mr-2">
            <p className="font-semibold">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              onClose && onClose()
            }}
            className="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}