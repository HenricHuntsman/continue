import { CreditStatus } from "core/control-plane/client";
import { useCallback, useState } from "react";

export function useCreditStatus() {
  const [creditStatus, setCreditStatus] = useState<CreditStatus | null>(null);

  const refreshCreditStatus = useCallback(async () => {
    // Local-first fork: credit status checks are disabled.
    setCreditStatus(null);
  }, []);

  return {
    creditStatus,
    outOfStarterCredits: false,
    isUsingFreeTrial: false,
    refreshCreditStatus,
  };
}
