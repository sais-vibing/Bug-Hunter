// Ollama API Client for Local Gemma 3:1b Integration
// Connects to local Ollama instance with robust error handling and instant local fallback.

import { DEFAULT_LEVELS_JS, normalizeLevels, getDifficultyForLevel } from './levels.js';

class OllamaClient {
    constructor() {
        this.host = localStorage.getItem('bughunter_ollama_host') || 'http://localhost:11434';
        this.model = localStorage.getItem('bughunter_ollama_model') || 'gemma3:1b';
        this.timeoutMs = 12000; // 12-second timeout for hackathon responsiveness
    }

    setHost(host) {
        this.host = host.replace(/\/+$/, '');
        localStorage.setItem('bughunter_ollama_host', this.host);
    }

    setModel(model) {
        this.model = model.trim();
        localStorage.setItem('bughunter_ollama_model', this.model);
    }

    async testConnection() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const res = await fetch(`${this.host}/api/tags`, {
                method: 'GET',
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!res.ok) {
                return { online: false, error: `HTTP ${res.status}: ${res.statusText}` };
            }

            const data = await res.json();
            const models = (data.models || []).map(m => m.name);
            const hasTargetModel = models.some(m => m.includes(this.model) || m.startsWith(this.model));

            return {
                online: true,
                models,
                hasTargetModel,
                host: this.host,
                currentModel: this.model
            };
        } catch (err) {
            return {
                online: false,
                error: err.name === 'AbortError' ? 'Connection timed out (3s)' : err.message,
                host: this.host
            };
        }
    }

    async generateCurriculum(topic, onStatusUpdate = () => {}) {
        onStatusUpdate(`Transmitting quest frequency to local Ollama [${this.model}]...`);

        const systemPrompt = `You are the BUG HUNTER System AI. Generate an educational curriculum of 30 code debugging and fill-in-the-blank puzzle levels for the topic: "${topic}".
STYLE GUIDELINES:
- Make the starting levels approachable and clean, using fill-in-the-blank '?' or clear bug fixes.
- For example, Level 1:
  a = 20
  b = 90
  sum = a + b
  print(?)
  Correct Answer: "sum", Options: ["sum", "a", "b"]
- Gradually scale up through variables, conditions, loops, functions, lists/arrays, objects, and simple algorithms across the 30 levels.
- Keep answers and typing solutions concise and intuitive.

Difficulty structure:
- Levels 1-4: Easy fundamentals
- Levels 5-6: Medium
- Levels 7-9: Easy
- Level 10: Hard Boss
- Levels 11-14: Easy
- Levels 15-16: Medium
- Levels 17-19: Easy
- Level 20: Hard Boss
- Levels 21-24: Easy
- Levels 25-26: Medium
- Levels 27-29: Easy
- Level 30: Hard Final Boss

Output ONLY a raw JSON array of 30 objects with NO markdown formatting, NO extra text:
[
  {
    "level": 1,
    "difficulty": "easy",
    "title": "Short Level Title",
    "prompt": "Instruction for hunter",
    "buggy_code": "code snippet with ? or bug",
    "correct_answer": "exact correct code or answer",
    "options": ["optA", "optB", "optC"],
    "hint": "helpful hint",
    "explanation": "clear explanation of the concept"
  }
]`;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

            const response = await fetch(`${this.host}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.model,
                    prompt: systemPrompt,
                    stream: false,
                    format: 'json',
                    options: {
                        temperature: 0.2,
                        num_predict: 2048
                    }
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Ollama returned status ${response.status}`);
            }

            const data = await response.json();
            const responseText = data.response;
            if (!responseText) {
                throw new Error('Empty response from Ollama model');
            }

            // Extract JSON array
            const parsedLevels = this.parseJsonSafely(responseText);
            if (!parsedLevels || !Array.isArray(parsedLevels) || parsedLevels.length === 0) {
                throw new Error('Model response did not contain a valid JSON array');
            }

            onStatusUpdate(`Successfully channeled ${parsedLevels.length} levels from Ollama!`);
            const normalized = normalizeLevels(parsedLevels, topic);
            return {
                success: true,
                levels: normalized,
                source: 'ollama',
                model: this.model
            };
        } catch (error) {
            console.warn('[OllamaClient] Switching to Local System Vault Fallback:', error.message);
            onStatusUpdate(`Local Ollama unavailable (${error.message}). Manifesting Dungeon from System Vault...`);
            
            // Build specialized fallback levels for this topic
            const fallbackLevels = this.generateFallbackLevels(topic);
            return {
                success: true,
                levels: fallbackLevels,
                source: 'fallback',
                error: error.message
            };
        }
    }

    parseJsonSafely(text) {
        // Strip markdown fences
        let cleaned = text.trim();
        if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }

        // Locate array boundaries [ ... ]
        const firstBracket = cleaned.indexOf('[');
        const lastBracket = cleaned.lastIndexOf(']');
        if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
            cleaned = cleaned.substring(firstBracket, lastBracket + 1);
        }

        try {
            return JSON.parse(cleaned);
        } catch (e) {
            // Attempt to repair trailing commas
            const fixed = cleaned.replace(/,\s*([}\]])/g, '$1');
            try {
                return JSON.parse(fixed);
            } catch (err2) {
                console.error('[OllamaClient] Failed to parse JSON response:', err2, text);
                return null;
            }
        }
    }

    generateFallbackLevels(topic) {
        const lower = topic.toLowerCase();
        let topicType = 'JavaScript';
        if (lower.includes('python')) topicType = 'Python';
        else if (lower.includes('react')) topicType = 'React';
        else if (lower.includes('sql')) topicType = 'SQL';
        else if (lower.includes('loop')) topicType = 'Loops & Algorithms';

        // Adapt existing curriculum to the requested topic
        return DEFAULT_LEVELS_JS.map(lvl => {
            const diff = getDifficultyForLevel(lvl.level);
            return {
                ...lvl,
                title: `${topicType}: ${lvl.title}`,
                difficulty: diff
            };
        });
    }
}

export const ollama = new OllamaClient();
