import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

export function SignOutButton() {
  return <Button onClick={() => authClient.signOut()}>Sign Out</Button>;
}
