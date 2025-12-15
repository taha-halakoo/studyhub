import { supabase } from './supabase';

// DEBUG: Set this to true to see detailed logs in the console
const DEBUG_MODE = true;

const getApiKey = async (): Promise<string | null> => {
  // 1. Try Environment Variable
  const envKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (envKey) {
    if (DEBUG_MODE) console.log("[AI] Using VITE_OPENROUTER_API_KEY from env");
    return envKey;
  }

  // 2. Try Supabase Database
  try {
    if (DEBUG_MODE) console.log("[AI] Fetching key from Supabase...");
    
    // Check session first - RLS requires an active session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.warn("[AI] No active session. Cannot fetch secrets via RLS.");
      return null;
    }

    const { data, error } = await supabase
      .from('app_secrets')
      .select('value')
      .eq('name', 'OPENROUTER_API_KEY')
      .single();

    if (error) {
      console.error("[AI] Supabase Error:", error.message);
      return null;
    }

    if (!data) {
      console.error("[AI] Key 'OPENROUTER_API_KEY' not found in app_secrets table.");
      return null;
    }

    if (DEBUG_MODE) console.log("[AI] Key fetched successfully from DB.");
    return data.value;

  } catch (err) {
    console.error("[AI] Unexpected error fetching key:", err);
    return null;
  }
};

const OPENROUTER_MODEL = "google/gemini-2.0-flash-exp:free";

export const cleanAIResponse = (text: string): string => {
  try {
    let cleaned = text.replace(/```json\s*/g, '').replace(/```/g, '').trim();
    const firstBracket = cleaned.search(/[\{\[]/);
    const lastBracket = cleaned.search(/[\}\]]$/);

    if (firstBracket !== -1 && lastBracket !== -1) {
        const lastIndex = cleaned.lastIndexOf('}') > cleaned.lastIndexOf(']') 
            ? cleaned.lastIndexOf('}') 
            : cleaned.lastIndexOf(']');
        cleaned = cleaned.substring(firstBracket, lastIndex + 1);
    }
    return cleaned;
  } catch (e) {
    console.error("JSON Cleaning Failed", e);
    return text;
  }
};

export const generateGeminiResponse = async (prompt: string): Promise<string> => {
  const apiKey = await getApiKey();

  if (!apiKey) {
    throw new Error("Missing API Key. Ensure you are logged in and the key is in 'app_secrets'.");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "StudyHub Ultimate",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[AI] OpenRouter API Error:", errorData);
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("[AI] Empty response data:", data);
      throw new Error("Received empty response from AI.");
    }

    return content;

  } catch (error: any) {
    console.error("[AI] Request Failed:", error);
    throw new Error(`AI Connection Failed: ${error.message}`);
  }
};