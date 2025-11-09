import { Quote } from "./types";

const apiEndpoint =
  "https://raw.githubusercontent.com/lbngoc/literature-clock/master/docs/times";

// Get current time code
export function getTimeCode(time: Date) {
  const hour = time.getHours().toString().padStart(2, "0");
  const minute = time.getMinutes().toString().padStart(2, "0");

  return `${hour}:${minute}`;
}

// Get quote by time code
export async function getQuoteByTimeCode(timeCode: string): Promise<Quote> {
  const res = await fetch(`${apiEndpoint}/${timeCode}.json`, { mode: "cors" });
  const body: any[] = await res.json();

  if (res.status === 429) {
    return {
      title: "Too many requests at this time",
    };
  }

  if (sfw) {
    body = body.filter((quote) => quote.sfw === "yes");
  }

  if (body.length === 0) {
    return {
      title: "No quotes found for this time",
    };
  }

  const quote = body[Math.floor(Math.random() * body.length)] as Quote;

  const cleanText = (input: string): string => {
    return input
        .replace(/<br\s*\/?>/gi, " ") // <br /> becomes a space
        .replace(/&amp;/gi, "&");      // &amp; becomes an &
  };

  const decodedQuote = {
    ...quote,
    quote_first: quote.quote_first ? cleanText(quote.quote_first) : "",
    quote_time_case: quote.quote_time_case ? cleanText(quote.quote_time_case) : "",
    quote_last: quote.quote_last ? cleanText(quote.quote_last) : "",
  };

  return decodedQuote;
}
