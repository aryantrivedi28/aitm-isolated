"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2 } from "lucide-react"

interface AIPromptInputProps {
  onGenerateAction: (prompt: string, type: "terms" | "payment_terms" | "deliverables" | "scope") => Promise<void>
  loading?: boolean
  title: string
  placeholder: string
  type: "terms" | "payment_terms" | "deliverables" | "scope"
  icon?: React.ReactNode // 👈 allow passing a custom icon
}

export function AIPromptInput({
  onGenerateAction,
  loading = false,
  title,
  placeholder,
  type,
  icon,
}: AIPromptInputProps) {
  const [prompt, setPrompt] = useState("")

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    await onGenerateAction(prompt, type)
    setPrompt("")
  }

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center gap-2">
          {icon ?? <Sparkles className="w-4 h-4 text-[#FFE01B]" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="bg-white/5 border-white/20 text-white text-sm"
          placeholder={placeholder}
          rows={2}
        />
        <Button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          size="sm"
          className="bg-[#FFE01B] text-black hover:bg-[#FFE01B]/90 w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 mr-2" />
              Generate with AI
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
