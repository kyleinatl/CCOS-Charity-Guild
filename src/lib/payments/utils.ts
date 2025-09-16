/**
 * Payment utility functions for client-side use
 * Server-side calculations should use functions from stripe-server.ts
 */

// Client-side fee calculation (should match server-side calculations)
export const calculateProcessingFee = (amount: number, paymentMethod: 'card' | 'ach' = 'card'): number => {
  if (paymentMethod === 'ach') {
    const feeAmount = Math.min(amount * 0.008 + 5.00, 5.00);
    return Math.round(feeAmount * 100) / 100;
  }
  
  // Card processing fee (2.9% + $0.30)
  const feeAmount = amount * 0.029 + 0.30;
  return Math.round(feeAmount * 100) / 100;
};

export const calculateNetAmount = (amount: number, paymentMethod: 'card' | 'ach' = 'card'): number => {
  const fee = calculateProcessingFee(amount, paymentMethod);
  return Math.round((amount - fee) * 100) / 100;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const donationTiers = {
  bronze: { min: 0, max: 499, name: 'Bronze' },
  silver: { min: 500, max: 2499, name: 'Silver' },
  gold: { min: 2500, max: 9999, name: 'Gold' },
  platinum: { min: 10000, max: Infinity, name: 'Platinum' },
} as const;

export const getDonationTier = (totalDonated: number): keyof typeof donationTiers => {
  if (totalDonated >= donationTiers.platinum.min) return 'platinum';
  if (totalDonated >= donationTiers.gold.min) return 'gold';
  if (totalDonated >= donationTiers.silver.min) return 'silver';
  return 'bronze';
};

export const getNextTierAmount = (totalDonated: number): number => {
  const currentTier = getDonationTier(totalDonated);
  
  switch (currentTier) {
    case 'bronze':
      return donationTiers.silver.min;
    case 'silver':
      return donationTiers.gold.min;
    case 'gold':
      return donationTiers.platinum.min;
    case 'platinum':
      return totalDonated; // Already at highest tier
    default:
      return donationTiers.silver.min;
  }
};

export const getTierProgress = (totalDonated: number): {
  currentTier: string;
  nextTier: string;
  progress: number;
  amountToNext: number;
} => {
  const currentTier = getDonationTier(totalDonated);
  const currentTierInfo = donationTiers[currentTier];
  
  if (currentTier === 'platinum') {
    return {
      currentTier: currentTierInfo.name,
      nextTier: 'Platinum (Max)',
      progress: 100,
      amountToNext: 0,
    };
  }
  
  const nextTierAmount = getNextTierAmount(totalDonated);
  const tierRange = nextTierAmount - currentTierInfo.min;
  const currentProgress = totalDonated - currentTierInfo.min;
  const progressPercentage = Math.min((currentProgress / tierRange) * 100, 100);
  
  const nextTierName = getDonationTier(nextTierAmount);
  
  return {
    currentTier: currentTierInfo.name,
    nextTier: donationTiers[nextTierName].name,
    progress: Math.round(progressPercentage),
    amountToNext: nextTierAmount - totalDonated,
  };
};