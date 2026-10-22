/** Who the server knows is signed in, used until the browser's own answer arrives. */
export interface HeaderUser {
  name: string;
  role: string;
}
