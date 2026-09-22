import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { Modality } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { text, voice = "Kore" } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, message: "Text is required for speech synthesis" },
        { status: 400 }
      );
    }

    // Limit text length to prevent timeouts
    const sanitizedText = text.slice(0, 750);

    const ai = getGeminiClient();

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [
          {
            parts: [
              {
                text: `Read this authoritative AniDex field entry clearly in an informative, engaging natural wildlife explorer tone: ${sanitizedText}`,
              },
            ],
          },
        ],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voice, // 'Kore', 'Puck', 'Fenrir', 'Zephyr', 'Charon'
              },
            },
          },
        },
      });

      const audioPart = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      if (audioPart && audioPart.data) {
        return NextResponse.json({
          success: true,
          audioData: audioPart.data,
          mimeType: audioPart.mimeType || "audio/pcm;rate=24000",
          sampleRate: 24000,
          text: sanitizedText,
        });
      }
    } catch (ttsErr: any) {
      console.warn("Gemini TTS service notice (falling back to client Web Speech):", ttsErr?.message);
    }

    // Fallback: Notify client to use high-quality local Web Speech API
    return NextResponse.json({
      success: true,
      audioData: null,
      fallbackToWebSpeech: true,
      text: sanitizedText,
    });
  } catch (error: any) {
    console.error("Speech route error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to generate speech" },
      { status: 500 }
    );
  }
}
