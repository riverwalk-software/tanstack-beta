// import {
//   startAuthentication,
//   startRegistration,
// } from "@simplewebauthn/browser";
// import {
//   type AuthenticationResponseJSON,
//   generateAuthenticationOptions,
//   generateRegistrationOptions,
//   type PublicKeyCredentialCreationOptionsJSON,
//   type PublicKeyCredentialRequestOptionsJSON,
//   type RegistrationResponseJSON,
//   verifyAuthenticationResponse,
//   verifyRegistrationResponse,
//   type WebAuthnCredential,
// } from "@simplewebauthn/server";
// import { createFileRoute } from "@tanstack/react-router";
// import { createServerFn } from "@tanstack/react-start";
// import {
//   deleteCookie,
//   getCookie,
//   setCookie,
// } from "@tanstack/react-start/server";
// import { useState } from "react";
// import { toast } from "sonner";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { CenteredContainer } from "@/containers/CenteredContainer";
// import { SITE_DOMAIN, SITE_NAME, SITE_URL } from "@/utils/constants";
// import { getCloudflareBindings } from "@/utils/getCloudflareBindings";

// export const Route = createFileRoute("/_unauthenticated/passkey")({
//   component: Passkey,
// });

// const RegistrationOptionsSchema = z.object({
//   displayName: z.string().nonempty(),
//   email: z.string().email(),
// });
// const AuthenticationOptionsSchema = z.object({
//   email: z.string().email(),
// });

// const RP_ID = import.meta.env.DEV ? "localhost" : SITE_DOMAIN;

// const register = async ({
//   user,
// }: {
//   user: { email: string; displayName: string };
// }): Promise<void> => {
//   try {
//     const email = user.email;
//     const options = await getRegistrationOptions({
//       data: { displayName: user.displayName, email },
//     });
//     const response = await createPasskey({
//       optionsJSON: options,
//     });
//     await verifyAndStorePasskey({
//       data: { email, response },
//     });
//     toast.success(
//       "Registration successful! You can now authenticate with your passkey.",
//     );
//   } catch {
//     toast.error("Registration failed.", {
//       description: "Please try again.",
//     });
//   }
// };

// const authenticate = async ({
//   user,
// }: {
//   user: { email: string };
// }): Promise<void> => {
//   try {
//     const email = user.email;
//     const options = await getAuthenticationOptions({
//       data: { email },
//     });
//     const response = await getPasskey({
//       optionsJSON: options,
//     });
//     await getAndVerifyPasskey({
//       data: { email, response },
//     });
//     toast.success("Authentication successful! You are now signed in.");
//   } catch (error) {
//     console.error("Authentication error:", error);
//     toast.error("Authentication failed.", {
//       description: "Please try again.",
//     });
//   }
// };

// const getRegistrationOptionsFn = createServerFn({ method: "POST" })
//   .validator(RegistrationOptionsSchema)
//   .handler(
//     async ({
//       data: { displayName, email },
//     }): Promise<PublicKeyCredentialCreationOptionsJSON> => {
//       const options = await generateRegistrationOptions({
//         rpID: RP_ID,
//         rpName: SITE_NAME,
//         userName: email,
//         userDisplayName: displayName,
//       });
//       setCookie("regChallenge", options.challenge);
//       return options;
//     },
//   );
// const getRegistrationOptions = getRegistrationOptionsFn;
// const getAuthenticationOptionsFn = createServerFn({ method: "POST" })
//   .validator(AuthenticationOptionsSchema)
//   .handler(
//     async ({
//       data: { email },
//     }): Promise<PublicKeyCredentialRequestOptionsJSON> => {
//       const { WEBAUTHN_STORE } = getCloudflareBindings();
//       const credential: WebAuthnCredential | null = await WEBAUTHN_STORE.get(
//         email,
//         {
//           type: "json",
//         },
//       );
//       if (!credential) throw new Error("No credential found for this email");
//       const options = await generateAuthenticationOptions({
//         rpID: RP_ID,
//         allowCredentials: [{ ...credential }],

//         // rpName: SITE_NAME,
//         // userName: email,
//         // userDisplayName: displayName,
//       });
//       setCookie("authChallenge", options.challenge);
//       return options;
//     },
//   );
// const getAuthenticationOptions = getAuthenticationOptionsFn;
// const createPasskey = startRegistration;
// const getPasskey = startAuthentication;
// const verifyAndStorePasskeyFn = createServerFn({ method: "POST" })
//   .validator(
//     (data: { email: string; response: RegistrationResponseJSON }) => data,
//   )
//   .handler(async ({ data: { email, response } }): Promise<void> => {
//     const challenge = getCookie("regChallenge");
//     if (!challenge) throw new Error("No challenge found in cookies");
//     const { verified, registrationInfo } = await verifyRegistrationResponse({
//       response,
//       expectedChallenge: challenge,
//       expectedOrigin: import.meta.env.DEV ? "http://localhost:3000" : SITE_URL,
//       expectedRPID: RP_ID,
//     });
//     if (!verified || !registrationInfo)
//       throw new Error("Passkey verification failed");
//     const { WEBAUTHN_STORE } = getCloudflareBindings();
//     await WEBAUTHN_STORE.put(
//       email,
//       JSON.stringify({
//         ...registrationInfo.credential,
//         // backedUp: registrationInfo.credentialBackedUp,
//         // deviceType: registrationInfo.credentialDeviceType,
//         // type: registrationInfo.credentialType,
//       } as WebAuthnCredential),
//     );
//     deleteCookie("regChallenge");
//   });
// const verifyAndStorePasskey = verifyAndStorePasskeyFn;
// const getAndVerifyPasskeyFn = createServerFn({ method: "POST" })
//   .validator(
//     (data: { email: string; response: AuthenticationResponseJSON }) => data,
//   )
//   .handler(async ({ data: { email, response } }): Promise<void> => {
//     console.log("HERE");
//     const challenge = getCookie("authChallenge");
//     if (!challenge) throw new Error("No challenge found in cookies");
//     const { WEBAUTHN_STORE } = getCloudflareBindings();
//     const credential: WebAuthnCredential | null = await WEBAUTHN_STORE.get(
//       email,
//       {
//         type: "json",
//       },
//     );
//     if (!credential) throw new Error("No credential found for this email");
//     const { verified, authenticationInfo } = await verifyAuthenticationResponse(
//       {
//         response,
//         expectedChallenge: challenge,
//         expectedOrigin: import.meta.env.DEV
//           ? "http://localhost:3000"
//           : SITE_URL,
//         expectedRPID: RP_ID,
//         credential,
//       },
//     );
//     if (!verified || !authenticationInfo)
//       throw new Error("Passkey verification failed");
//     await WEBAUTHN_STORE.put(
//       email,
//       JSON.stringify({
//         ...credential,
//         counter: authenticationInfo.newCounter,
//       } as WebAuthnCredential),
//     );
//     deleteCookie("authChallenge");
//   });
// const getAndVerifyPasskey = getAndVerifyPasskeyFn;

// // let rawId: Uint8Array;
// // const rpId = location.hostname;

// // const register = async ({
// //   user,
// // }: {
// //   user: { email: string; displayName: string };
// // }): Promise<Credential | null> => {
// //   const credentials = await navigator.credentials.create({
// //     publicKey: {
// //       challenge: crypto.getRandomValues(new Uint8Array(32)),
// //       rp: {
// //         name: SITE_NAME,
// //         // id: SITE_DOMAIN,
// //         id: rpId,
// //       },
// //       user: {
// //         id: crypto.getRandomValues(new Uint8Array(64)),
// //         name: user.email,
// //         displayName: user.displayName,
// //       },
// //       pubKeyCredParams: [
// //         { alg: -7, type: "public-key" }, // ES256
// //         { alg: -8, type: "public-key" }, // ES384
// //         { alg: -257, type: "public-key" }, // RS256
// //       ],
// //       authenticatorSelection: {
// //         authenticatorAttachment: "platform", // Prefer built-in authenticators
// //         userVerification: "required",
// //         residentKey: "preferred",
// //       },
// //       timeout: 60000,
// //     },
// //   });
// //   rawId = credentials.rawId!;
// //   return credentials;
// // };

// // const authenticate = async ({
// //   user,
// // }: {
// //   user: { email: string; displayName: string };
// // }): Promise<Credential | null> =>
// //   navigator.credentials.get({
// //     publicKey: {
// //       challenge: crypto.getRandomValues(new Uint8Array(32)),
// //       rpId,
// //       userVerification: "required",
// //       allowCredentials: [
// //         {
// //           id: rawId,
// //           type: "public-key",
// //         },
// //       ],
// //     },
// //   });

// function Passkey() {
//   const [email, setEmail] = useState("user@example.com");
//   const [displayName, setDisplayName] = useState("John Doe");

//   const handleRegister = async () => {
//     try {
//       const result = await register({
//         user: { email, displayName },
//       });
//       console.log("Passkey registered successfully:", result);
//     } catch (error) {
//       console.error("Passkey registration failed:", error);
//     }
//   };

//   const handleAuthenticate = async () => {
//     try {
//       const result = await authenticate({
//         user: { email },
//       });
//       console.log("Passkey authenticated successfully:", result);
//     } catch (error) {
//       console.error("Passkey authentication failed:", error);
//     }
//   };

//   return (
//     <CenteredContainer>
//       <div className="space-y-4 p-4">
//         <h1 className="font-bold text-2xl">Passkey Registration</h1>

//         <div className="space-y-2">
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             className="rounded border p-2"
//           />
//           <input
//             type="text"
//             value={displayName}
//             onChange={(e) => setDisplayName(e.target.value)}
//             placeholder="Display Name"
//             className="rounded border p-2"
//           />
//         </div>

//         <Button onClick={handleRegister}>Register Passkey</Button>
//         <Button onClick={handleAuthenticate}>Authenticate Passkey</Button>
//       </div>
//     </CenteredContainer>
//   );
// }
