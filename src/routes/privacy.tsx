import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Terms — ELSEWHERE" },
      { name: "description", content: "What ELSEWHERE stores, where, and the terms for using fictional scenarios." },
      { property: "og:title", content: "Privacy & Terms — ELSEWHERE" },
      { property: "og:description", content: "Your scenarios stay in your browser." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 px-5 py-16 md:py-24">
      <section>
        <span className="eyebrow">Privacy</span>
        <h1 className="mt-4 text-5xl font-bold">Your story stays <em className="text-primary">with you.</em></h1>
        <div className="mt-8 space-y-4 text-lg text-muted-foreground">
          <p>No account is needed. Drafts, generated scenarios and reflection notes are saved in your browser's local storage on this device — not on our servers. You can delete them at any time from the “Saved in this browser” page.</p>
          <p>When you generate a scenario, the text you entered is sent through a secure server function to an AI model provider to write the story. Only the fields you fill in are sent. We do not control the provider's own retention practices.</p>
          <p>Please avoid names, addresses, account details or identifying information about other people.</p>
        </div>
      </section>
      <section id="terms" className="scroll-mt-24 border-t pt-12">
        <span className="eyebrow">Terms</span>
        <h2 className="mt-4 text-3xl">Fiction, offered as fiction.</h2>
        <p className="mt-4 text-lg text-muted-foreground">Every scenario, headline, post and financial figure is hypothetical and for reflection only. It is not financial, career, legal or medical advice, and should not be relied on to make decisions.</p>
      </section>
    </div>
  );
}
