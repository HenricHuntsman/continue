import { CpuChipIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { SecondaryButton } from "../../components";
import { IdeMessengerContext } from "../../context/IdeMessenger";

export function OutOfCreditsDialog() {
  const ideMessenger = useContext(IdeMessengerContext);

  return (
    <div className={`flex flex-col gap-1 px-3 pb-2 pt-3`}>
      <p className="m-0 p-0 text-lg">
        Continue account credits are unavailable
      </p>

      <div className="mt-2 flex flex-col gap-1.5">
        <span>
          Switch to local Ollama models to keep using Continue without billing.
        </span>
        <div className="flex flex-row flex-wrap items-center gap-2">
          <SecondaryButton
            className="flex flex-row items-center gap-2 hover:opacity-70"
            onClick={() => {
              ideMessenger.post("config/openProfile", {
                profileId: undefined,
              });
            }}
          >
            <CpuChipIcon className="h-5 w-5" />
            <span className="xs:flex hidden">Configure Ollama</span>
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}
