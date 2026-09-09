import React from 'react';

const WHATSAPP_URL = 'https://wa.me/256740817764';

export const WhatsAppButton: React.FC = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noreferrer"
    aria-label="Chat with NavaPack on WhatsApp"
    title="Chat with us on WhatsApp"
    className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_rgba(37,211,102,0.35)] transition-transform duration-200 hover:scale-105 hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
  >
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16 2.7A13.3 13.3 0 0 0 4.5 22.6L2.7 29.3l6.9-1.8A13.3 13.3 0 1 0 16 2.7Zm0 24.2a10.9 10.9 0 0 1-5.6-1.5l-.4-.2-4.1 1.1 1.1-4-.3-.4A10.9 10.9 0 1 1 16 26.9Z"
      />
      <path
        fill="currentColor"
        d="M22.3 18.3c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-.9 1.1c-.2.2-.3.3-.6.1a8.9 8.9 0 0 1-2.6-1.6 9.8 9.8 0 0 1-1.8-2.2c-.2-.3 0-.5.2-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.1 1.4 3.3c.2.2 2.4 3.7 5.8 5.1.8.3 1.5.5 2 .6.8.1 1.5.1 2.1-.1.6-.2 1.9-.8 2.1-1.6.3-.8.3-1.5.2-1.6-.1-.1-.3-.2-.6-.3Z"
      />
    </svg>
  </a>
);