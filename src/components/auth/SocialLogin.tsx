import { Button } from "@/components/ui/button";

interface SocialLoginProps {
  onGoogleLogin: () => void;
  isLoading: boolean;
}

export const SocialLogin = ({ onGoogleLogin, isLoading }: SocialLoginProps) => {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="w-full"
        onClick={onGoogleLogin}
        disabled={isLoading}
      >
        Sign up with Google
      </Button>
    </>
  );
};