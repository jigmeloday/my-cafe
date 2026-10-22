import { ABOUT_COPY } from "../constant/about.constant";
import { AboutSteps } from "./about-steps";

/** How it works, for the two kinds of people who use Nook, side by side. */
export function AboutHow() {
  return (
    <section aria-labelledby="how" className="space-y-6">
      <h2 id="how">{ABOUT_COPY.howTitle}</h2>
      <div className="grid gap-8 lg:grid-cols-2">
        <AboutSteps title={ABOUT_COPY.customersTitle} steps={ABOUT_COPY.customers} />
        <AboutSteps title={ABOUT_COPY.businessesTitle} steps={ABOUT_COPY.businesses} />
      </div>
    </section>
  );
}
