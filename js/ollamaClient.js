// Ollama API Client for Local Gemma 3:1b Integration
// Connects to local Ollama instance with robust proxy support and language-aware fallback.

import { 
    DEFAULT_LEVELS_JS, 
    DEFAULT_LEVELS_PYTHON, 
    getCurriculumForTopic, 
    isPythonTopic, 
    normalizeLevels, 
    getDifficultyForLevel 
} from './levels.js';

class OllamaClient {
    constructor() {
        // Prefer local dev server proxy to eliminate browser CORS blocks
        this.host = localStorage.getItem('bughunter_ollama_host') || '/api/ollama';
        this.model = localStorage.getItem('bughunter_ollama_model') || 'gemma3:1b';
        this.timeoutMs = 12000; // 12-second timeout for responsive hackathon UX
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
        const hostsToTry = [this.host, '/api/ollama', 'http://127.0.0.1:11434', 'http://localhost:11434'];
        const uniqueHosts = [...new Set(hostsToTry.filter(Boolean))];

        for (const targetHost of uniqueHosts) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3500);

                const res = await fetch(`${targetHost}/api/tags`, {
                    method: 'GET',
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (res.ok) {
                    const data = await res.json();
                    const models = (data.models || []).map(m => m.name);
                    const hasTargetModel = models.some(m => m.includes(this.model) || m.startsWith(this.model));

                    this.host = targetHost;
                    return {
                        online: true,
                        models,
                        hasTargetModel,
                        host: this.host,
                        currentModel: this.model
                    };
                }
            } catch (err) {
                // Continue to next host option
            }
        }

        return {
            online: false,
            error: 'Ollama service offline or unreachable on proxy & port 11434',
            host: this.host
        };
    }

    async generateCurriculum(topic, onStatusUpdate = () => {}) {
        const isPython = isPythonTopic(topic);
        const languageName = isPython ? 'PYTHON' : 'JAVASCRIPT';
        
        onStatusUpdate(`Transmitting quest frequency to local Ollama [${this.model}] for ${languageName}...`);

        const promptStyleExample = isPython 
            ? `a = 20\nb = 10\nsum = a + b\nprint(sum)\n\n# que - what is sum?\nOptions: ["30", "20", "10"], Correct Answer: "30"`
            : `let a = 20;\nlet b = 10;\nlet sum = a + b;\nconsole.log(sum);\n\n// que - what is sum?\nOptions: ["30", "20", "10"], Correct Answer: "30"`;

        const systemPrompt = `You are the BUG HUNTER System AI. Generate an educational curriculum of 30 code debugging and question puzzle levels for the topic: "${topic}".

STRICT LANGUAGE REQUIREMENT:
The required programming language is strictly ${languageName}.
${isPython 
    ? `- ALL code snippets MUST be valid, readable PYTHON.
- NEVER use JavaScript keywords like let, var, const, function, console.log.
- Use Python print(), # comments, and snake_case.` 
    : `- ALL code snippets MUST be valid JAVASCRIPT.`}

QUESTION STYLE:
- Make the starting levels simple, understandable arithmetic/variable operations.
- Example Level 1:
${promptStyleExample}
- Gradually scale up through operations, conditions, loops, functions, lists, and dictionaries.
- Include the question comment inside the code snippet (e.g. # que - what is ...?).

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
    "buggy_code": "code snippet with # que - question",
    "correct_answer": "exact correct answer",
    "options": ["optA", "optB", "optC"],
    "hint": "helpful hint",
    "explanation": "clear explanation"
  }
]`;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

            // Fetch via proxy first with fallback to direct host
            let response;
            try {
                response = await fetch(`${this.host}/api/generate`, {
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
            } catch (fetchErr) {
                if (this.host !== '/api/ollama') {
                    // Try dev proxy
                    this.host = '/api/ollama';
                    response = await fetch('/api/ollama/api/generate', {
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
                } else {
                    throw fetchErr;
                }
            }

            clearTimeout(timeoutId);

            if (!response || !response.ok) {
                throw new Error(`Ollama returned status ${response ? response.status : 'offline'}`);
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
            onStatusUpdate(`Local Ollama offline (${error.message}). Manifesting authentic ${languageName} Dungeon from System Vault...`);
            
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
        // Pure authentic curriculum based on requested language
        const baseCurriculum = getCurriculumForTopic(topic);
        const isPython = isPythonTopic(topic);
        const topicType = isPython ? 'Python' : 'JavaScript';

        return baseCurriculum.map(lvl => {
            const diff = getDifficultyForLevel(lvl.level);
            return {
                ...lvl,
                title: lvl.title.includes(':') ? lvl.title : `${topicType}: ${lvl.title}`,
                difficulty: diff
            };
        });
    }
}

export const ollama = new OllamaClient();

