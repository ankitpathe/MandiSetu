"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Sparkles, Volume2, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { parseHindiSpeech, ParsedSpeechData } from "@/lib/speech-parser";

interface VoiceInputProps {
  onParsed: (data: ParsedSpeechData) => void;
}

export default function VoiceInput({ onParsed }: VoiceInputProps) {
  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Sample Hindi voice test clips for 1-tap testing
  const samplePrompts = [
    "Nagpur mandi se Chhindwara ke liye pickup khali hai",
    "Indore se Betul tamatar bhejna hai Tata 407 mein bhada 3500",
    "Mumbai Vashi se Indore 6 wheeler khali hai kal subah nikalna hai",
  ];

  const handleSpeechComplete = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const parsed = parseHindiSpeech(text);
      onParsed(parsed);
      setSuccessNotice(
        `Pehechaan liya! ${parsed.origin || "Mandi"} ➔ ${parsed.destination || "Mandi"} (${parsed.vehicleType || "Gadi"})`
      );
      const timer = setTimeout(() => setSuccessNotice(null), 5000);
      return () => clearTimeout(timer);
    },
    [onParsed]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "hi-IN"; // Hindi / Indian English / Hinglish

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
        setSuccessNotice(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[0]?.isFinal) {
          handleSpeechComplete(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setSpeechError("Microphone permission blocked hai. Neeche sample par tap karein.");
        } else if (event.error !== "aborted") {
          setSpeechError("Awaaz theek se nahi suni gayi. Dobara bolein.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn("Speech recognition initialization error:", err);
      setIsSupported(false);
    }

    // Critical Performance Cleanup: Stop & Abort audio streams to prevent memory leaks
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
          recognitionRef.current.stop();
        } catch {
          // Ignore abort errors during unmount
        }
        recognitionRef.current = null;
      }
    };
  }, [handleSpeechComplete]);

  const toggleListening = () => {
    if (!isSupported) {
      setSpeechError("Browser Speech API is unsupported. Use 1-tap voice samples below.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (err) {
        console.warn("Stop error:", err);
      }
      setIsListening(false);
    } else {
      setTranscript("");
      setSpeechError(null);
      setSuccessNotice(null);
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.warn("Restarting speech engine:", e);
        try {
          recognitionRef.current?.abort();
        } catch {
          // ignore
        }
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch {
            setSpeechError("Microphone start nahi ho saka. Dobara dabayein.");
          }
        }, 150);
      }
    }
  };

  const handleSimulatePrompt = (sample: string) => {
    setTranscript(sample);
    handleSpeechComplete(sample);
  };

  return (
    <div className="bg-gradient-to-b from-emerald-950/60 to-slate-900 border-2 border-emerald-500/50 rounded-2xl p-4 shadow-xl text-white relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Title Header */}
      <div className="flex items-center space-x-2 mb-2">
        <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <Sparkles className="w-4 h-4" />
        </span>
        <h3 className="text-xs font-black tracking-wide text-emerald-400 uppercase">
          SABSE AASAN OPTION - Likhna nahi aata? Bol kar post karein!
        </h3>
      </div>

      <p className="text-xs text-slate-300 mb-4 leading-relaxed">
        Boliye jaise:{" "}
        <span className="text-emerald-300 font-semibold">
          &ldquo;Nagpur mandi se Chhindwara ke liye pickup khali hai&rdquo;
        </span>{" "}
        aur form apne aap bhar jayega!
      </p>

      {/* Center Animated Mic Button */}
      <div className="flex flex-col items-center justify-center my-2">
        <button
          type="button"
          onClick={toggleListening}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isListening
              ? "bg-red-500 text-white animate-mic-pulse shadow-xl shadow-red-500/50"
              : "bg-gradient-to-tr from-emerald-600 to-teal-400 text-white hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/40"
          }`}
          aria-label={isListening ? "Stop listening" : "Start speaking"}
        >
          {isListening ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}

          {/* Micro sound waves when listening */}
          {isListening && (
            <div className="absolute -bottom-6 flex items-center space-x-1">
              <span className="w-1 bg-emerald-400 rounded-full wave-bar-1" />
              <span className="w-1 bg-emerald-400 rounded-full wave-bar-2" />
              <span className="w-1 bg-emerald-400 rounded-full wave-bar-3" />
              <span className="w-1 bg-emerald-400 rounded-full wave-bar-4" />
              <span className="w-1 bg-emerald-400 rounded-full wave-bar-5" />
            </div>
          )}
        </button>

        <span className="mt-4 text-xs font-bold text-slate-200">
          {isListening ? (
            <span className="text-red-400 animate-pulse flex items-center">
              ● Sun rahe hain... Boliye
            </span>
          ) : (
            <span className="text-emerald-400">Mic Dabayein Aur Boliye</span>
          )}
        </span>
      </div>

      {/* Browser Speech API Fallback notice */}
      {!isSupported && (
        <div className="mt-3 p-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-center space-x-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Is browser mein direct mic unsupported hai. Neeche diye quick sample pe tap karein.</span>
        </div>
      )}

      {/* Transcribed text display */}
      {transcript && (
        <div className="mt-3 p-2.5 rounded-xl bg-slate-800/80 border border-emerald-500/30 text-xs text-emerald-200 flex items-start space-x-2">
          <Volume2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-400 block text-[10px]">Aapne bola:</span>
            <span>&ldquo;{transcript}&rdquo;</span>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successNotice && (
        <div className="mt-2.5 p-2 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Error notice */}
      {speechError && (
        <div className="mt-2.5 p-2 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Quick 1-Tap Voice Test Chips */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <span className="text-[10px] text-slate-400 font-semibold block mb-1.5 uppercase tracking-wider">
          Quick Test: Kisi bhi bol-chaal sample par tap karein:
        </span>
        <div className="flex flex-col space-y-1.5">
          {samplePrompts.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSimulatePrompt(sample)}
              className="text-left text-[11px] bg-slate-800/90 hover:bg-slate-700/80 active:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500/50 rounded-lg px-2.5 py-1.5 text-slate-300 hover:text-white transition-all flex items-center justify-between group"
            >
              <span className="truncate mr-2">&ldquo;{sample}&rdquo;</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                Auto Fill ⚡
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
