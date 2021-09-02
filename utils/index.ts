export function validateEnv(env: string): string {
  const val = process.env[env];
  if (!val) {
    throw new Error(`Missing enviromental variable ${env}`);
  }

  return val;
}
