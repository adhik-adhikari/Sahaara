import { useAuth } from "@clerk/clerk-react";

export function useRequireAuth() {
    const { isSignedIn } = useAuth();

    const requireAuth = (action?: () => void) => {
        if (!isSignedIn) {
            window.dispatchEvent(new CustomEvent("open-signin"));
            return;
        }
        action?.();
    };

    return requireAuth;
}