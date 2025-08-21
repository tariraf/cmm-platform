// src/lib/utils.ts
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

export function formatCurrency(num: number): string {
  return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
}

// Alternative - Simple formatting without locale
export function formatNumberSimple(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}