"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Plus, Trash2, Save, Globe, Check, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface TimeSlot {
      id: string
      date: string
      startTime: string
      endTime: string
      timezone: string
}

interface TimeSlotSelectorProps {
      submissionId: string
      projectName: string
      freelancerName: string
      onComplete: () => void
}

export default function TimeSlotSelector({
      submissionId,
      projectName,
      freelancerName,
      onComplete
}: TimeSlotSelectorProps) {
      const [slots, setSlots] = useState<TimeSlot[]>([])
      const [availableDates, setAvailableDates] = useState<string[]>([])
      const [detectedTimezone, setDetectedTimezone] = useState("")
      const [loading, setLoading] = useState(false)
      const [existingSlots, setExistingSlots] = useState<any[]>([])
      const [expandedDateIndex, setExpandedDateIndex] = useState<number | null>(null)

      // Load existing slots on mount
      useEffect(() => {
            loadExistingSlots()

            // Auto-detect timezone
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            setDetectedTimezone(timezone)

            // Initialize with 3 empty date slots (next 3 days)
            const today = new Date()
            const dates = Array.from({ length: 3 }, (_, i) => {
                  const date = new Date(today)
                  date.setDate(today.getDate() + i + 1) // Start from tomorrow
                  return date.toISOString().split('T')[0]
            })
            setAvailableDates(dates)
      }, [])

      const loadExistingSlots = async () => {
            try {
                  const response = await fetch(`/api/freelancer/availability/get?submissionId=${submissionId}`)
                  const data = await response.json()

                  if (data.availability && data.availability.length > 0) {
                        // Map the availability slots to component format
                        const existingTimeSlots = data.availability.map((slot: any, index: number) => ({
                              id: `existing-${index}-${Date.now()}`,
                              date: slot.date,
                              startTime: slot.startTime,
                              endTime: slot.endTime,
                              timezone: slot.timezone
                        }))

                        setSlots(existingTimeSlots)

                        // Get unique dates from existing slots
                        const uniqueDates: string[] = Array.from(new Set(existingTimeSlots.map((slot: TimeSlot) => slot.date)))
                        if (uniqueDates.length >= 3) {
                              setAvailableDates(uniqueDates.slice(0, 3))
                        }
                  }
            } catch (error) {
                  console.error('Error loading existing slots:', error)
            }
      }

      const generateSlotId = () => `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      const addTimeSlot = (dateIndex: number) => {
            const date = availableDates[dateIndex]
            const newSlot: TimeSlot = {
                  id: generateSlotId(),
                  date,
                  startTime: "09:00",
                  endTime: "10:00",
                  timezone: detectedTimezone
            }

            // Ensure the date has at least one slot before expanding
            if (!slots.some(slot => slot.date === date)) {
                  setExpandedDateIndex(dateIndex)
            }

            setSlots(prev => [...prev, newSlot])
      }

      const removeTimeSlot = (slotId: string) => {
            const slotToRemove = slots.find(slot => slot.id === slotId)
            const date = slotToRemove?.date

            setSlots(prev => prev.filter(slot => slot.id !== slotId))

            // If this was the last slot for a date, collapse it
            if (date && !slots.some(slot => slot.date === date && slot.id !== slotId)) {
                  const dateIndex = availableDates.indexOf(date)
                  if (dateIndex === expandedDateIndex) {
                        setExpandedDateIndex(null)
                  }
            }
      }

      const updateTimeSlot = (slotId: string, field: keyof TimeSlot, value: string) => {
            setSlots(prev => prev.map(slot =>
                  slot.id === slotId ? { ...slot, [field]: value } : slot
            ))
      }

      const updateDate = (index: number, newDate: string) => {
            const oldDate = availableDates[index]
            const newDates = [...availableDates]
            newDates[index] = newDate

            // Update slots that use the old date
            const updatedSlots = slots.map(slot =>
                  slot.date === oldDate ? { ...slot, date: newDate } : slot
            )

            setAvailableDates(newDates)
            setSlots(updatedSlots)

            // If this date was expanded, keep it expanded
            if (expandedDateIndex === index) {
                  setExpandedDateIndex(index)
            }
      }

      const toggleDateExpansion = (index: number) => {
            setExpandedDateIndex(expandedDateIndex === index ? null : index)
      }

      const validateSlots = () => {
            // Check we have exactly 3 unique dates
            const uniqueDates = [...new Set(availableDates)]
            if (uniqueDates.length !== 3) {
                  toast.error("Please provide exactly 3 different dates")
                  return false
            }

            // Check each date has at least one time slot
            const slotsByDate = availableDates.map(date =>
                  slots.filter(slot => slot.date === date).length
            )

            if (slotsByDate.some(count => count === 0)) {
                  toast.error("Each date must have at least one time slot")
                  return false
            }

            // Validate time slots
            for (const slot of slots) {
                  if (slot.startTime >= slot.endTime) {
                        toast.error("End time must be after start time")
                        return false
                  }

                  // Check slot duration (minimum 30 minutes, maximum 2 hours)
                  const start = new Date(`2000-01-01T${slot.startTime}`)
                  const end = new Date(`2000-01-01T${slot.endTime}`)
                  const duration = (end.getTime() - start.getTime()) / (1000 * 60) // in minutes

                  if (duration < 30) {
                        toast.error("Each time slot must be at least 30 minutes")
                        return false
                  }

                  if (duration > 120) {
                        toast.error("Each time slot must be no more than 2 hours")
                        return false
                  }

                  // Check if slot is at least 24 hours in the future
                  const slotDateTime = new Date(`${slot.date}T${slot.startTime}`)
                  const now = new Date()
                  const hoursDifference = (slotDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

                  if (hoursDifference < 24) {
                        toast.error("Time slots must be at least 24 hours in advance")
                        return false
                  }
            }

            return true
      }

      const handleSubmit = async () => {
            if (!validateSlots()) return

            setLoading(true)
            try {
                  const response = await fetch('/api/freelancer/availability/set', {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                              submissionId,
                              availability: slots.map(({ id, ...slot }) => slot) // Remove id before sending
                        })
                  })

                  const data = await response.json()

                  if (!response.ok) {
                        throw new Error(data.error || 'Failed to save time slots')
                  }

                  toast.success("Time slots saved successfully! The client will be notified to choose one.")
                  onComplete()
            } catch (error: any) {
                  toast.error(error.message)
                  console.error(error)
            } finally {
                  setLoading(false)
            }
      }

      const formatDate = (dateStr: string) => {
            return new Date(dateStr).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
            })
      }

      const slotsByDate = (date: string) => {
            return slots.filter(slot => slot.date === date)
      }

      const totalSlots = slots.length
      const uniqueDates = new Set(slots.map(slot => slot.date)).size
      const isValid = validateSlots()

      return (
            <Card className="border-2 border-yellow-400 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-b border-yellow-200">
                        <CardTitle className="flex items-center gap-2 text-yellow-900">
                              <Calendar className="h-6 w-6 text-yellow-600" />
                              Select Your Available Time Slots
                        </CardTitle>
                        <div className="space-y-2">
                              <p className="text-sm text-yellow-800">
                                    For: <span className="font-semibold">{projectName}</span> • Select 3 different dates with your available time slots
                              </p>
                              {existingSlots.length > 0 && (
                                    <Badge variant="outline" className="w-fit bg-yellow-100 text-yellow-800 border-yellow-300">
                                          <Check className="h-3 w-3 mr-1" />
                                          {existingSlots.length} existing slots loaded
                                    </Badge>
                              )}
                        </div>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                        {/* Instructions */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
                              <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                    </div>
                                    <div>
                                          <h4 className="font-semibold text-blue-900 mb-3 text-lg">Instructions:</h4>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div className="flex items-start gap-2">
                                                      <div className="bg-blue-100 p-1 rounded mt-0.5">
                                                            <span className="text-blue-700 text-xs font-bold">1</span>
                                                      </div>
                                                      <span className="text-sm text-blue-800">Select <strong>3 different dates</strong> (24+ hours ahead)</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                      <div className="bg-blue-100 p-1 rounded mt-0.5">
                                                            <span className="text-blue-700 text-xs font-bold">2</span>
                                                      </div>
                                                      <span className="text-sm text-blue-800">Add <strong>at least one time slot per date</strong></span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                      <div className="bg-blue-100 p-1 rounded mt-0.5">
                                                            <span className="text-blue-700 text-xs font-bold">3</span>
                                                      </div>
                                                      <span className="text-sm text-blue-800">Each slot: <strong>30 minutes to 2 hours</strong></span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                      <div className="bg-blue-100 p-1 rounded mt-0.5">
                                                            <span className="text-blue-700 text-xs font-bold">4</span>
                                                      </div>
                                                      <span className="text-sm text-blue-800">Client chooses <strong>one slot</strong> from your availability</span>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>

                        {/* Date Selection Header */}
                        <div className="space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                          <h3 className="font-bold text-lg text-gray-800">Select 3 Different Dates</h3>
                                          <p className="text-sm text-gray-600">Click on each date to add time slots</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                          <Badge variant={uniqueDates === 3 ? "default" : "outline"}
                                                className={`px-3 py-1 ${uniqueDates === 3 ? 'bg-green-100 text-green-800 border-green-300' : 'border-gray-300'}`}>
                                                {uniqueDates}/3 dates
                                          </Badge>
                                          <Badge variant={totalSlots >= 3 ? "default" : "outline"}
                                                className={`px-3 py-1 ${totalSlots >= 3 ? 'bg-green-100 text-green-800 border-green-300' : 'border-gray-300'}`}>
                                                {totalSlots} slot{totalSlots !== 1 ? 's' : ''}
                                          </Badge>
                                    </div>
                              </div>

                              <div className="space-y-3">
                                    {availableDates.map((date, index) => {
                                          const dateSlots = slotsByDate(date)
                                          const hasSlots = dateSlots.length > 0
                                          const isExpanded = expandedDateIndex === index

                                          return (
                                                <div key={index} className="border-2 border-yellow-300 rounded-xl overflow-hidden bg-white hover:border-yellow-400 transition-colors">
                                                      {/* Date Header - Clickable */}
                                                      <div
                                                            className="p-4 cursor-pointer hover:bg-yellow-50 transition-colors"
                                                            onClick={() => toggleDateExpansion(index)}
                                                      >
                                                            <div className="flex items-center justify-between">
                                                                  <div className="flex items-center gap-3">
                                                                        <div className="relative">
                                                                              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                                                                    <span className="text-white font-bold">{index + 1}</span>
                                                                              </div>
                                                                        </div>
                                                                        <div>
                                                                              <div className="flex items-center gap-2">
                                                                                    <h4 className="font-semibold text-gray-800">Date {index + 1}</h4>
                                                                                    {hasSlots && (
                                                                                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
                                                                                                {dateSlots.length} slot{dateSlots.length !== 1 ? 's' : ''}
                                                                                          </Badge>
                                                                                    )}
                                                                              </div>
                                                                              <p className="text-sm text-gray-600">{formatDate(date)}</p>
                                                                        </div>
                                                                  </div>
                                                                  <div className="flex items-center gap-3">
                                                                        <div className="text-right">
                                                                              <Input
                                                                                    type="date"
                                                                                    value={date}
                                                                                    onChange={(e) => updateDate(index, e.target.value)}
                                                                                    min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                                                                    className="border-yellow-300 hover:border-yellow-400 focus:border-yellow-500 w-40"
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                              />
                                                                        </div>
                                                                        <Button
                                                                              type="button"
                                                                              size="sm"
                                                                              variant="ghost"
                                                                              className="text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100"
                                                                              onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    toggleDateExpansion(index)
                                                                              }}
                                                                        >
                                                                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                                        </Button>
                                                                  </div>
                                                            </div>
                                                      </div>

                                                      {/* Expanded Content */}
                                                      {isExpanded && (
                                                            <div className="border-t border-yellow-200 p-4 bg-gradient-to-b from-yellow-50 to-white">
                                                                  <div className="flex items-center justify-between mb-4">
                                                                        <div className="flex items-center gap-2">
                                                                              <Clock className="h-4 w-4 text-yellow-600" />
                                                                              <Label className="font-medium text-gray-700">Available Time Slots</Label>
                                                                        </div>
                                                                        <Button
                                                                              type="button"
                                                                              size="sm"
                                                                              variant="outline"
                                                                              onClick={() => addTimeSlot(index)}
                                                                              className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800"
                                                                        >
                                                                              <Plus className="h-3.5 w-3.5 mr-1.5" />
                                                                              Add Time Slot
                                                                        </Button>
                                                                  </div>

                                                                  {dateSlots.length === 0 ? (
                                                                        <div className="text-center py-8 border-2 border-dashed border-yellow-300 rounded-lg bg-yellow-50/50">
                                                                              <Clock className="h-10 w-10 text-yellow-400 mx-auto mb-3" />
                                                                              <p className="text-gray-600 mb-3">No time slots added for this date</p>
                                                                              <Button
                                                                                    type="button"
                                                                                    size="sm"
                                                                                    variant="outline"
                                                                                    onClick={() => addTimeSlot(index)}
                                                                                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                                                                              >
                                                                                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                                                                                    Add First Time Slot
                                                                              </Button>
                                                                        </div>
                                                                  ) : (
                                                                        <div className="space-y-3">
                                                                              {dateSlots.map((slot) => (
                                                                                    <div key={slot.id} className="flex items-center gap-3 p-3 border-2 border-yellow-200 rounded-lg bg-white hover:border-yellow-300 transition-colors">
                                                                                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                                                <div>
                                                                                                      <Label className="text-xs font-medium text-gray-600 mb-1.5 block">Start Time</Label>
                                                                                                      <div className="relative">
                                                                                                            <Input
                                                                                                                  type="time"
                                                                                                                  value={slot.startTime}
                                                                                                                  onChange={(e) => updateTimeSlot(slot.id, 'startTime', e.target.value)}
                                                                                                                  className="border-yellow-300 hover:border-yellow-400 focus:border-yellow-500"
                                                                                                            />
                                                                                                      </div>
                                                                                                </div>
                                                                                                <div>
                                                                                                      <Label className="text-xs font-medium text-gray-600 mb-1.5 block">End Time</Label>
                                                                                                      <div className="relative">
                                                                                                            <Input
                                                                                                                  type="time"
                                                                                                                  value={slot.endTime}
                                                                                                                  onChange={(e) => updateTimeSlot(slot.id, 'endTime', e.target.value)}
                                                                                                                  className="border-yellow-300 hover:border-yellow-400 focus:border-yellow-500"
                                                                                                            />
                                                                                                      </div>
                                                                                                </div>
                                                                                          </div>
                                                                                          <Button
                                                                                                type="button"
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                onClick={() => removeTimeSlot(slot.id)}
                                                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                                                                                                disabled={dateSlots.length <= 1}
                                                                                                title={dateSlots.length <= 1 ? "Each date must have at least one slot" : "Remove time slot"}
                                                                                          >
                                                                                                <Trash2 className="h-4 w-4" />
                                                                                          </Button>
                                                                                    </div>
                                                                              ))}
                                                                        </div>
                                                                  )}
                                                            </div>
                                                      )}
                                                </div>
                                          )
                                    })}
                              </div>
                        </div>

                        {/* Timezone Section */}
                        <div className="space-y-3 p-5 border-2 border-yellow-300 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50">
                              <div className="flex items-center gap-3">
                                    <div className="bg-yellow-100 p-2 rounded-lg">
                                          <Globe className="h-5 w-5 text-yellow-700" />
                                    </div>
                                    <div>
                                          <Label className="font-semibold text-gray-800">Timezone</Label>
                                          <p className="text-sm text-gray-600">All time slots will be shown in this timezone</p>
                                    </div>
                              </div>
                              <select
                                    className="w-full border-2 border-yellow-300 rounded-lg p-3 bg-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                                    value={detectedTimezone}
                                    onChange={(e) => {
                                          setDetectedTimezone(e.target.value)
                                          setSlots(slots.map(slot => ({
                                                ...slot,
                                                timezone: e.target.value
                                          })))
                                    }}
                              >
                                    <option value="">Select timezone</option>
                                    {Intl.supportedValuesOf('timeZone').map(tz => (
                                          <option key={tz} value={tz}>{tz}</option>
                                    ))}
                              </select>
                              <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-600">Detected:</span>
                                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                          {detectedTimezone}
                                    </Badge>
                              </div>
                        </div>

                        {/* Summary Section */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                              <h4 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                          <Check className="h-5 w-5 text-green-600" />
                                    </div>
                                    Summary
                              </h4>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:border-yellow-300 transition-colors">
                                          <div className="text-2xl font-bold text-gray-800">{uniqueDates}</div>
                                          <div className="text-sm text-gray-600 mt-1">Unique Dates</div>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:border-yellow-300 transition-colors">
                                          <div className="text-2xl font-bold text-gray-800">{totalSlots}</div>
                                          <div className="text-sm text-gray-600 mt-1">Total Slots</div>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:border-yellow-300 transition-colors">
                                          <div className="text-xl font-bold text-gray-800 truncate">{detectedTimezone.split('/')[0]}</div>
                                          <div className="text-sm text-gray-600 mt-1">Timezone</div>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:border-yellow-300 transition-colors">
                                          <div className="text-2xl font-bold text-gray-800">30min-2hrs</div>
                                          <div className="text-sm text-gray-600 mt-1">Slot Duration</div>
                                    </div>
                              </div>

                              {/* Validation Status */}
                              <div className={`p-4 rounded-lg ${isValid ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' : 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200'}`}>
                                    <div className="flex items-center gap-3">
                                          <div className={`p-2 rounded-lg ${isValid ? 'bg-green-100' : 'bg-yellow-100'}`}>
                                                {isValid ? (
                                                      <Check className="h-5 w-5 text-green-600" />
                                                ) : (
                                                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                                                )}
                                          </div>
                                          <div>
                                                <p className={`font-medium ${isValid ? 'text-green-800' : 'text-yellow-800'}`}>
                                                      {isValid ? (
                                                            <>✓ All requirements met! Ready to submit your availability.</>
                                                      ) : (
                                                            <>⚠ Please complete all requirements above before submitting.</>
                                                      )}
                                                </p>
                                                <p className={`text-sm mt-1 ${isValid ? 'text-green-700' : 'text-yellow-700'}`}>
                                                      {isValid ?
                                                            "The client will be able to choose one slot from your availability." :
                                                            "Make sure you have 3 dates, each with at least one time slot (30min-2hrs each)."
                                                      }
                                                </p>
                                          </div>
                                    </div>
                              </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                              onClick={handleSubmit}
                              disabled={loading || !isValid}
                              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                              {loading ? (
                                    <div className="flex items-center justify-center gap-3">
                                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                          <span>Saving Time Slots...</span>
                                    </div>
                              ) : (
                                    <div className="flex items-center justify-center gap-3">
                                          <Save className="h-5 w-5" />
                                          <span className="text-lg">{existingSlots.length > 0 ? 'Update Time Slots' : 'Submit Time Slots'}</span>
                                    </div>
                              )}
                        </Button>
                  </CardContent>
            </Card>
      )
}