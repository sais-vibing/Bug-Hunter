# BUG HUNTER

BUG HUNTER is a browser game for learning coding and debugging. Enter a goal, review Asta's learning plan, then clear coding battles to earn XP and unlock levels. Every chapter has ten levels: levels 1–4 and 6–9 are easy, level 5 is medium, and level 10 is a boss. The last boss ends the campaign.

## Requirements

- Node.js 20 or newer
- Ollama and the configured model for personalized campaigns
- A current desktop or mobile browser

There are no npm dependencies. Run `npm start` and open `http://127.0.0.1:3000`. If port 3000 is occupied, set `PORT` in `.env`.

## Install and start Ollama

Install Ollama from its official installer, start the Ollama service, and pull the configured model:

```sh
ollama pull gemma4:e2b
ollama serve
```

If that model tag is unavailable in your installation, choose an installed model and set `OLLAMA_MODEL` in `.env` or enter its name in game settings. The local server connects to Ollama at `http://127.0.0.1:11434` by default. Configure a different server address with `OLLAMA_URL` in `.env`; it is never taken from browser input.

The first local generation can take a while while the model loads. `OLLAMA_TIMEOUT_MS` controls how long the server waits before trying Gemini or showing an error.

## Gemini fallback

Copy `.env.example` to `.env` and set `GEMINI_API_KEY` there. You may also set `GEMINI_MODEL`. The server tries Ollama first and then Gemini if Ollama is unavailable or returns malformed or invalid structured content. The key remains on the local server and is never sent to the browser. Without Gemini, the **Offline demo** is still playable when Ollama is unavailable. The demo is labeled as mixed coding practice; it is never presented as a personalized course for a different topic.

Once Ollama and its model are installed, a personalized campaign can be generated without internet. The offline demo needs no AI service.

## Play one level

1. Click **Start**, enter a learning goal, and wait for Asta's plan. Or choose **Offline demo**.
2. Review the chapter outline and open the level map.
3. Enter level 1 and choose an answer. For a choice question, the first wrong answer reveals an optional pet hint; the second wrong answer ends the attempt. For a typing question, an incorrect submission or timeout ends the attempt.
4. Read the explanation letter after victory or defeat. Choose **Retry**, **Map**, or **Next** after a victory.

Settings include sound, reduced animation, and the typing time limit. The menu resumes an existing campaign. Starting another campaign asks before replacing saved progress.

## Saved progress and rules

Campaign plan, generated challenges, completed levels, XP, and settings are stored in browser local storage under `bughunter_campaign_v2` and `bughunter_settings_v2`. Refreshing during a battle restarts the attempt with the **same saved challenge**. Completed levels may be replayed, but XP is awarded only on the first clear. Answers, HP, timing, XP, and unlocking are controlled by application code. Player-entered code is never executed.

## Tests

Run `npm test`. Tests cover boss placement, plan lengths, challenge validation, first and second wrong answers, hint availability, retries, one-time XP, persistence, and typing timeout.

## Known limitations

- AI-generated educational content can be semantically wrong even after structural validation. The server rejects missing fields and obvious answer inconsistencies; human review is still needed for a published course.
- A new personalized campaign needs Ollama or a configured Gemini key. The offline demo is a separate, fixed mixed-topic campaign.
- Local storage is per browser/profile and can be erased by clearing site data. There is no account or cloud sync.
- The legacy static prototype files are not used by the current entry point.
