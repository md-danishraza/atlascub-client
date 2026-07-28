import { shippingInfo, businessPolicies, companyInfo } from "./legal";

// FAQ Categories and Questions
export const faqCategories = [
  {
    id: "orders",
    name: "Orders & Payment",
    icon: "ShoppingBag",
    faqs: [
      {
        question: "How do I place an order?",
        answer:
          "Simply browse our collections, select your size and color variant, add the garments to your shopping bag, and proceed to checkout. You will need to complete authentication via Clerk or checkout securely using an active user profile.",
      },
      {
        question: "What payment methodologies do you support?",
        answer: `We support fully secure prepaid payments through ${businessPolicies.paymentGateway}. This includes Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), and Net Banking. We also support Cash on Delivery (COD) for verified pincodes across India.`,
      },
      {
        question: "Can I cancel or modify my order?",
        answer: `Yes, you can cancel your order within ${businessPolicies.cancellationWindow} of placement, provided it has not been handed over to our shipping partner. Please reach out to our client services desk with your order number.`,
      },
      {
        question: "Is my payment details secure?",
        answer: `Absolutely. We never store, process, or view your full credit card or credentials on our servers. All transactions are routed through ${businessPolicies.paymentGateway}, featuring end-to-end encryption.`,
      },
      {
        question: "Will I receive an invoice for my transaction?",
        answer:
          "Yes, a formal GST-compliant tax invoice will be generated and automatically delivered to your registered email address as soon as your order status shifts to PAID.",
      },
    ],
  },
  {
    id: "shipping",
    name: "Shipping & Delivery",
    icon: "Truck",
    faqs: [
      {
        question: "How long does shipping take?",
        answer: `We process and dispatch garments within 24 hours. Metro cities typically receive deliveries in ${shippingInfo.metroCitiesTime}, while other domestic regions take ${shippingInfo.domesticShippingTime}.`,
      },
      {
        question: "Do you ship internationally?",
        answer: shippingInfo.internationalShipping
          ? `Yes, we ship globally. International transit times average ${shippingInfo.internationalShippingTime}. Customs duties are handled by the receiver.`
          : "Currently, we only ship within India. We plan to expand to international shipping in future seasonal drops.",
      },
      {
        question: "How can I track my shipment?",
        answer: `As soon as our studio hands your package to ${shippingInfo.logisticsPartner}, we will update your timeline. An automated email containing your Shiprocket AWB tracking link will be dispatched immediately.`,
      },
      {
        question: "What are your delivery charges?",
        answer: `Orders of ₹${shippingInfo.freeShippingThreshold.toLocaleString()} or more receive complimentary shipping. Orders below this threshold carry a flat fee of ₹${
          shippingInfo.shippingCost
        }.`,
      },
      {
        question: "Is there an extra charge for Cash on Delivery?",
        answer: `Yes, Cash on Delivery transactions carry a flat handling surcharge of ₹${shippingInfo.codFee}. This fee is applied directly during checkout and covers the specialized processing and validation required for COD courier partners.`,
      },
    ],
  },
  {
    id: "returns",
    name: "Returns & Exchanges",
    icon: "RefreshCw",
    faqs: [
      {
        question: "What is your return policy?",
        answer: `We offer a strict return/exchange window of ${businessPolicies.returnWindow} from the delivery date. Items must be in pristine condition, meaning ${businessPolicies.returnConditions}.`,
      },
      {
        question: "Are returns completely free?",
        answer: `If you received a damaged, stained, or incorrect item, return shipping is fully free. For size changes or mind modifications, a flat reverse logistics fee of ${businessPolicies.reverseLogisticsCharge} will be deducted from your final payout.`,
      },
      {
        question: "How do I initiate a return?",
        answer:
          "Login to your account dashboard, navigate to 'My Orders', select the delivered order, click on 'Return / Exchange', choose your resolution (Refund or Replacement), and state the reason.",
      },
      {
        question: "How long does a refund take?",
        answer: `Once your return reaches our warehouse and passes the handloom audit, your refund will be processed back to the original payment method within ${businessPolicies.refundTime}.`,
      },
      {
        question: "Can I exchange an item?",
        answer: businessPolicies.exchangePolicy,
      },
    ],
  },
  {
    id: "products",
    name: "Craftsmanship & Sizing",
    icon: "Shirt",
    faqs: [
      {
        question: "How do I choose my correct size?",
        answer:
          "Every product page features a detailed structural Size Guide. Please reference specific shoulder and chest measurements rather than standard retail sizes, as our garments are cut with bespoke, relaxed outlines.",
      },
      {
        question: "What materials do you use?",
        answer:
          "We use premium, ethically harvested raw materials. Our seasonal edits utilize natural French linen, hypoallergenic organic combed cottons, rich mulberry silk-blends, and handloomed Indian textiles.",
      },
      {
        question: "How should I care for my garments?",
        answer:
          "Most of our products are machine washable on a delicate cycle using cold water. However, our raw silk edits, textured handlooms, and structured drapes require dry cleaning only to preserve their tactile properties.",
      },
    ],
  },
  {
    id: "account",
    name: "Account & Security",
    icon: "User",
    faqs: [
      {
        question: "How is my account data secured?",
        answer:
          "We protect your session security by routing all authentication, multi-factor codes, and credentials through Clerk. Your personal data is fully encrypted and never shared with third parties.",
      },
      {
        question: "Can I update or delete my personal data?",
        answer:
          "Yes. You can manage your addresses, preferences, and details inside your User Profile settings. If you wish to delete your account entirely, please email our support desk.",
      },
    ],
  },
];

// Dynamic Policy Cards
export const policyCards = [
  {
    id: "shipping-policy",
    title: "Shipping Policy",
    description: `Free shipping on orders over ₹${shippingInfo.freeShippingThreshold.toLocaleString()}. Verified domestic delivery powered by Shiprocket.`,
    icon: "Truck",
    link: "/shipping-policy",
  },
  {
    id: "return-policy",
    title: "Exchange & Return Policy",
    description: `${businessPolicies.returnWindow} returns on garments in original, untampered condition. Returns verified within ${businessPolicies.refundTime}.`,
    icon: "RefreshCw",
    link: "/returns", // Maps directly to your comprehensive return policy page
  },
  {
    id: "exchange-policy",
    title: "Exchange Guidelines",
    description: businessPolicies.exchangePolicy,
    icon: "Repeat",
    link: "/returns#exchange",
  },
];

// Dynamic Support Contacts (Replies routed to Hostinger Support Mail)
export const supportContacts = [
  {
    id: "email",
    name: "Email Client Desk",
    description: "Monitored constantly. Expected reply: < 24 hours.",
    contact: companyInfo.email,
    action: `mailto:${companyInfo.email}`,
    icon: "Mail",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Representative",
    description: "Quick assistance for orders & sizing.",
    contact: companyInfo.phone,
    action: `https://wa.me/${companyInfo.phone.replace(/[\s+]/g, "")}`,
    icon: "MessageCircle",
  },
  {
    id: "phone",
    name: "Phone Client Desk",
    description: companyInfo.operatingHours,
    contact: companyInfo.phone,
    action: `tel:${companyInfo.phone.replace(/[\s+]/g, "")}`,
    icon: "Phone",
  },
];
