import { COD_FEE, FREE_SHIP, INTL_SHIP, SHIP_FEE, fmt } from "../lib/money";
import { etaFor } from "../data/checkout";

export const CONTACT = "ahmed42.dev@gmail.com";
const REVISED = "9 October 2026";

export const docs = {
  faq: {
    kicker: "Help / FAQ",
    title: ["Questions,", "answered."],
    intro: "The things people ask before the first bottle, and after the second.",
    revised: REVISED,
    draft: false,
    sections: [
      {
        id: "heat", title: "Heat",
        qa: [
          { q: "How hot are these, really?", a: "Every bottle has a heat rating from 1 to 5 and an approximate Scoville figure. Kashmiri Red and Green Jalapeño & Lime are the gentlest at 2 of 5, and Ghost Pepper Reserve is a 5. The Heat Guide explains the scale." },
          { q: "Which one should I start with?", a: "If you're unsure, start with Kashmiri Red. For a little more drama, try Mango Habanero. The Trio Box lets you try three at once." },
          { q: "What if it's too hot?", a: "Reach for milk or yogurt, a spoon of sugar or honey, or some bread or rice. Water doesn't help much, because capsaicin doesn't dissolve in it." },
        ],
      },
      {
        id: "kitchen", title: "In the kitchen",
        qa: [
          { q: "Does it need to be refrigerated?", a: "Keep unopened bottles somewhere cool and dark. Once opened, refrigerate and finish within about six months." },
          { q: "What's inside?", a: "Every product page lists the full ingredients. If you have an allergy, always check that list, and write to us if you want more detail." },
          { q: "Can I use it in cooking?", a: "Yes. Stir it into marinades, soups and stews, or finish a dish with a few drops. The tasting notes on each product page suggest pairings." },
        ],
      },
      {
        id: "ordering", title: "Ordering & payment",
        qa: [
          { q: "How can I pay?", a: `Cash on delivery within Pakistan (a ${fmt(COD_FEE)} handling fee applies), or by card anywhere we ship. Card payments are processed by Stripe and charged in US dollars at the rate shown at checkout.` },
          { q: "Do you ship internationally?", a: `Yes, to the countries listed at checkout. International shipping is a flat ${fmt(INTL_SHIP)} and delivery takes about ${etaFor("US")}.` },
          { q: "How do I track my order?", a: "Use Track an order with your order number and the email you ordered with. It opens your order slip." },
          { q: "Can I change or cancel an order?", a: `Write to ${CONTACT} as soon as you can. If it hasn't been dispatched yet, we can change or cancel it.` },
        ],
      },
    ],
  },

  shipping: {
    kicker: "Help / Shipping & returns",
    title: ["Getting it", "to your table."],
    intro: "How a bottle gets from our kitchen to yours, and what to do if it doesn't arrive in one piece.",
    revised: REVISED,
    draft: true,
    sections: [
      {
        id: "delivery", title: "Delivery",
        body: ["We pack in small batches. Orders usually leave our kitchen within [2] working days of being placed."],
        rows: [["Pakistan", etaFor("PK")], ["International", etaFor("US")]],
      },
      {
        id: "rates", title: "Shipping rates",
        rows: [
          ["Pakistan", `${fmt(SHIP_FEE)}, free over ${fmt(FREE_SHIP)}`],
          ["International", `${fmt(INTL_SHIP)} flat`],
          ["Cash on delivery", `${fmt(COD_FEE)} handling fee`],
        ],
      },
      {
        id: "payment", title: "Payment options",
        body: ["Cash on delivery is available within Pakistan. Cards are accepted everywhere we ship, processed by Stripe, and charged in US dollars at the rate shown at checkout."],
      },
      {
        id: "tracking", title: "Tracking your order",
        body: ["Use Track an order with your order number and the email you ordered with to open your order slip."],
      },
      {
        id: "damaged", title: "Damaged or wrong items",
        body: [`If a bottle arrives broken or isn't what you ordered, write to ${CONTACT} within [48 hours] with your order number and a photo. We'll replace it or refund you.`],
      },
      {
        id: "returns", title: "Returns and cancellations",
        body: ["Because this is food, we can't take back opened bottles. [Describe your policy for unopened bottles here.] You can cancel an order any time before it's dispatched."],
      },
    ],
  },

  privacy: {
    kicker: "Legal / Privacy",
    title: ["What we keep,", "and why."],
    intro: "What we collect when you order, why we need it, and who else sees it.",
    revised: REVISED,
    draft: true,
    sections: [
      {
        id: "who", title: "Who we are",
        body: [`Ember & Root is run by [Legal business name], [address]. You can reach us at ${CONTACT}.`],
      },
      {
        id: "collect", title: "What we collect",
        list: [
          "Order details: your name, email, phone number, delivery address, the items you ordered and any note you add.",
          "Gift messages you ask us to print on a card.",
          "Batch list signups: your email and the varieties you're waiting for.",
          "Payments: card details go straight to Stripe. We never see or store your card number. We keep only the payment reference and the amount.",
        ],
      },
      {
        id: "use", title: "Why we use it",
        body: ["To take and deliver your order, to contact you about it, to keep accounting records, and, only if you joined a list, to tell you when a new batch opens."],
      },
      {
        id: "share", title: "Who we share it with",
        list: [
          "Stripe, to process card payments.",
          "Our hosting and database providers (Vercel and Neon), which store the site and its data.",
          "Couriers, who receive your name, address and phone number to deliver the parcel.",
        ],
        body: ["We don't sell your data."],
      },
      {
        id: "keep", title: "How long we keep it",
        body: ["For as long as needed to fulfil your order, keep accounting records and meet legal obligations. [Set a specific retention period before launch.]"],
      },
      {
        id: "browser", title: "Cookies and browser storage",
        body: ["Your cart is kept in your browser's local storage, and your most recent order slip in session storage, so they survive a refresh. We don't currently use analytics or advertising cookies. Stripe may set its own cookies or storage when the card form loads, for fraud prevention."],
      },
      {
        id: "choices", title: "Your choices",
        body: [`Write to ${CONTACT} to see, correct or delete the data we hold about you, or to leave a batch list. Every batch email will carry an unsubscribe link.`],
      },
      {
        id: "changes", title: "Changes to this page",
        body: ["If we change how we use your data, we'll update this page and its revision date."],
      },
    ],
  },

  terms: {
    kicker: "Legal / Terms",
    title: ["The rules", "of the table."],
    intro: "How orders, prices, delivery and returns work.",
    revised: REVISED,
    draft: true,
    sections: [
      {
        id: "using", title: "Using the site",
        body: ["By using this site and placing an order you agree to these terms. If you don't, please don't order."],
      },
      {
        id: "orders", title: "Orders",
        body: ["Placing an order is an offer to buy. We accept it when we confirm it. We may cancel and refund an order if an item is unavailable or we made an error in a price or description."],
      },
      {
        id: "prices", title: "Prices and payment",
        body: [`Prices are in Pakistani rupees. Cash-on-delivery orders carry a ${fmt(COD_FEE)} handling fee. Card payments are processed by Stripe and charged in US dollars at the rate shown at checkout. Shipping is added at checkout.`],
      },
      {
        id: "delivery", title: "Delivery and returns",
        body: ["See Shipping & returns for delivery times, rates, damaged goods and cancellations."],
      },
      {
        id: "food", title: "Food, heat and allergens",
        body: ["Our sauces are hot, and some are very hot. Read the ingredient list on each product page before you eat, especially if you have an allergy. [List the allergens in your recipes.] Keep out of the eyes, and wash your hands after handling."],
      },
      {
        id: "liability", title: "Liability",
        body: ["[Have a lawyer complete this section for your business and jurisdiction.]"],
      },
      {
        id: "law", title: "Governing law",
        body: ["[State the governing law and where disputes will be handled.]"],
      },
    ],
  },
};