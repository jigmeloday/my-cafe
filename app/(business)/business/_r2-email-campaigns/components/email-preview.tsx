import { BUSINESS_SHELL } from "@/components/business/constant/business-nav.constant";

import { EMAIL_COPY } from "../constant/email-campaign.constant";
import { findPromotion } from "../../promotions/constant/promotions.data";

interface EmailPreviewProps {
  subject: string;
  previewText: string;
  body: string;
  promotionId: string;
}

export function EmailPreview({
  subject,
  previewText,
  body,
  promotionId,
}: EmailPreviewProps) {
  const promotion = findPromotion(promotionId);
  const paragraphs = body.split(/\n{2,}/).filter((p) => p.trim());

  return (
    <div className="overflow-hidden rounded-xl border bg-surface text-sm">
      <div className="space-y-0.5 border-b bg-muted/50 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          From {BUSINESS_SHELL.businessName} via kuzu
        </p>
        <p className="font-semibold">{subject || "Your subject line"}</p>
        {previewText && (
          <p className="truncate text-xs text-muted-foreground">
            {previewText}
          </p>
        )}
      </div>
      <div className="space-y-4 px-4 py-5">
        {paragraphs.length > 0 ? (
          paragraphs.map((text) => (
            <p key={text} className="whitespace-pre-line">
              {text}
            </p>
          ))
        ) : (
          <p className="text-muted-foreground">
            Your message will appear here.
          </p>
        )}
        {promotion && (
          <div className="space-y-1 rounded-lg border p-3">
            <p className="font-semibold">{promotion.values.title}</p>
            {promotion.values.discount && (
              <p className="text-muted-foreground">
                {promotion.values.discount}
              </p>
            )}
            <span className="mt-2 inline-block rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
              View offer
            </span>
          </div>
        )}
      </div>
      <p className="flex flex-wrap gap-x-1 border-t px-4 py-3 text-xs text-muted-foreground">
        <span>{`${EMAIL_COPY.footer} ${BUSINESS_SHELL.businessName}.`}</span>
        <span className="underline">{EMAIL_COPY.unsubscribe}</span>
      </p>
    </div>
  );
}
