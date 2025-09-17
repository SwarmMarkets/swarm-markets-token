import chainConfig from './chain-properties.json';

export const chainIdToName: Record<number, string> = Object.fromEntries(
  Object.entries(chainConfig).map(([slug, entry]) => [entry.chainId, slug]),
);

export function getChainName(chainId: number): string {
  const name = chainIdToName[chainId];
  if (!name) throw new Error(`Unknown chainId: ${chainId}`);
  return name;
}
