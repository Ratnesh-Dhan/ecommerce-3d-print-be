const transporter = require("./mailService");

async function sendQuoteEmail(data) {
  try {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; color: #333333; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .header { background-color: #000000; color: #D4AF37; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
          .content { padding: 30px; }
          .content h2 { margin-top: 0; font-size: 20px; color: #111111; }
          .summary-box { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 20px 0; }
          .summary-item { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
          .summary-item:last-child { margin-bottom: 0; }
          .total { font-weight: bold; font-size: 16px; border-top: 1px solid #e5e7eb; padding-top: 10px; margin-top: 10px; }
          .btn-container { text-align: center; margin: 30px 0; }
          .btn { background-color: #D4AF37; color: #000000; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; font-size: 16px; display: inline-block; }
          .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          .footer p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>THREEDITRON</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.customerName || data.name},</h2>
            <p>Thank you for choosing THREEDITRON for your 3D printing needs. Your quotation (<strong>${data.quoteId}</strong>) is ready.</p>
            
            <div class="summary-box">
              <div class="summary-item">
                <span>Material:</span>
                <strong>${data.material}</strong>
              </div>
              <div class="summary-item">
                <span>Quantity:</span>
                <strong>${data.quantity || 1}</strong>
              </div>
              <div class="summary-item total">
                <span>Estimated Total:</span>
                <strong>Rs ${(Number(data.totalPrice || 0) * 1.18).toFixed(2)}</strong>
              </div>
            </div>

            <p>Please find the detailed official quotation attached as a PDF document. If you have any questions or would like to proceed with the production, feel free to reply to this email.</p>
            
            <div class="btn-container">
              <a href="mailto:support@threeditron.com?subject=Approve Quote ${data.quoteId}" class="btn">Approve & Proceed</a>
            </div>
          </div>
          <div class="footer">
            <p><strong>THREEDITRON</strong> | Online 3D Printing & Rapid Prototyping</p>
            <p>Email: support@threeditron.com | Phone: +91 9999999999</p>
            <p>www.threeditron.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: \`"THREEDITRON" <\${process.env.SMTP_USER}>\`,
      to: data.customerEmail || data.email,
      subject: \`Your THREEDITRON Quote (\${data.quoteId})\`,
      html: htmlTemplate,
      attachments: [
        {
          filename: \`\${data.quoteId}.pdf\`,
          path: data.pdfPath,
        },
      ],
    });

    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Email Error:", err);
    throw err;
  }
}

module.exports = sendQuoteEmail;
