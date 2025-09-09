// src/lib/agreements/templates.ts
export const commonTerms = `
<h3>Terms & Conditions</h3>
<p>1. Parties agree to keep confidential all non-public information exchanged in connection with this Agreement.</p>
<p>2. All deliverables are subject to acceptance testing as defined in the scope of work.</p>
<p>3. Intellectual property rights: unless stated otherwise, the final deliverables will be assigned to the Client upon full payment.</p>
<p>4. Governing law: As specified in the agreement (usually the company's registered jurisdiction).</p>
`;

export function freelancerTemplate(data: Record<string, any>) {
  const {
    client_name, freelancer_name, start_date, duration,
    scope, deliverables, payment_terms, notice_period, jurisdiction,
    company_name = "Finzie", contact_phone = "+91 9893270210"
  } = data;

  return `
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: Inter, Arial, sans-serif; color:#111827; padding:24px; }
      .header { display:flex; justify-content:space-between; align-items:center; }
      .brand { font-size:20px; font-weight:800; color:#111827; }
      .meta { text-align:right; font-size:12px; color:#6b7280; }
      .section { margin-top:18px; }
      .sig { margin-top:28px; display:flex; justify-content:space-between; }
      .box { border:1px solid #e5e7eb; padding:12px; border-radius:6px; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="brand">${company_name}</div>
      <div class="meta">
        Date: ${start_date || ''}<br/>
      </div>
    </div>

    <h1>Freelancer Onboarding Letter</h1>

    <div class="section">
      <strong>To:</strong> ${freelancer_name || 'Freelancer'}<br/>
      <strong>Client:</strong> ${client_name || 'Client'}
    </div>

    <div class="section">
      <h3>Scope of Work</h3>
      <div class="box">${scope || 'Scope details'}</div>
    </div>

    <div class="section">
      <h3>Deliverables</h3>
      <div class="box">${deliverables || 'Deliverables details'}</div>
    </div>

    <div class="section">
      <h3>Payment & Duration</h3>
      <p>${payment_terms || 'Payment terms to be discussed'}</p>
      <p>Start Date: ${start_date || 'TBD'} • Duration: ${duration || 'TBD'}</p>
      <p>Notice Period: ${notice_period || 'TBD'}</p>
    </div>

    <div class="section">
      <h3>Professional Conduct & Confidentiality</h3>
      <div class="box">${data.conduct || 'Freelancer will adhere to professional standards...'}</div>
    </div>

    <div class="section">
      ${commonTerms}
      <p><strong>Jurisdiction:</strong> ${jurisdiction || 'Chhindwara, Madhya Pradesh'}</p>
    </div>

    <div class="sig">
      <div>
        <p>Signed by Freelancer</p>
        <div style="height:60px;border-bottom:1px solid #cbd5e1;width:240px;"></div>
        <p>${freelancer_name || 'Freelancer'}</p>
      </div>
      <div>
        <p>Signed by ${company_name}</p>
        <div style="height:60px;border-bottom:1px solid #cbd5e1;width:240px;"></div>
        <p>Authorized Signatory</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

export function clientTemplate(data: Record<string, any>) {
  const {
    client_name, client_address, project_title, scope, payment_terms,
    amount, currency, due_date, start_date, company_name = 'Finzie',
    jurisdiction
  } = data;

  return `
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      body{font-family:Inter,Arial;padding:22px;color:#111827}
      .header{display:flex;justify-content:space-between}
      .title{font-weight:800;font-size:22px}
      .section{margin-top:12px}
      table{width:100%;border-collapse:collapse}
      td{padding:6px;vertical-align:top}
      .sig{display:flex;justify-content:space-between;margin-top:26px}
    </style>
  </head>
  <body>
    <div class="header">
      <div class="title">${company_name}</div>
      <div>${start_date || ''}</div>
    </div>

    <h1>Service Agreement</h1>

    <div class="section">
      <strong>Client:</strong> ${client_name || ''}<br/>
      <strong>Address:</strong> ${client_address || 'N/A'}<br/>
      <strong>Project:</strong> ${project_title || 'N/A'}
    </div>

    <div class="section">
      <h3>Scope of Work</h3>
      <div>${scope || 'Scope text'}</div>
    </div>

    <div class="section">
      <h3>Payment Terms</h3>
      <div>${payment_terms || ''}</div>
      <p><strong>Amount:</strong> ${currency || ''} ${amount || 'N/A'} • <strong>Due:</strong> ${due_date || 'N/A'}</p>
    </div>

    <div class="section">
      ${commonTerms}
      <p><strong>Jurisdiction:</strong> ${jurisdiction || 'India'}</p>
    </div>

    <div class="sig">
      <div>
        <p>For ${company_name}</p>
        <div style="height:60px;border-bottom:1px solid #cbd5e1;width:260px"></div>
        <p>Authorized Signatory</p>
      </div>
      <div>
        <p>For ${client_name || 'Client'}</p>
        <div style="height:60px;border-bottom:1px solid #cbd5e1;width:260px"></div>
        <p>Client Signatory</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

export function invoiceTemplate(data: Record<string, any>) {
  const {
    client_name, project_title, amount, currency='USD',
    due_date, company_name = 'Finzie', invoice_number, description
  } = data;

  return `
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      body{font-family:Inter,Arial;padding:24px;color:#111827}
      .header{display:flex;justify-content:space-between;align-items:center}
      .brand{font-weight:800}
      .table{width:100%;border-collapse:collapse;margin-top:18px}
      .table th, .table td{padding:8px;border:1px solid #e5e7eb;text-align:left}
    </style>
  </head>
  <body>
    <div class="header">
      <div class="brand">${company_name}</div>
      <div>Invoice #: ${invoice_number || '—'}<br/>Date: ${new Date().toLocaleDateString()}</div>
    </div>

    <h2>Invoice</h2>
    <p><strong>Bill To:</strong> ${client_name || ''}</p>
    <p><strong>Project:</strong> ${project_title || ''}</p>

    <table class="table">
      <thead><tr><th>Description</th><th>Amount</th></tr></thead>
      <tbody>
        <tr>
          <td>${description || 'Services rendered'}</td>
          <td>${currency} ${amount || '0.00'}</td>
        </tr>
      </tbody>
    </table>

    <p><strong>Due Date:</strong> ${due_date || 'N/A'}</p>

    <div style="margin-top:20px">${commonTerms}</div>

    <div style="margin-top:30px">
      <p>Regards,</p>
      <p>${company_name}</p>
    </div>
  </body>
  </html>
  `;
}
