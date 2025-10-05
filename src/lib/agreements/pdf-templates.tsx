import type { ClientAgreement, FreelancerAgreement } from "../../types/agreement"

// Helper function to check if field has content
const hasContent = (field: string | null | undefined): boolean => {
  return field !== null && field !== undefined && field.trim() !== ""
}

export function generateClientAgreementTemplate(agreement: ClientAgreement): string {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #241C15;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: #ffffff;
          }
          .logo-container {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            max-width: 200px;
            height: auto;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #FFE01B;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #241C15;
            font-size: 32px;
            margin: 0;
            font-weight: bold;
          }
          .section {
            margin-bottom: 30px;
          }
          .section-title {
            color: #241C15;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            border-left: 4px solid #FFE01B;
            padding-left: 15px;
          }
          .content {
            margin-left: 20px;
            text-align: justify;
          }
          .parties {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .party-info {
            margin-bottom: 15px;
          }
          .party-label {
            font-weight: bold;
            color: #241C15;
          }
          .subsection {
            margin-left: 20px;
            margin-bottom: 15px;
          }
          .subsection-title {
            font-weight: bold;
            margin-bottom: 8px;
          }
          .signature-section {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
          }
          .signature-box {
            width: 45%;
          }
          .signature-line {
            border-top: 2px solid #241C15;
            margin-top: 60px;
            padding-top: 10px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .amount {
            font-weight: bold;
            color: #FFE01B;
            background: #241C15;
            padding: 2px 8px;
            border-radius: 4px;
          }
          pre {
            white-space: pre-wrap;
            font-family: inherit;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="logo-container">
          <img src="/finzie-logo.png" alt="Finzie Logo" class="logo" />
        </div>

        <div class="header">
          <h1>SERVICE AGREEMENT</h1>
        </div>

        <div class="section">
          <p>
            This Service Agreement ("Agreement") is made and entered into as of <strong>${currentDate}</strong>
            ("Effective Date"), by and between:
          </p>
          
          <div class="parties">
            ${
              hasContent(agreement.client_name) || hasContent(agreement.client_address)
                ? `
            <div class="party-info">
              <span class="party-label">Client:</span> 
              ${hasContent(agreement.client_name) ? agreement.client_name : ""}${hasContent(agreement.client_address) ? `, ${agreement.client_address}` : ""}
              ${hasContent(agreement.client_email) ? `<br/>Email: ${agreement.client_email}` : ""}
              <br/>hereinafter referred to as the "Client."
            </div>
            `
                : ""
            }
            
            ${
              hasContent(agreement.freelancer_email)
                ? `
            <div class="party-info">
              <span class="party-label">Service Provider:</span> Finzie, an outsourcing agency
              ${hasContent(agreement.freelancer_email) ? `<br/>Email: ${agreement.freelancer_email}` : ""}
              <br/>hereinafter referred to as "Finzie" or "Service Provider."
            </div>
            `
                : ""
            }
          </div>

          ${
            hasContent(agreement.project_title)
              ? `
          <p><strong>Project:</strong> ${agreement.project_title}</p>
          `
              : ""
          }

          <p><strong>WHEREAS:</strong></p>
          <p class="content">
            The Client wishes to engage Finzie to manage and execute outsourced service
            requirements by onboarding relevant freelancers and service providers;
            Finzie agrees to manage, coordinate, and ensure the timely delivery of work by the
            engaged professionals.
          </p>
        </div>

        ${
          hasContent(agreement.scope) || hasContent(agreement.deliverables)
            ? `
        <div class="section">
          <div class="section-title">1. Scope of Work</div>
          <div class="content">
            ${
              hasContent(agreement.scope)
                ? `
            <p><pre>${agreement.scope}</pre></p>
            `
                : ""
            }
            ${
              hasContent(agreement.deliverables)
                ? `
            <div class="subsection">
              <div class="subsection-title">Deliverables:</div>
              <p><pre>${agreement.deliverables}</pre></p>
            </div>
            `
                : ""
            }
          </div>
        </div>
        `
            : ""
        }

        ${
          hasContent(agreement.payment_terms) || hasContent(agreement.payment_amount?.toString())
            ? `
        <div class="section">
          <div class="section-title">2. Payment Terms</div>
          <div class="content">
            ${
              hasContent(agreement.payment_amount?.toString())
                ? `
            <p>
              <strong>Total Amount:</strong> 
              <span class="amount">${agreement.currency || "USD"} ${agreement.payment_amount}</span>
            </p>
            `
                : ""
            }
            ${
              hasContent(agreement.payment_terms)
                ? `
            <p><pre>${agreement.payment_terms}</pre></p>
            `
                : ""
            }
          </div>
        </div>
        `
            : ""
        }

        ${
          hasContent(agreement.responsibilities)
            ? `
        <div class="section">
          <div class="section-title">3. Responsibilities</div>
          <div class="content">
            <pre>${agreement.responsibilities}</pre>
          </div>
        </div>
        `
            : ""
        }

        ${
          hasContent(agreement.termination)
            ? `
        <div class="section">
          <div class="section-title">4. Termination</div>
          <div class="content">
            <pre>${agreement.termination}</pre>
          </div>
        </div>
        `
            : ""
        }

        ${
          hasContent(agreement.confidentiality)
            ? `
        <div class="section">
          <div class="section-title">5. Confidentiality</div>
          <div class="content">
            <pre>${agreement.confidentiality}</pre>
          </div>
        </div>
        `
            : ""
        }

        ${
          hasContent(agreement.governing_law)
            ? `
        <div class="section">
          <div class="section-title">6. Governing Law</div>
          <div class="content">
            <pre>${agreement.governing_law}</pre>
          </div>
        </div>
        `
            : ""
        }

        <div class="section">
          <div class="section-title">7. Entire Agreement</div>
          <div class="content">
            <p>
              This Agreement constitutes the full and complete understanding between the parties and
              supersedes any prior discussions, agreements, or understandings—whether written or oral
              —related to the subject matter.
            </p>
          </div>
        </div>

        ${
          hasContent(agreement.ownership)
            ? `
        <div class="section">
          <div class="section-title">8. Ownership & Usage</div>
          <div class="content">
            <pre>${agreement.ownership}</pre>
          </div>
        </div>
        `
            : ""
        }

        ${
          hasContent(agreement.terms)
            ? `
        <div class="section">
          <div class="section-title">9. Additional Terms & Conditions</div>
          <div class="content">
            <pre>${agreement.terms}</pre>
          </div>
        </div>
        `
            : ""
        }

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line">
              <strong>Client Signature</strong><br/>
              ${hasContent(agreement.client_name) ? agreement.client_name : ""}<br/>
              Date: _________________
            </div>
          </div>
          <div class="signature-box">
            <div class="signature-line">
              <strong>Service Provider Signature</strong><br/>
              Finzie<br/>
              Date: _________________
            </div>
          </div>
        </div>

        <div class="footer">
          <p>This agreement was generated on ${currentDate}</p>
          <p>Agreement ID: ${agreement.id}</p>
        </div>
      </body>
    </html>
  `
}

export function generateFreelancerAgreementTemplate(agreement: FreelancerAgreement): string {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #241C15;
            max-width: 850px;
            margin: 0 auto;
            padding: 20px;
            background: #ffffff;
          }
          .logo-container {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            max-width: 200px;
            height: auto;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #FFE01B;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #241C15;
            font-size: 32px;
            margin: 0;
            font-weight: bold;
          }
          .section {
            margin-bottom: 30px;
          }
          .section-title {
            color: #241C15;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            border-left: 4px solid #FFE01B;
            padding-left: 15px;
          }
          .content {
            margin-left: 20px;
            text-align: justify;
          }
          .parties {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .party-info {
            margin-bottom: 15px;
          }
          .party-label {
            font-weight: bold;
            color: #241C15;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
          }
          .info-item {
            padding: 10px;
          }
          .info-label {
            font-weight: bold;
            color: #666;
            font-size: 12px;
            text-transform: uppercase;
          }
          .info-value {
            color: #241C15;
            font-size: 16px;
            margin-top: 5px;
          }
          .signature-section {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
          }
          .signature-box {
            width: 45%;
          }
          .signature-line {
            border-top: 2px solid #241C15;
            margin-top: 60px;
            padding-top: 10px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .rate {
            font-weight: bold;
            color: #FFE01B;
            background: #241C15;
            padding: 2px 8px;
            border-radius: 4px;
          }
          pre {
            white-space: pre-wrap;
            font-family: inherit;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="logo-container">
          <img src="/finzie-logo2.png" alt="Finzie Logo" class="logo" />
        </div>

        <div class="header">
          <h1>FREELANCER AGREEMENT</h1>
        </div>

        <div class="section">
          <p>
            This Freelancer Agreement ("Agreement") is made and entered into as of <strong>${currentDate}</strong>
            ("Effective Date"), by and between:
          </p>
          
          <div class="parties">
            ${
              hasContent(agreement.freelancer_name)
                ? `
            <div class="party-info">
              <span class="party-label">Freelancer:</span> ${agreement.freelancer_name}
              ${hasContent(agreement.freelancer_email) ? `<br/>Email: ${agreement.freelancer_email}` : ""}
              <br/>hereinafter referred to as the "Freelancer."
            </div>
            `
                : ""
            }
            
            ${
              hasContent(agreement.client_name)
                ? `
            <div class="party-info">
              <span class="party-label">Client:</span> ${agreement.client_name}
              ${hasContent(agreement.client_email) ? `<br/>Email: ${agreement.client_email}` : ""}
              <br/>hereinafter referred to as the "Client."
            </div>
            `
                : ""
            }
          </div>
        </div>

        ${
          hasContent(agreement.work_type) ||
          hasContent(agreement.hourly_rate?.toString()) ||
          hasContent(agreement.project_duration)
            ? `
        <div class="section">
          <div class="section-title">Engagement Details</div>
          <div class="info-grid">
            ${
              hasContent(agreement.work_type)
                ? `
            <div class="info-item">
              <div class="info-label">Work Type</div>
              <div class="info-value">${agreement.work_type}</div>
            </div>
            `
                : ""
            }
            ${
              hasContent(agreement.hourly_rate?.toString())
                ? `
            <div class="info-item">
              <div class="info-label">Hourly Rate</div>
              <div class="info-value"><span class="rate">$${agreement.hourly_rate}/hour</span></div>
            </div>
            `
                : ""
            }
            ${
              hasContent(agreement.project_duration)
                ? `
            <div class="info-item">
              <div class="info-label">Project Duration</div>
              <div class="info-value">${agreement.project_duration}</div>
            </div>
            `
                : ""
            }
          </div>
        </div>
        `
            : ""
        }

        ${
          hasContent(agreement.nda)
            ? `
        <div class="section">
          <div class="section-title">Scope of Work</div>
          <div class="content">
            <pre>${agreement.nda}</pre>
          </div>
        </div>
        `
            : ""
        }

        ${
          hasContent(agreement.deliverables)
            ? `
        <div class="section">
          <div class="section-title">Deliverables</div>
          <div class="content">
            <pre>${agreement.deliverables}</pre>
          </div>
        </div>
        `
            : ""
        }

        ${
          hasContent(agreement.ip_rights)
            ? `
        <div class="section">
          <div class="section-title">Intellectual Property Rights</div>
          <div class="content">
            <pre>${agreement.ip_rights}</pre>
          </div>
        </div>
        `
            : ""
        }

        ${
          hasContent(agreement.terms)
            ? `
        <div class="section">
          <div class="section-title">Terms & Conditions</div>
          <div class="content">
            <pre>${agreement.terms}</pre>
          </div>
        </div>
        `
            : ""
        }

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line">
              <strong>Freelancer Signature</strong><br/>
              ${hasContent(agreement.freelancer_name) ? agreement.freelancer_name : ""}<br/>
              Date: _________________
            </div>
          </div>
          <div class="signature-box">
            <div class="signature-line">
              <strong>Client Signature</strong><br/>
              ${hasContent(agreement.client_name) ? agreement.client_name : ""}<br/>
              Date: _________________
            </div>
          </div>
        </div>

        <div class="footer">
          <p>This agreement was generated on ${currentDate}</p>
          <p>Agreement ID: ${agreement.id}</p>
        </div>
      </body>
    </html>
  `
}

export function generateInvoiceTemplate(invoice: any, items: any[] = []): string {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #ddd;">${item.description || ""}</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity || 0}</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">${invoice.currency || "USD"} ${(item.rate || 0).toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">${invoice.currency || "USD"} ${(item.amount || 0).toFixed(2)}</td>
      </tr>
    `,
    )
    .join("")

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #241C15;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: #ffffff;
          }
          .logo-container {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            max-width: 200px;
            height: auto;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #FFE01B;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #241C15;
            font-size: 32px;
            margin: 0;
            font-weight: bold;
          }
          .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .info-section {
            flex: 1;
          }
          .info-label {
            font-weight: bold;
            color: #666;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          .info-value {
            color: #241C15;
            margin-bottom: 15px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
          }
          th {
            background: #241C15;
            color: #FFE01B;
            padding: 12px;
            text-align: left;
            font-weight: bold;
          }
          .totals {
            margin-top: 30px;
            text-align: right;
          }
          .total-row {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 10px;
          }
          .total-label {
            width: 200px;
            font-weight: bold;
            padding-right: 20px;
          }
          .total-value {
            width: 150px;
            text-align: right;
          }
          .grand-total {
            font-size: 20px;
            color: #FFE01B;
            background: #241C15;
            padding: 10px;
            border-radius: 4px;
          }
          .payment-info {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="logo-container">
          <img src="/finzie-logo.png" alt="Finzie Logo" class="logo" />
        </div>

        <div class="header">
          <h1>INVOICE</h1>
          ${hasContent(invoice.invoice_number) ? `<p style="font-size: 18px; color: #666; margin: 10px 0 0 0;">${invoice.invoice_number}</p>` : ""}
        </div>

        <div class="invoice-info">
          <div class="info-section">
            <div class="info-label">Bill To:</div>
            ${hasContent(invoice.client_name) ? `<div class="info-value"><strong>${invoice.client_name}</strong></div>` : ""}
            ${hasContent(invoice.client_address) ? `<div class="info-value">${invoice.client_address}</div>` : ""}
            ${hasContent(invoice.project_title) ? `<div class="info-value">Project: ${invoice.project_title}</div>` : ""}
          </div>
          <div class="info-section" style="text-align: right;">
            <div class="info-label">Invoice Date:</div>
            <div class="info-value">${invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : currentDate}</div>
            ${
              hasContent(invoice.due_date)
                ? `
            <div class="info-label">Due Date:</div>
            <div class="info-value">${new Date(invoice.due_date).toLocaleDateString()}</div>
            `
                : ""
            }
          </div>
        </div>

        ${
          items.length > 0
            ? `
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: center;">Quantity</th>
              <th style="text-align: right;">Rate</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        `
            : ""
        }

        <div class="totals">
          ${
            invoice.amount
              ? `
          <div class="total-row">
            <div class="total-label">Subtotal:</div>
            <div class="total-value">${invoice.currency || "USD"} ${invoice.amount.toFixed(2)}</div>
          </div>
          `
              : ""
          }
          ${
            invoice.tax_amount
              ? `
          <div class="total-row">
            <div class="total-label">Tax:</div>
            <div class="total-value">${invoice.currency || "USD"} ${invoice.tax_amount.toFixed(2)}</div>
          </div>
          `
              : ""
          }
          ${
            invoice.total_amount
              ? `
          <div class="total-row">
            <div class="total-label">Total:</div>
            <div class="total-value grand-total">${invoice.currency || "USD"} ${invoice.total_amount.toFixed(2)}</div>
          </div>
          `
              : ""
          }
        </div>

        ${
          hasContent(invoice.payee_name) ||
          hasContent(invoice.account_number) ||
          hasContent(invoice.routing_number) ||
          hasContent(invoice.payment_method)
            ? `
        <div class="payment-info">
          <h3 style="margin-top: 0;">Payment Information</h3>
          ${hasContent(invoice.payment_method) ? `<p><strong>Payment Method:</strong> ${invoice.payment_method}</p>` : ""}
          ${hasContent(invoice.payee_name) ? `<p><strong>Payee Name:</strong> ${invoice.payee_name}</p>` : ""}
          ${hasContent(invoice.account_number) ? `<p><strong>Account Number:</strong> ${invoice.account_number}</p>` : ""}
          ${hasContent(invoice.account_type) ? `<p><strong>Account Type:</strong> ${invoice.account_type}</p>` : ""}
          ${hasContent(invoice.routing_number) ? `<p><strong>Routing Number:</strong> ${invoice.routing_number}</p>` : ""}
        </div>
        `
            : ""
        }

        ${
          hasContent(invoice.terms)
            ? `
        <div style="margin-top: 30px;">
          <h3>Terms & Conditions</h3>
          <p style="white-space: pre-wrap;">${invoice.terms}</p>
        </div>
        `
            : ""
        }

        <div class="footer">
          <p>Invoice generated on ${currentDate}</p>
          ${invoice.id ? `<p>Invoice ID: ${invoice.id}</p>` : ""}
        </div>
      </body>
    </html>
  `
}
