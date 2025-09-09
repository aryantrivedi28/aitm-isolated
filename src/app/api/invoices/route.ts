import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "../../../lib/agreements/supabase-server"
import type { Invoice } from "../../../types/agreement"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const clientId = searchParams.get("client_id")

    let query = supabase.from("invoices").select(`
        *,
        invoice_items (*)
      `)

    if (status) {
      query = query.eq("status", status)
    }

    if (clientId) {
      query = query.eq("client_id", clientId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ invoices: data })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { items, ...invoiceData } = body

    // Generate invoice number if not provided
    if (!invoiceData.invoice_number) {
      const timestamp = Date.now()
      invoiceData.invoice_number = `INV-${timestamp}`
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.quantity * item.rate, 0)
    const taxAmount = invoiceData.tax_rate ? (subtotal * invoiceData.tax_rate) / 100 : 0
    const totalAmount = subtotal + taxAmount

    const invoice: Partial<Invoice> = {
      ...invoiceData,
      amount: subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Insert invoice
    const { data: invoiceResult, error: invoiceError } = await supabase
      .from("invoices")
      .insert([invoice])
      .select()
      .single()

    if (invoiceError) {
      throw new Error(invoiceError.message)
    }

    // Insert invoice items
    if (items && items.length > 0) {
      const invoiceItems = items.map((item: any) => ({
        invoice_id: invoiceResult.id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.quantity * item.rate,
      }))

      const { error: itemsError } = await supabase.from("invoice_items").insert(invoiceItems)

      if (itemsError) {
        console.error("Error inserting invoice items:", itemsError)
        // Don't fail the entire request, just log the error
      }
    }

    return NextResponse.json({
      invoice: invoiceResult,
      message: "Invoice created successfully",
    })
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, items, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 })
    }

    // Recalculate totals if items are provided
    if (items) {
      const subtotal = items.reduce((sum: number, item: any) => sum + item.quantity * item.rate, 0)
      const taxAmount = updateData.tax_rate ? (subtotal * updateData.tax_rate) / 100 : 0
      const totalAmount = subtotal + taxAmount

      updateData.amount = subtotal
      updateData.tax_amount = taxAmount
      updateData.total_amount = totalAmount
    }

    const { data, error } = await supabase
      .from("invoices")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Update invoice items if provided
    if (items) {
      // Delete existing items
      await supabase.from("invoice_items").delete().eq("invoice_id", id)

      // Insert new items
      if (items.length > 0) {
        const invoiceItems = items.map((item: any) => ({
          invoice_id: id,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.quantity * item.rate,
        }))

        await supabase.from("invoice_items").insert(invoiceItems)
      }
    }

    return NextResponse.json({
      invoice: data,
      message: "Invoice updated successfully",
    })
  } catch (error) {
    console.error("Error updating invoice:", error)
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 })
    }

    // Delete invoice items first (cascade should handle this, but being explicit)
    await supabase.from("invoice_items").delete().eq("invoice_id", id)

    // Delete invoice
    const { error } = await supabase.from("invoices").delete().eq("id", id)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      message: "Invoice deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting invoice:", error)
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 })
  }
}
