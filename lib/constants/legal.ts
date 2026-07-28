// Single source of truth for legal, financial, and logistical compliance metrics

export const companyInfo = {
  name: "Atlascub Premium Apparel",
  legalName: "Atlascub Studio",
  brandName: "Atlascub",
  email: "support@atlascub.in",
  supportInbox: "support@atlascub.in",
  phone: "+91 8287627289",
  address: "Ismailpur,Basantpur, Faridabad, Haryana, India",
  pincode: "121013",
  operatingHours: "Mon-Sat, 10:00 AM - 7:00 PM IST",
};

export const shippingInfo = {
  freeShippingThreshold: 1299, // Aligned with the Announcement bar threshold
  shippingCost: 100, // Flat delivery charge below threshold
  codFee: 100, // Standard cash on delivery processing surcharge
  domesticShippingTime: "3 to 5 business days",
  metroCitiesTime: "2 to 3 business days",
  regionalHaryanaTime: "1 to 2 business days",
  logisticsPartner:
    "Shiprocket (including Blue Dart, Delhivery, and Xpressbees)",
  internationalShipping: false, // Explicitly restricted to domestic in phase 1
  internationalShippingTime: "N/A",
};

export const businessPolicies = {
  returnWindow: "7 days", // Strict 7-day handloom audit safety window
  refundTime: "5 to 7 business days", // Post-warehouse verification processing
  cancellationWindow: "24 hours", // Order can only be cancelled before active dispatch
  returnConditions:
    "completely unwashed, unworn, carrying all original brand tags, thread-seals, and labels intact",
  reverseLogisticsCharge:
    "₹150 standard courier pickup fee, which is deducted from your final refund payout",
  paymentGateway:
    "Razorpay (completely PCI-DSS compliant credit card, netbanking, UPI, and wallet processors)",
  exchangePolicy:
    "Size and color exchanges are permitted free of cost once per order, subject to active warehouse stock availability.",
};
