import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, StopCircle } from "lucide-react";

type SpeechRecognitionCtor =
  | (new () => {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult: ((e: any) => void) | null;
      onerror: ((e: any) => void) | null;
      onend: (() => void) | null;
      onstart: (() => void) | null;
      start(): void;
      stop(): void;
    });

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

interface MicrophoneButton {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function MicrophoneButton({ onTranscript, disabled }: MicrophoneButton) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognitionCtor extends new () => any ? InstanceType<SpeechRecognitionCtor> : any>(null);
  const onTranscriptRef = useRef(onTranscript);
  const finalTextRef = useRef("");
  const processedFinalIndexRef = useRef(-1);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  });

  useEffect(() => {
    setSupported(Boolean(getSpeechRecognition()));
  }, []);

  const stop = (flush: boolean) => {
    try {
      recRef.current?.stop();
    } catch (err) {
      setError("Failed to stop microphone. Please try again.");
    }
    if (flush && finalTextRef.current) {
      onTranscriptRef.current(finalTextRef.current);
    }
    finalTextRef.current = "";
    processedFinalIndexRef.current = -1;
    setRecording(false);
  };

  const toggle = () => {
    if (disabled || !supported) {
      if (!supported) setError("Speech recognition is not supported in this browser.");
      return;
    }
    setError(null);

    if (recording) {
      stop(true);
      return;
    }

    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      setSupported(false);
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const rec = new Ctor();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onstart = () => {
      finalTextRef.current = "";
      processedFinalIndexRef.current = -1;
      setRecording(true);
    };
    rec.onresult = (e: any) => {
      let interim = "";
      let newFinal = "";
      const results = e.results;
      const startIdx = processedFinalIndexRef.current + 1;

      for (let i = startIdx; i < results.length; i++) {
        const transcript = results[i][0].transcript;
        if (results[i].isFinal) {
          newFinal += (newFinal ? " " : "") + transcript;
          processedFinalIndexRef.current = i;
        } else {
          interim += (interim ? " " : "") + transcript;
        }
      }

      if (newFinal) {
        finalTextRef.current = (finalTextRef.current + (finalTextRef.current ? " " : "") + newFinal).replace(/\s+/g, " ").trim();
      }

      const displayText = finalTextRef.current + (interim ? ` ${interim}` : "");
      onTranscriptRef.current(displayText);
    };
    rec.onerror = (e: any) => {
      const msg = e?.error;
      if (msg === "not-allowed" || msg === "service-not-allowed") {
        setError("Microphone permission denied. Allow microphone access to use voice input.");
      } else if (msg === "no-speech") {
        // ignore
      } else {
        setError("Speech recognition error. Please try again.");
      }
      stop(false);
    };
    rec.onend = () => {
      setRecording(false);
    };
    recRef.current = rec;
    try {
      rec.start();
    } catch (err) {
      setError("Could not start microphone. Please check your browser permissions.");
    }
  };

  useEffect(() => {
    return () => {
      try {
        recRef.current?.stop();
      } catch (err) {
        // ignore on unmount
      }
    };
  }, []);

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        title="Speech recognition is not supported in this browser"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg theme-text-faint"
      >
        <MicOff className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        title={recording ? "Stop recording" : "Voice input"}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
          recording
            ? "bg-red-500 text-white hover:bg-red-600"
            : "theme-text-muted hover:theme-accent-soft hover:theme-primary-text"
        } disabled:opacity-60`}
      >
        {recording ? <StopCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </button>
      {recording && (
        <span className="flex items-center gap-1.5 text-sm font-medium text-red-600">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          Listening…
        </span>
      )}
      {error && <span className="max-w-[260px] text-sm text-red-600">{error}</span>}
    </div>
  );
}