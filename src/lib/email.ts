import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface FormData {
      name: string
      email: string
      phone: string
      business?: string
      website?: string
      interest: string
      ip?: string
      userAgent?: string
}

export async function sendAdminEmail(formData: FormData) {
      const mailOptions = {
            from: `"Contact Form" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAILS,
            subject: 'New Contact Form Submission',
            html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #f7af00; border-bottom: 2px solid #f7af00; padding-bottom: 10px;">
                              New Contact Form Submission
                        </h2>
                        
                        <div style="background-color: #faf4e5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                              <h3 style="color: #050504; margin-top: 0;">Contact Details</h3>
                              
                              <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                          <td style="padding: 8px; border-bottom: 1px solid #f0eadd;"><strong>Name:</strong></td>
                                          <td style="padding: 8px; border-bottom: 1px solid #f0eadd;">${formData.name}</td>
                                    </tr>
                                    <tr>
                                          <td style="padding: 8px; border-bottom: 1px solid #f0eadd;"><strong>Email:</strong></td>
                                          <td style="padding: 8px; border-bottom: 1px solid #f0eadd;">
                                                <a href="mailto:${formData.email}" style="color: #f7af00;">${formData.email}</a>
                                          </td>
                                    </tr>
                                    <tr>
                                          <td style="padding: 8px; border-bottom: 1px solid #f0eadd;"><strong>Phone:</strong></td>
                                          <td style="padding: 8px; border-bottom: 1px solid #f0eadd;">${formData.phone}</td>
                                    </tr>
                                    <tr>
                                          <td style="padding: 8px; border-bottom: 1px solid #f0eadd;"><strong>Business:</strong></td>
                                          <td style="padding: 8px; border-bottom: 1px solid #f0eadd;">${formData.business || 'Not provided'}</td>
                                    </tr>
                                    <tr>
                                          <td style="padding: 8px; border-bottom: 1px solid #f0eadd;"><strong>Website:</strong></td>
                                          <td style="padding: 8px; border-bottom: 1px solid #f0eadd;">
                                                ${formData.website ? `<a href="${formData.website}" target="_blank" style="color: #f7af00;">${formData.website}</a>` : 'Not provided'}
                                          </td>
                                    </tr>
                                    <tr>
                                          <td style="padding: 8px;"><strong>Interest:</strong></td>
                                          <td style="padding: 8px;">
                                                <span style="background-color: #f7af00; color: #050504; padding: 4px 12px; border-radius: 20px; font-weight: bold;">
                                                      ${formData.interest}
                                                </span>
                                          </td>
                                    </tr>
                              </table>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #31302f;">
                              <p style="margin: 5px 0;">Submitted: ${new Date().toLocaleString()}</p>
                              <p style="margin: 5px 0;">IP: ${formData.ip || 'Not available'}</p>
                              <p style="margin: 5px 0;">User Agent: ${formData.userAgent || 'Not available'}</p>
                        </div>
                  </div>
            `,
      }

      return transporter.sendMail(mailOptions)
}

interface MailOptions {
      from: string
      to: string
      subject: string
      html: string
}

export async function sendConfirmationEmail(formData: FormData): Promise<any> {
      const mailOptions: MailOptions = {
            from: `"Your Company" <${process.env.SMTP_USER}>`,
            to: formData.email,
            subject: 'We Received Your Request',
            html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #31302f;">
                        <div style="background-color: #f7af00; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                              <h1 style="color: #050504; margin: 0; font-size: 28px;">Thank You!</h1>
                              <p style="color: #050504; font-size: 18px; margin-top: 10px;">
                                    We've received your inquiry
                              </p>
                        </div>
                        
                        <div style="background-color: #faf4e5; padding: 30px; border-radius: 0 0 8px 8px;">
                              <p style="font-size: 16px; line-height: 1.6;">
                                    Dear <strong>${formData.name}</strong>,
                              </p>
                              
                              <p style="font-size: 16px; line-height: 1.6;">
                                    Thank you for contacting us regarding <strong>${formData.interest}</strong>. 
                                    We have received your request and our team will review it shortly.
                              </p>
                              
                              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f7af00;">
                                    <h3 style="color: #050504; margin-top: 0;">Your Submission Summary</h3>
                                    <p><strong>Name:</strong> ${formData.name}</p>
                                    <p><strong>Email:</strong> ${formData.email}</p>
                                    <p><strong>Phone:</strong> ${formData.phone}</p>
                                    <p><strong>Business:</strong> ${formData.business || 'Not provided'}</p>
                                    <p><strong>Interest:</strong> ${formData.interest}</p>
                                    <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                              </div>
                              
                              <p style="font-size: 16px; line-height: 1.6;">
                                    Our typical response time is within <strong>24 hours</strong> during business days. 
                                    If you have any urgent matters, feel free to call us at <strong>+1 (555) 123-4567</strong>.
                              </p>
                              
                              <div style="text-align: center; margin-top: 30px;">
                                    <a href="tel:+15551234567" style="background-color: #f7af00; color: #050504; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                          Call Us Now
                                    </a>
                              </div>
                        </div>
                        
                        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
                              <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                              <p>
                                    <a href="#" style="color: #f7af00;">Privacy Policy</a> | 
                                    <a href="#" style="color: #f7af00;">Terms of Service</a>
                              </p>
                        </div>
                  </div>
            `,
      }

      return transporter.sendMail(mailOptions)
}