// Clerk's prebuilt sign-in widget. It handles the whole auth flow for us.
// forceRedirectUrl sends the user to "/" after a successful sign-in.
// Docs: https://clerk.com/docs/components/authentication/sign-in
import { SignIn } from "@clerk/react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn forceRedirectUrl="/" />
    </div>
  );
}
