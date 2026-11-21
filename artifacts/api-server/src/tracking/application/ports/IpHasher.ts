export interface IpHasher {
  /** One-way hash of an IP address. Must not be reversible and should rotate over time. */
  hash(ip: string, at: Date): string;
}
