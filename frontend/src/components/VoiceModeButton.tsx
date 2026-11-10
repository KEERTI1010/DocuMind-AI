import { Headphones } from "lucide-react";

/**
 * Voice Mode button for the future continuous Gemini Live conversation.
 *
 * STATUS: Not yet implemented.
 *
 * This button is intentionally disabled and non-interactive. It exists as an
 * honest placeholder so users can see where the upcoming continuous voice
 * conversation experience will live. It does not simulate a live session,
 * display fake animations, or pretend that functionality exists.
 *
 * When Gemini Live voice mode is implemented (Phase 2), this component will be
 * replaced with a real toggle that opens the dedicated Voice Mode interface.
 */
export default function VoiceModeButton() {
  return (
    <button
      type="button"
      disabled
      title="Voice Mode — coming soon"
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg theme-text-faint cursor-not-allowed"
      aria-label="Voice Mode — coming soon"
    >
      <Headphones className="h-4 w-4" />
    </button>
  );
}