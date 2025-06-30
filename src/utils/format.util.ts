// utils/format.ts
export function formatCurrency(value: number | string) {
  return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}
