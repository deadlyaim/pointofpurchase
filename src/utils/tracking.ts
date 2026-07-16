/**
 * Deterministic generator to yield a unique 10-digit tracking number for a given order ID
 * that changes exactly every 30 minutes.
 */
export function getDynamicTrackingNumber(orderId: string): string {
  // 30 minutes in milliseconds
  const intervalMs = 30 * 60 * 1000;
  const block = Math.floor(Date.now() / intervalMs);
  
  // Create a deterministic seed from orderId and block index
  let seed = 0;
  const str = `${orderId}-${block}`;
  for (let i = 0; i < str.length; i++) {
    seed = (seed * 31 + str.charCodeAt(i)) % 1000000007;
  }
  
  // Linear Congruential Generator (LCG) pseudo-random number generation
  let x = seed;
  for (let i = 0; i < 5; i++) {
    x = (1103515245 * x + 12345) % 2147483648;
  }
  
  // Map x to a 10-digit number range: [1000000000, 9999999999]
  const tenDigit = 1000000000 + (Math.abs(x) % 9000000000);
  return tenDigit.toString();
}
