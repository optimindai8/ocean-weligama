export interface AdminCredentialsVerifier {
  /** Must take roughly the same time whether the username or the password is wrong. */
  verify(username: string, password: string): Promise<boolean>;
}
