"use client";

import React from "react";
import { SharedCard } from "@/components/shared/shared-card";
import { LoginForm } from "./login-form";
import { useLogin } from "../../hooks/useLogin";
import { LoginCardConfig } from "@/types/login.types";
import { AuthProviderConfig } from "@/types/ui";
import { Separator } from "../ui/separator";
import { SharedAuthProviderButton } from "../shared/shared-authprovider-button";
import { LoginFooter } from "./login-footer";
import loginUIService from "@/lib/login.utils";

/**
 * Configuration properties for the LoginCard component.
 *
 * @interface LoginCardProps
 */
interface LoginCardProps {
  /**
   * Additional CSS classes to apply to the card container for custom styling.
   *
   * @default "mx-4 w-full md:w-1/2"
   */
  className?: string;

  /**
   * The main heading text displayed at the top of the login card.
   *
   * @default "Welcome Back"
   */
  title?: string;

  /**
   * The descriptive text displayed below the title to provide context or instructions.
   *
   * @default "Please enter your details"
   */
  description?: string;
}

/**
 * A comprehensive login card component that provides multiple authentication options.
 *
 * This component renders a complete login interface including email/password authentication
 * via a login form, Google OAuth sign-in, and navigation to the registration page. It's
 * built using the SharedCard component for consistent styling and layout. The card includes
 * a header with customizable title and description, a login form for customer authentication,
 * a separator, a Google sign-in button, and a footer with a link to the registration page.
 *
 * @param props - The component props
 * @param props.className - Additional CSS classes for styling the card container
 * @param props.title - The main heading text for the card
 * @param props.description - Descriptive text below the title
 *
 * @returns A JSX element containing the complete login card interface
 *
 * @see {@link LoginForm} for the email/password authentication form
 * @see {@link SharedCard} for the underlying card component
 * @see {@link signIn} for the authentication function from NextAuth.js
 *
 * @throws {Error} Throws an error if Google login fails or is not properly configured
 */
export default function LoginCard({
  className = "mx-4 w-full md:w-1/2",
  title = "Welcome Back",
  description = "Please enter your details",
}: LoginCardProps) {
  const router = useRouter();
  const handleGoogleLogin = async () => {
    try {
      await signIn("google");
    } catch (err) {
      console.error("Google login failed:", err);
      throw new Error("Google login is not yet implemented");
    }
  };

  const finalConfig = {
    className: className || config.className,
    title: title || config.title,
    description: description || config.description,
  };

  return (
    <SharedCard
      title={finalConfig.title}
      description={finalConfig.description}
      showHeader={true}
      showFooter={true}
      footerContent={
        <LoginFooter onNavigateToRegister={handlers.onNavigateToRegister} />
      }
      className={finalConfig.className}
    >
      <LoginForm />
      <Separator className={"my-4"} />
      <SharedAuthProviderButton
        config={googleAuthConfig}
        disabled={state.isLoading}
      />
    </SharedCard>
  );
}
