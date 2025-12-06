// app/components/client/TimeSlotSelectorModal.tsx
"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Globe, Check, AlertCircle, X, Loader2, User, MessageSquare } from "lucide-react"
import toast from "react-hot-toast"

interface TimeSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  timezone: string
  status: string
}

interface TimeSlotSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  submissionId: string
  freelancerName: string
  freelancerEmail: string
  onSuccess?: () => void
}

export default function TimeSlotSelectorModal({
  isOpen,
  onClose,
  submissionId,
  freelancerName,
  freelancerEmail,
  onSuccess
}: TimeSlotSelectorModalProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [clientNotes, setClientNotes] = useState("")
  const [timezoneGroups, setTimezoneGroups] = useState<Record<string, TimeSlot[]>>({})

  useEffect(() => {
    if (isOpen && submissionId) {
      fetchAvailability()
    }
  }, [isOpen, submissionId])

  const fetchAvailability = async () => {
    setFetching(true)
    try {
      const response = await fetch(`/api/client/freelancer-availability?submissionId=${submissionId}`, {
        credentials: "include"
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch availability')
      }
      
      if (data.availability && data.availability.length > 0) {
        setSlots(data.availability)
        
        // Group by date for better display
        const grouped: Record<string, TimeSlot[]> = {}
        data.availability.forEach((slot: TimeSlot) => {
          const date = slot.date
          if (!grouped[date]) {
            grouped[date] = []
          }
          grouped[date].push(slot)
        })
        setTimezoneGroups(grouped)
      } else {
        toast.error("No available time slots found")
        onClose()
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load availability")
      console.error(error)
      onClose()
    } finally {
      setFetching(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const suffix = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${suffix}`
  }

  const handleSelectSlot = (slotId: string) => {
    setSelectedSlotId(slotId)
  }

  const handleSubmit = async () => {
    if (!selectedSlotId) {
      toast.error("Please select a time slot")
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/client/select-timeslot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          submissionId,
          slotId: selectedSlotId,
          clientNotes
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to select time slot')
      }

      toast.success(data.message || "Time slot selected successfully!")
      
      if (onSuccess) {
        onSuccess()
      }
      
      onClose()
    } catch (error: any) {
      toast.error(error.message || "Failed to select time slot")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const selectedSlot = slots.find(s => s.id === selectedSlotId)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/20 via-[#FCD34D]/10 to-transparent"></div>
          <div className="relative flex items-center justify-between p-6 border-b border-[#241C15]/10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-[#FFE01B]/20">
                  <Calendar className="w-6 h-6 text-[#241C15]" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black text-[#241C15] tracking-tight">
                  Schedule Interview
                </h2>
              </div>
              <div className="flex items-center gap-2 text-[#241C15]/70 ml-14">
                <User className="w-4 h-4" strokeWidth={2.5} />
                <p className="text-sm font-semibold">
                  {freelancerName}
                </p>
                <span className="text-[#241C15]/40">•</span>
                <p className="text-sm font-medium">
                  {freelancerEmail}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl hover:bg-[#241C15]/10 transition-all duration-200 group"
              disabled={loading}
            >
              <X className="w-6 h-6 text-[#241C15] group-hover:rotate-90 transition-transform duration-200" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(92vh-120px)] overflow-y-auto">
          {fetching ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <Loader2 className="w-14 h-14 text-[#FFE01B] animate-spin" strokeWidth={2.5} />
                <div className="absolute inset-0 w-14 h-14 rounded-full bg-[#FFE01B]/20 animate-ping"></div>
              </div>
              <p className="text-[#241C15] font-semibold mt-6">Loading available time slots...</p>
              <p className="text-[#241C15]/50 text-sm mt-1">This will only take a moment</p>
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex p-6 rounded-full bg-[#241C15]/5 mb-4">
                <AlertCircle className="w-16 h-16 text-[#241C15]/30" strokeWidth={2} />
              </div>
              <p className="text-xl font-bold text-[#241C15] mb-2">No Time Slots Available</p>
              <p className="text-sm text-[#241C15]/50 max-w-sm mx-auto">
                The freelancer hasn't configured their availability yet. Please check back later or contact them directly.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Instructions */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-blue-100">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-900 mb-3 text-base">How It Works</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-blue-800">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                        <span className="font-medium">Choose your preferred interview time from the available slots below</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-blue-800">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                        <span className="font-medium">Our admin team will schedule the meeting via Calendly and send invites</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-blue-800">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                        <span className="font-medium">You'll receive email confirmation with meeting details within 24 hours</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Timezone Info */}
              {slots[0]?.timezone && (
                <div className="flex items-center justify-center">
                  <div className="inline-flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-[#FFE01B]/15 to-[#FCD34D]/15 rounded-full border-2 border-[#FFE01B]/30 shadow-sm">
                    <Globe className="w-5 h-5 text-[#241C15]" strokeWidth={2.5} />
                    <span className="text-sm font-bold text-[#241C15]">
                      All times displayed in {slots[0].timezone}
                    </span>
                  </div>
                </div>
              )}

              {/* Available Slots */}
              <div className="space-y-5">
                {Object.entries(timezoneGroups).map(([date, dateSlots]) => (
                  <div key={date} className="border-2 border-[#241C15]/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="bg-gradient-to-r from-[#fbf5e5] to-[#fbf5e5]/60 px-5 py-4 border-b-2 border-[#241C15]/10">
                      <h3 className="font-black text-lg text-[#241C15] mb-1">
                        {formatDate(date)}
                      </h3>
                      <p className="text-xs text-[#241C15]/60 font-semibold uppercase tracking-wide">
                        {dateSlots.length} Available Slot{dateSlots.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {dateSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => handleSelectSlot(slot.id)}
                          className={`group relative p-4 rounded-xl border-2 transition-all duration-200 ${
                            selectedSlotId === slot.id
                              ? 'border-[#FFE01B] bg-gradient-to-br from-[#FFE01B]/15 to-[#FCD34D]/10 shadow-md scale-[1.02]'
                              : 'border-[#241C15]/10 hover:border-[#FFE01B]/50 hover:bg-[#fbf5e5]/40 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <div className="flex items-center gap-2 mb-1.5">
                                <Clock className={`w-4 h-4 ${
                                  selectedSlotId === slot.id ? 'text-[#FFE01B]' : 'text-[#241C15]/60'
                                }`} strokeWidth={2.5} />
                                <span className="font-bold text-[#241C15] text-base">
                                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-[#241C15]/50 font-semibold">
                                  Duration: {calculateDuration(slot.startTime, slot.endTime)}
                                </span>
                              </div>
                            </div>
                            
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                              selectedSlotId === slot.id 
                                ? 'bg-[#FFE01B] scale-100' 
                                : 'bg-[#241C15]/5 scale-0 group-hover:scale-100'
                            }`}>
                              <Check className={`w-4 h-4 ${
                                selectedSlotId === slot.id ? 'text-white' : 'text-[#241C15]/40'
                              }`} strokeWidth={3} />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Client Notes */}
              {selectedSlotId && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="flex items-center gap-2 text-sm font-bold text-[#241C15] mb-3">
                    <MessageSquare className="w-4 h-4 text-[#241C15]/60" strokeWidth={2.5} />
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder="Share any special requirements, topics to discuss, or preferences for the admin team..."
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-[#241C15]/10 focus:border-[#FFE01B] focus:ring-4 focus:ring-[#FFE01B]/20 outline-none transition-all bg-white text-[#241C15] placeholder:text-[#241C15]/40 font-medium resize-none"
                    rows={3}
                    maxLength={500}
                  />
                  <p className="text-xs text-[#241C15]/40 mt-2 font-medium">
                    {clientNotes.length}/500 characters
                  </p>
                </div>
              )}

              {/* Selected Slot Summary */}
              {selectedSlot && (
                <div className="animate-in slide-in-from-bottom-2 duration-300">
                  <div className="relative overflow-hidden rounded-2xl border-2 border-green-300 bg-gradient-to-br from-green-50 via-emerald-50 to-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-xl bg-green-100">
                          <Check className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                        </div>
                        <div>
                          <h4 className="font-bold text-green-900 mb-2 text-base">
                            Selected Time Slot
                          </h4>
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-green-800">
                              📅 {formatDate(selectedSlot.date)}
                            </p>
                            <p className="text-sm font-semibold text-green-800">
                              🕐 {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                            </p>
                            <p className="text-xs text-green-700 font-medium mt-1">
                              Duration: {calculateDuration(selectedSlot.startTime, selectedSlot.endTime)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedSlotId(null)}
                        className="text-xs text-red-600 hover:text-red-700 font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3.5 rounded-xl font-bold bg-white border-2 border-[#241C15]/15 text-[#241C15] hover:border-[#241C15]/30 hover:bg-[#fbf5e5]/30 transition-all duration-200"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedSlotId || loading}
                  className="flex-1 px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] text-[#241C15] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" strokeWidth={2.5} />
                      <span>Confirm Selection</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function to calculate duration
function calculateDuration(startTime: string, endTime: string): string {
  const start = new Date(`2000-01-01T${startTime}`)
  const end = new Date(`2000-01-01T${endTime}`)
  const duration = (end.getTime() - start.getTime()) / (1000 * 60) // minutes
  
  if (duration < 60) {
    return `${duration} min`
  } else if (duration === 60) {
    return '1 hour'
  } else {
    const hours = Math.floor(duration / 60)
    const mins = duration % 60
    return mins > 0 ? `${hours}h ${mins}min` : `${hours} hours`
  }
}