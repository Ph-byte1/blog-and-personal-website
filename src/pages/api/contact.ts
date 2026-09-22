// src/pages/api/contact.ts
//
// Handles POST submissions from the contact form and sends an email via Resend.
// Must be server-rendered (not statically prerendered) to run on the Worker.
export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    // Optional honeypot field — see note below. Silently "succeed" on bots.
    if (formData.get("company")) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/contact?sent=1" },
      });
    }

    if (!name || !email || !message) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Env vars/secrets, exposed via the Cloudflare adapter's runtime binding.
    // const env = locals.runtime.env;
    const RESEND_API_KEY = env.RESEND_API_KEY;
    const CONTACT_TO_EMAIL = env.CONTACT_TO_EMAIL; // where you want to receive messages
    const CONTACT_FROM_EMAIL = env.CONTACT_FROM_EMAIL; // must be on a domain verified in Resend

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Website Contact <${CONTACT_FROM_EMAIL}>`,
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `New contact form message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
    });

    if (!resendResponse.ok) {
      const errText = await resendResponse.text();
      console.error("Resend error:", errText);
      return new Response("Failed to send message", { status: 502 });
    }

    // Redirect back to the contact page with a success flag.
    return new Response(null, {
      status: 303,
      headers: { Location: "/contact?sent=1" },
    });
  } catch (err) {
    console.error("Contact form error:", err);
    return new Response("Something went wrong", { status: 500 });
  }
};