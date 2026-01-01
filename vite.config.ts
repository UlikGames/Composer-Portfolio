import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Custom plugin to handle API routes in development
    {
      name: 'api-mock',
      configureServer(server) {
        server.middlewares.use('/api/send-email', async (req, res) => {
          if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.statusCode = 200;
            res.end();
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const data = JSON.parse(body);
                const { name, email, subject, message } = data;

                if (!name || !email || !subject || !message) {
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Missing required fields' }));
                  return;
                }

                // In development, we'll use Resend directly
                // Load the API key from environment
                const apiKey = process.env.RESEND_API_KEY;

                if (!apiKey) {
                  console.log('\n📧 Contact Form Submission (Dev Mode - No API Key):');
                  console.log('  Name:', name);
                  console.log('  Email:', email);
                  console.log('  Subject:', subject);
                  console.log('  Message:', message);
                  console.log('\n⚠️  RESEND_API_KEY not set. Email not actually sent.\n');

                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true, messageId: 'dev-mode-mock' }));
                  return;
                }

                // Actually send the email using Resend
                const { Resend } = await import('resend');
                const resend = new Resend(apiKey);

                const recipientEmail = process.env.CONTACT_EMAIL || 'ulvin.oguzlu@gmail.com';
                const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

                const result = await resend.emails.send({
                  from: `Portfolio Contact Form <${fromEmail}>`,
                  to: [recipientEmail],
                  replyTo: email,
                  subject: `[${subject}] New message from ${name}`,
                  html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                      <h2 style="color: #f2b90d; border-bottom: 2px solid #f2b90d; padding-bottom: 10px;">
                        New Contact Form Submission
                      </h2>
                      <div style="margin-top: 20px;">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p><strong>Subject:</strong> ${subject}</p>
                      </div>
                      <div style="margin-top: 20px; padding: 15px; background-color: #f8f8f5; border-left: 4px solid #f2b90d;">
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap; margin-top: 10px;">${message}</p>
                      </div>
                    </div>
                  `,
                  text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
                });

                if (result.error) {
                  console.error('Resend error:', result.error);
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Failed to send email', details: result.error.message }));
                  return;
                }

                console.log('✅ Email sent successfully:', result.data?.id);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, messageId: result.data?.id }));
              } catch (error) {
                console.error('Error:', error);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal server error' }));
              }
            });
            return;
          }

          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
