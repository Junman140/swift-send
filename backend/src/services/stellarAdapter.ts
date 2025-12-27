import { ExternalServiceError } from '../errors';

// Prototype adapter that simulates submitting to Stellar network.
// Treat Stellar as an external dependency: retries, backoff, and structured errors.

export async function submitPayment(transferId: string, from: string, to: string, amount: number, currency: string, maxAttempts = 3) {
  let attempt = 0;
  const baseDelay = 500;

  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      // Simulate network call with random failure for demo
      const simulated = Math.random();
      await new Promise((res) => setTimeout(res, 200));
      if (simulated < 0.75) {
        // success
        return {
          status: 'submitted',
          networkId: `stellar_${transferId}_${Date.now()}`,
          attempt
        };
      }

      // otherwise simulate transient failure
      throw new Error('transient network error');
    } catch (err: any) {
      if (attempt >= maxAttempts) {
        throw new ExternalServiceError('Stellar submission failed after retries', { cause: err?.message, attempt });
      }
      // exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(res => setTimeout(res, delay));
    }
  }

  throw new ExternalServiceError('Stellar submission failed (unexpected)');
}
