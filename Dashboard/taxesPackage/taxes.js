// taxes.js
export function getTax(subtotal, rate = 0.00) {
  return subtotal * rate;
}
