import emailjs from '@emailjs/browser';
import { portfolioData } from '../data/portfolio';

const env = import.meta.env || {};

const hasRealValue = (value) => Boolean(value && !/^N\/A|TBD|your_|service_xxx|template_xxx|public_xxx/i.test(String(value).trim()));

export function createContactMailto(form, source = 'Portfolio contact form') {
  const subject = encodeURIComponent(`Portfolio inquiry from ${form.name || 'visitor'}`);
  const body = encodeURIComponent(
    [
      form.message,
      '',
      `From: ${form.name || 'Unknown visitor'}`,
      `Email: ${form.email || 'Not provided'}`,
      form.phone ? `Phone: ${form.phone}` : null,
      `Source: ${source}`,
    ]
      .filter(Boolean)
      .join('\n'),
  );

  return `mailto:${portfolioData.contact.email}?subject=${subject}&body=${body}`;
}

export async function sendContactMessage(form, source = 'Portfolio contact form') {
  const submittedAt = new Date().toISOString();
  const recipientEmail = portfolioData.contact.email;
  const subject = `Portfolio inquiry from ${form.name || 'visitor'}`;
  const payload = {
    name: form.name,
    email: form.email,
    phone: form.phone || '',
    message: form.message,
    from_name: form.name,
    from_email: form.email,
    user_name: form.name,
    user_email: form.email,
    user_message: form.message,
    reply_to: form.email,
    to_name: portfolioData.personal.displayName,
    to_email: recipientEmail,
    recipient_email: recipientEmail,
    destination_email: recipientEmail,
    subject,
    title: subject,
    source,
    submitted_at: submittedAt,
    time: submittedAt,
  };

  const emailJsServiceId = env.VITE_EMAILJS_SERVICE_ID;
  const emailJsTemplateId = env.VITE_EMAILJS_TEMPLATE_ID;
  const emailJsPublicKey = env.VITE_EMAILJS_PUBLIC_KEY;
  let emailJsError = null;

  if (hasRealValue(emailJsServiceId) && hasRealValue(emailJsTemplateId) && hasRealValue(emailJsPublicKey)) {
    try {
      const response = await emailjs.send(emailJsServiceId, emailJsTemplateId, payload, { publicKey: emailJsPublicKey });
      if (response?.status && response.status >= 400) {
        throw new Error(response.text || 'EmailJS rejected the message.');
      }
      return { status: 'success', provider: 'emailjs', responseStatus: response?.status || 200 };
    } catch (error) {
      emailJsError = error;
    }
  }

  const formspreeEndpoint = env.VITE_FORMSPREE_ENDPOINT || portfolioData.contact.formspreeEndpoint;
  if (hasRealValue(formspreeEndpoint)) {
    const response = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Contact endpoint rejected the message.');
    return { status: 'success', provider: 'formspree' };
  }

  if (emailJsError) throw emailJsError;

  return {
    status: 'fallback',
    provider: 'mailto',
    fallbackUrl: createContactMailto(form, source),
  };
}
