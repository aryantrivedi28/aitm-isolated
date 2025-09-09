"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Loader2 } from "lucide-react"

interface InvoiceItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

interface InvoiceFormData {
  invoice_number: string
  invoice_date: string
  client_name: string
  client_email: string
  client_address: string
  project_title: string
  due_date: string
  terms: string
  currency: string
  tax_rate: number
  payment_method: string
  payee_name: string
  account_number: string
  account_type: string
  routing_number: string
  items: InvoiceItem[]
}

interface InvoiceFormProps {
  onSubmitAction: (data: InvoiceFormData) => Promise<void>
  loading?: boolean
}

// Function to auto-generate invoice numbers, e.g., INV-2025-001
const generateInvoiceNumber = () => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 900 + 100) // random 3-digit
  return `INV-${year}-${random}`
}

const initialFormData: InvoiceFormData = {
  invoice_number: generateInvoiceNumber(),
  invoice_date: new Date().toISOString().split("T")[0],
  client_name: "",
  client_email: "",
  client_address: "",
  project_title: "",
  due_date: "",
  terms: "",
  currency: "USD",
  tax_rate: 0,
  payment_method: "",
  payee_name: "",
  account_number: "",
  account_type: "",
  routing_number: "",
  items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
}

export function InvoiceForm({ onSubmitAction, loading = false }: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>(initialFormData)

  // Optional: reset invoice number each time the form mounts
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      invoice_number: generateInvoiceNumber(),
      invoice_date: new Date().toISOString().split("T")[0],
    }))
  }, [])

  const handleInputChange = (field: keyof Omit<InvoiceFormData, "items">, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }

    if (field === "quantity" || field === "rate") {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate
    }

    setFormData((prev) => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, rate: 0, amount: 0 }],
    }))
  }

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }))
    }
  }

  const calculateSubtotal = () => formData.items.reduce((sum, item) => sum + item.amount, 0)
  const calculateTax = () => calculateSubtotal() * (formData.tax_rate / 100)
  const calculateTotal = () => calculateSubtotal() + calculateTax()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmitAction(formData)
    setFormData(initialFormData) // reset form
  }

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Create Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-2 block">Invoice Number</label>
                <Input
                  value={formData.invoice_number}
                  onChange={(e) => handleInputChange("invoice_number", e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="INV-2025-001"
                  required
                />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-2 block">Invoice Date</label>
                <Input
                  type="date"
                  value={formData.invoice_date}
                  onChange={(e) => handleInputChange("invoice_date", e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  required
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-2 block">Payee Name</label>
                <Input
                  value={formData.payee_name}
                  onChange={(e) => handleInputChange("payee_name", e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="Your Company Name"
                  required
                />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-2 block">Account Number</label>
                <Input
                  value={formData.account_number}
                  onChange={(e) => handleInputChange("account_number", e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="Enter account number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Payee Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-white/70 text-sm mb-2 block">Account Type</label>
              <Input
                value={formData.account_type}
                onChange={(e) => handleInputChange("account_type", e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                placeholder="Savings / Current"
                required
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-2 block">Routing Number</label>
              <Input
                value={formData.routing_number}
                onChange={(e) => handleInputChange("routing_number", e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                placeholder="Enter routing number"
                required
              />
            </div>
          </div>

          {/* Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-2 block">Client Name</label>
                <Input
                  value={formData.client_name}
                  onChange={(e) => handleInputChange("client_name", e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="Enter client name"
                  required
                />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-2 block">Client Email</label>
                <Input
                  type="email"
                  value={formData.client_email}
                  onChange={(e) => handleInputChange("client_email", e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="client@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-white/70 text-sm mb-2 block">Client Address</label>
              <Textarea
                value={formData.client_address}
                onChange={(e) => handleInputChange("client_address", e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                placeholder="Enter client address"
                rows={4}
              />
            </div>
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-white/70 text-sm mb-2 block">Project Title</label>
              <Input
                value={formData.project_title}
                onChange={(e) => handleInputChange("project_title", e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                placeholder="Enter project title"
                required
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-2 block">Due Date</label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange("due_date", e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-white/70 text-sm mb-2 block">Payment Method</label>
            <Input
              value={formData.payment_method}
              onChange={(e) => handleInputChange("payment_method", e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              placeholder="e.g. Bank Transfer / Credit Card"
            />
          </div>
          {/* Invoice Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Invoice Items</h3>
              <Button
                type="button"
                onClick={addItem}
                size="sm"
                className="bg-[#FFE01B] text-black hover:bg-[#FFE01B]/90"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 items-end p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="col-span-5">
                    <label className="text-white/70 text-xs mb-1 block">Description</label>
                    <Input
                      value={item.description}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                      className="bg-white/5 border-white/20 text-white text-sm"
                      placeholder="Item description"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-white/70 text-xs mb-1 block">Qty</label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value))}
                      className="bg-white/5 border-white/20 text-white text-sm"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-white/70 text-xs mb-1 block">Rate</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, "rate", Number.parseFloat(e.target.value))}
                      className="bg-white/5 border-white/20 text-white text-sm"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-white/70 text-xs mb-1 block">Amount</label>
                    <div className="text-white text-sm py-2 px-3 bg-white/5 border border-white/20 rounded-md">
                      {formData.currency} {item.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      onClick={() => removeItem(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      disabled={formData.items.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-2 block">Currency</label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-white/70 text-sm mb-2 block">Tax Rate (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.tax_rate}
                  onChange={(e) => handleInputChange("tax_rate", Number.parseFloat(e.target.value))}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-2 block">Payment Terms</label>
                <Textarea
                  value={formData.terms}
                  onChange={(e) => handleInputChange("terms", e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="Enter payment terms and conditions"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">Invoice Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-white/70">
                <span>Subtotal:</span>
                <span>
                  {formData.currency} {calculateSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Tax ({formData.tax_rate}%):</span>
                <span>
                  {formData.currency} {calculateTax().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-[#FFE01B] border-t border-white/10 pt-2">
                <span>Total:</span>
                <span>
                  {formData.currency} {calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="bg-[#FFE01B] text-black hover:bg-[#FFE01B]/90">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Invoice"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              Save as Draft
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
