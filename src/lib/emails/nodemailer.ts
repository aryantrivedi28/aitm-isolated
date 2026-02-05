import nodemailer from 'nodemailer'
import { AuditDB } from '../db/supabase'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function sendAuditEmail(auditId: string) {
  try {
    // Get audit data
    const audit = await AuditDB.getAuditById(auditId)
    
    if (!audit || audit.status !== 'completed') {
      throw new Error('Audit not found or not completed')
    }

    // Generate HTML report
    const html = generateEmailHTML(audit)

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: audit.email,
      subject: `✅ Shopify Audit Results - Score: ${audit.overall_score}/100`,
      html,
      attachments: [
        {
          filename: 'audit-summary.txt',
          content: generateTextSummary(audit)
        }
      ]
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)
    
    // Mark as sent
    await AuditDB.markEmailSent(auditId)
    
    return true
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}

function generateEmailHTML(audit: any) {
  const issuesBySeverity = {
    critical: audit.critical_issues || [],
    high: audit.high_issues || [],
    medium: audit.medium_issues || [],
    low: audit.low_issues || []
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; }
        .score { font-size: 72px; font-weight: bold; margin: 20px 0; }
        .card { background: white; border-radius: 10px; padding: 25px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .issue-critical { border-left: 5px solid #dc2626; }
        .issue-high { border-left: 5px solid #f97316; }
        .issue-medium { border-left: 5px solid #f59e0b; }
        .issue-low { border-left: 5px solid #10b981; }
        .metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
        .metric { text-align: center; padding: 15px; background: #f8fafc; border-radius: 8px; }
        .metric-value { font-size: 24px; font-weight: bold; margin: 5px 0; }
        .btn { display: inline-block; background: #008060; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 40px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Your Shopify Audit Results</h1>
          <div class="score">${audit.overall_score}/100</div>
          <p>Overall Store Health Score</p>
        </div>
        
        <div class="card">
          <h2>📊 Performance Metrics</h2>
          <div class="metric-grid">
            <div class="metric">
              <div>Performance</div>
              <div class="metric-value">${audit.performance_score}/100</div>
            </div>
            <div class="metric">
              <div>Mobile Score</div>
              <div class="metric-value">${audit.mobile_score}/100</div>
            </div>
            <div class="metric">
              <div>Load Time</div>
              <div class="metric-value">${Math.round(audit.load_time_ms / 1000)}s</div>
            </div>
          </div>
        </div>
        
        ${issuesBySeverity.critical.length > 0 ? `
          <div class="card issue-critical">
            <h2>🚨 Critical Issues (${issuesBySeverity.critical.length})</h2>
            ${issuesBySeverity.critical.slice(0, 3).map((issue: any) => `
              <div style="margin: 15px 0; padding: 15px; background: #fef2f2; border-radius: 5px;">
                <strong>${issue.title}</strong><br>
                <small>${issue.description}</small><br>
                <strong>Solution:</strong> ${issue.solutionSteps?.[0] || 'Contact for details'}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${issuesBySeverity.high.length > 0 ? `
          <div class="card issue-high">
            <h2>⚠️ High Priority Issues (${issuesBySeverity.high.length})</h2>
            ${issuesBySeverity.high.slice(0, 3).map((issue: any) => `
              <div style="margin: 10px 0; padding: 10px; background: #ffedd5; border-radius: 5px;">
                <strong>${issue.title}</strong><br>
                <small>${issue.description}</small>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <div class="card">
          <h2>🎯 Top Recommendations</h2>
          <ol>
            ${(audit.recommendations || []).slice(0, 5).map((rec: string) => `
              <li style="margin: 10px 0;">${rec}</li>
            `).join('')}
          </ol>
        </div>
        
        <div class="card">
          <h2>💡 Expert Analysis</h2>
          <p>${audit.ai_summary || 'Focus on high-impact issues first.'}</p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📈 Estimated Impact</h3>
            <p><strong>Conversion Rate:</strong> ${audit.estimated_impact?.conversionRate || '+1-3%'}</p>
            <p><strong>AOV Increase:</strong> ${audit.estimated_impact?.aovIncrease || '+$10-25'}</p>
            <p><strong>Revenue Potential:</strong> ${audit.estimated_impact?.revenuePotential || '15-30% monthly'}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="mailto:support@yourdomain.com?subject=Shopify%20Audit%20Implementation&body=Audit%20ID:%20${audit.id}" class="btn">
            💼 Get Professional Help
          </a>
          <a href="${process.env.APP_URL}" class="btn" style="background: #4f46e5;">
            🔄 Run Another Audit
          </a>
        </div>
        
        <div class="footer">
          <p>Audit ID: ${audit.id}</p>
          <p>Generated on ${new Date(audit.created_at).toLocaleDateString()}</p>
          <p>Store: ${audit.store_url}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateTextSummary(audit: any) {
  return `
SHOPIFY AUDIT REPORT
=====================

Store: ${audit.store_url}
Audit ID: ${audit.id}
Date: ${new Date(audit.created_at).toLocaleString()}

OVERALL SCORE: ${audit.overall_score}/100

PERFORMANCE:
- Performance Score: ${audit.performance_score}/100
- Mobile Score: ${audit.mobile_score}/100
- Load Time: ${Math.round(audit.load_time_ms / 1000)}s
- LCP: ${Math.round(audit.lcp_ms)}ms
- CLS: ${audit.cls_score}

ISSUES FOUND:
- Critical: ${audit.critical_issues?.length || 0}
- High: ${audit.high_issues?.length || 0}
- Medium: ${audit.medium_issues?.length || 0}
- Low: ${audit.low_issues?.length || 0}

TOP RECOMMENDATIONS:
${(audit.recommendations || []).map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n')}

EXPERT ANALYSIS:
${audit.ai_summary || 'No analysis available.'}

ESTIMATED IMPACT:
- Conversion Rate: ${audit.estimated_impact?.conversionRate || 'N/A'}
- AOV Increase: ${audit.estimated_impact?.aovIncrease || 'N/A'}
- Revenue Potential: ${audit.estimated_impact?.revenuePotential || 'N/A'}

---
Need help implementing these changes?
Contact: support@yourdomain.com
Audit ID: ${audit.id}
  `
}
