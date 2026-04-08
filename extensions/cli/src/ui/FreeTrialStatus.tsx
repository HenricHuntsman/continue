import { ModelConfig } from "@continuedev/config-yaml";
import { DefaultApiInterface } from "@continuedev/sdk/dist/api/dist/index.js";
import React, { useEffect } from "react";

export function isModelUsingFreeTrial(_model: ModelConfig): boolean {
  return false;
}

interface FreeTrialStatusProps {
  apiClient?: DefaultApiInterface;
  onTransitionStateChange?: (isShowingTransition: boolean) => void;
  model: ModelConfig;
}

const FreeTrialStatus: React.FC<FreeTrialStatusProps> = ({
  onTransitionStateChange,
}) => {
  useEffect(() => {
    onTransitionStateChange?.(false);
  }, [onTransitionStateChange]);

  return null;
};

export { FreeTrialStatus };
