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
  const payload = {
    name: form.name,
    email: form.email,
    phone: form.phone || '',
    message: form.message,
    from_name: form.name,
    from_email: form.email,
    reply_to: form.email,
    to_email: portfolioData.contact.email,
    subject: `Portfolio inquiry from ${form.name || 'visitor'}`,
    source,
    submitted_at: submittedAt,
  };

  const emailJsServiceId = env.VITE_EMAILJS_SERVICE_ID;
  const emailJsTemplateId = env.VITE_EMAILJS_TEMPLATE_ID;
  const emailJsPublicKey = env.VITE_EMAILJS_PUBLIC_KEY;

  if (hasRealValue(emailJsServiceId) && hasRealValue(emailJsTemplateId) && hasRealValue(emailJsPublicKey)) {
    await emailjs.send(emailJsServiceId, emailJsTemplateId, payload, { publicKey: emailJsPublicKey });
    return { status: 'success', provider: 'emailjs' };
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

  return {
    status: 'fallback',
    provider: 'mailto',
    fallbackUrl: createContactMailto(form, source),
  };
}
