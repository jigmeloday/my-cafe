/** A link that opens a WhatsApp chat with this number (like "+97517123456") and a first message already typed. Null without a number. */
export function whatsappLink(phone: string, message: string): string | null {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : null;
}
