/// <reference types="node" />
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Vercel serverless function handler for newsletter subscriptions
export default async function handler(req: Request) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            {
                status: 405,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }
        );
    }

    try {
        const { email } = await req.json();

        // Validate email
        if (!email) {
            return new Response(
                JSON.stringify({ error: 'Email is required' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(
                JSON.stringify({ error: 'Invalid email address' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        // Check if Resend API key is configured
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is not configured');
            return new Response(
                JSON.stringify({ error: 'Email service is not configured' }),
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        const recipientEmail = process.env.CONTACT_EMAIL || 'contact@example.com';
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

        // Send notification email to you about the new subscriber
        const { error } = await resend.emails.send({
            from: `Portfolio Newsletter <${fromEmail}>`,
            to: [recipientEmail],
            subject: `New Newsletter Subscriber: ${email}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f2b90d; border-bottom: 2px solid #f2b90d; padding-bottom: 10px;">
            New Newsletter Subscription
          </h2>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f8f5; border-left: 4px solid #f2b90d;">
            <p><strong>Email:</strong> <a href="mailto:${String(email).replace(/</g, '&lt;').replace(/>/g, '&gt;')}">${String(email).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a></p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e0; color: #6b7280; font-size: 12px;">
            <p>Someone subscribed to your portfolio newsletter.</p>
          </div>
        </div>
      `,
            text: `New Newsletter Subscription\n\nEmail: ${email}\nDate: ${new Date().toLocaleString()}\n\nSomeone subscribed to your portfolio newsletter.`,
        });

        if (error) {
            console.error('Resend error:', error);
            return new Response(
                JSON.stringify({ error: 'Failed to process subscription' }),
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Subscribed successfully!' }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }
        );
    } catch (error) {
        console.error('Error processing request:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }
        );
    }
}
