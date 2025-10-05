"use client"

import * as React from "react"
import { Toast, ToastProps } from "@/components/ui/toast"

type ToasterToast = ToastProps & { id: string }

const ToastContext = React.createContext<{
  toasts: ToasterToast[]
  addToast: (toast: Omit<ToasterToast, "id">) => void
}>({
  toasts: [],
  addToast: () => {},
})

export function useToast() {
  return React.useContext(ToastContext)
}
