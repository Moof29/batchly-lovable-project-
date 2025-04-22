
type ErrorCategory = 'auth' | 'validation' | 'rate_limit' | 'connection' | 'data' | 'unknown';

export function categorizeError(error: any): ErrorCategory {
  const errorMessage = String(error).toLowerCase();
  if (errorMessage.includes('token') || errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
    return 'auth';
  } else if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
    return 'validation';
  } else if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
    return 'rate_limit';
  } else if (errorMessage.includes('network') || errorMessage.includes('connection') || errorMessage.includes('timeout')) {
    return 'connection';
  } else if (errorMessage.includes('not found') || errorMessage.includes('duplicate')) {
    return 'data';
  }
  return 'unknown';
}
