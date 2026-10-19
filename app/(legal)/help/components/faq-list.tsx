"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { SearchInput } from "@/components/shared/search-input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { FAQ_TOPICS, HELP_COPY } from "../constant/help.constant";

/** All the questions, grouped by topic, with a box that narrows them as you type. */
export function FaqList() {
  const [query, setQuery] = useState("");
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const topics = useMemo(
    () =>
      FAQ_TOPICS.map((topic) => ({
        ...topic,
        faqs: topic.faqs.filter((f) => words.every((w) => `${f.q} ${f.a}`.toLowerCase().includes(w))),
      })).filter((topic) => topic.faqs.length > 0),
    // `words` is rebuilt every render, so depend on the text it comes from.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query],
  );

  return (
    <div className="space-y-8">
      <SearchInput
        className="sm:max-w-md"
        aria-label={HELP_COPY.searchLabel}
        placeholder={HELP_COPY.searchPlaceholder}
        value={query}
        maxLength={80}
        onChange={(e) => setQuery(e.target.value)}
      />
      {topics.length === 0 ? (
        <EmptyState title={HELP_COPY.nothingTitle} description={HELP_COPY.nothingText} />
      ) : (
        topics.map((topic) => (
          <section key={topic.id} id={topic.id} aria-labelledby={`${topic.id}-title`} className="scroll-mt-24 space-y-2">
            <h2 id={`${topic.id}-title`}>{topic.title}</h2>
            {/* Answers stay in the page while collapsed, so search engines and Ctrl+F can find them. */}
            <Accordion keepMounted hiddenUntilFound>
              {topic.faqs.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))
      )}
    </div>
  );
}
