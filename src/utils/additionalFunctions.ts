export function formatNumber(number: number) {
  const fixedNumber = number.toFixed(2);
  return fixedNumber.endsWith('.00') ? fixedNumber.slice(0, -3) : fixedNumber;
}
