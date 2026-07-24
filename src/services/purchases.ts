/**
 * Purchases / entitlements adapter.
 * RevenueCat wires here later — keep UI calling this surface only.
 */
export type EntitlementState = {
  hasPremium: boolean;
  source: 'local' | 'revenuecat' | 'none';
};

export async function refreshEntitlements(): Promise<EntitlementState> {
  // Placeholder until react-native-purchases is configured
  return { hasPremium: false, source: 'none' };
}

export async function restorePurchases(): Promise<EntitlementState> {
  return refreshEntitlements();
}

export function applyLocalPremiumUnlock(setPremium: (v: boolean) => void): void {
  setPremium(true);
}
