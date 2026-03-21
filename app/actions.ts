"use server";
import { Resend } from 'resend';
import { cookies } from 'next/headers';

export async function sendEmail(data: { firstName: string; lastName: string; email: string; message: string; }) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const cookieStore = await cookies(); 
    const emailCountCookie = cookieStore.get('irie_email_count');
    const count = emailCountCookie ? parseInt(emailCountCookie.value, 10) : 0;

    if (count >= 2) {
      return { success: false, error: "RATE_LIMIT" };
    }

    // Resend returns { data, error } instead of crashing
    const { error } = await resend.emails.send({
      from: 'IrieOS Form <onboarding@resend.dev>', 
      to: 'irievosscontact@gmail.com',             
      subject: `New OS Message from ${data.firstName} ${data.lastName}`,
      replyTo: data.email,                    
      text: `Name: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
    });

    // If Resend rejected it, catch it here!
    if (error) {
      console.error("RESEND API ERROR:", error);
      return { success: false, error: error.message || "SERVER_ERROR" };
    }

    cookieStore.set('irie_email_count', (count + 1).toString(), { maxAge: 60 * 60 * 24 });
    return { success: true };

  } catch (error: unknown) {
    console.error("CODE ERROR:", error);
    return { success: false, error: error instanceof Error ? error.message : "SERVER_ERROR" };
  }
}