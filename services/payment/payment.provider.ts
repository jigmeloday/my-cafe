/**
 * The seam for taking payment. Nothing is connected yet: when a provider is chosen, write one class that
 * implements `PaymentProvider`, return it from `getPaymentProvider()`, and add its webhook route that
 * calls `walletService.creditPurchase(businessId, coins, paymentId)`. Nothing else needs to change.
 */
export interface CheckoutRequest {
  businessId: string;
  coins: number;
  /** What the coins cost, in the display currency's minor units (see `coinPriceMinor`). */
  amountMinor: number;
  /** Where the provider sends the person back after paying. */
  returnUrl: string;
}

export interface PaymentProvider {
  name: string;
  /** Starts a payment and returns the provider's page to send the person to. */
  createCheckout(request: CheckoutRequest): Promise<{ url: string }>;
}

/** The configured provider, or null while payments aren't connected. */
export function getPaymentProvider(): PaymentProvider | null {
  return null;
}
