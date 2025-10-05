"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"

type AIPromptInputProps = {
  title: string
  placeholder?: string
  type: string
  loading?: boolean
  icon?: React.ReactNode
  onGenerateAction: (prompt: string, type: string) => void | Promise<void>
}

export function AIPromptInput({
  title,
  placeholder = "Describe what you want to generate...",
  type,
  loading = false,
  icon,
  onGenerateAction,
}: AIPromptInputProps) {
  const [value, setValue] = useState("")

  const handleGenerate = async () => {
    if (!value.trim() || loading) return
    await onGenerateAction(value.trim(), type)
  }

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-sm flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleGenerate()
          }}
        />
        <Button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !value.trim()}
          className="whitespace-nowrap bg-[#FFE01B] text-black hover:bg-[#FFE01B]/90"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Generate
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
