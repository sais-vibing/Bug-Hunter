// Main Application Coordinator & UI Event Binding
// Manages screens, Asta AI dialogue, Level Map, Explanation Modals, Settings, and Audio.

import { state } from './state.js';
import { combat } from './combat.js';
import { ollama } from './ollamaClient.js';
import { sound } from './audio.js';
import { fx } from './particles.js';
import { getDifficultyForLevel } from './levels.js';

class AppController {
    constructor() {
        this.dom = {};
    }

    init() {
        // Clear stale Ollama direct host so proxy is used instead
        localStorage.removeItem('bughunter_ollama_host');

        this.cacheDom();
        this.initCanvasFX();
        combat.init();
        this.bindEvents();
        this.bindStateEvents();
        
        // Initial Theme
        document.documentElement.setAttribute('data-theme', state.theme);

        // Run Loading Screen Sequence
        this.runLoadingSequence();
    }

    cacheDom() {
        this.dom = {
            screens: {
                loading: document.getElementById('loading-screen'),
                menu: document.getElementById('menu-screen'),
                topic: document.getElementById('topic-screen'),
                map: document.getElementById('map-screen'),
                gameplay: document.getElementById('gameplay-screen'),
                victory: document.getElementById('victory-modal'),
                defeat: document.getElementById('defeat-modal'),
                endgame: document.getElementById('endgame-screen')
            },
            
            // Loading Screen elements
            loadingCanvas: document.getElementById('loading-portal-canvas'),
            loadingTitleText: document.getElementById('loading-title-text'),
            loadingSubText: document.getElementById('loading-subtext'),
            loadingSkipBtn: document.getElementById('loading-skip-btn'),
            
            // Menu elements
            btnStartQuest: document.getElementById('btn-start-quest'),
            btnSystemConfig: document.getElementById('btn-system-config'),
            btnAbandonGame: document.getElementById('btn-abandon-game'),
            
            // Topic (Asta Chat) elements
            topicInput: document.getElementById('topic-custom-input'),
            btnManifestDungeon: document.getElementById('btn-manifest-dungeon'),
            topicPresetChips: document.querySelectorAll('.topic-chip'),
            topicStatusOverlay: document.getElementById('topic-status-overlay'),
            topicStatusText: document.getElementById('topic-status-text'),
            
            // Map elements
            mapNodesContainer: document.getElementById('map-nodes-container'),
            btnMapBackToMenu: document.getElementById('btn-map-back-menu'),
            mapTopicBadge: document.getElementById('map-topic-badge'),
            
            // Modals & Popups
            settingsModal: document.getElementById('settings-modal'),
            settingsCloseBtn: document.getElementById('settings-close-btn'),
            settingsOllamaHost: document.getElementById('settings-ollama-host'),
            settingsOllamaModel: document.getElementById('settings-ollama-model'),
            settingsTestBtn: document.getElementById('settings-test-btn'),
            settingsTestResult: document.getElementById('settings-test-result'),
            settingsThemeSelect: document.getElementById('settings-theme-select'),
            settingsSoundToggle: document.getElementById('settings-sound-toggle'),
            settingsResetDataBtn: document.getElementById('settings-reset-data-btn'),
            
            pauseModal: document.getElementById('pause-modal'),
            btnPauseGameplay: document.getElementById('btn-pause-gameplay'),
            btnResumeGameplay: document.getElementById('btn-resume-gameplay'),
            btnPauseToMap: document.getElementById('btn-pause-to-map'),
            btnPauseSettings: document.getElementById('btn-pause-settings'),
            
            // Explanation Letters
            victoryModal: document.getElementById('victory-modal'),
            victoryAnswerBox: document.getElementById('victory-correct-answer'),
            victoryExplanation: document.getElementById('victory-explanation-text'),
            victoryXpText: document.getElementById('victory-xp-earned'),
            btnVictoryNext: document.getElementById('btn-victory-next'),
            btnVictoryRetry: document.getElementById('btn-victory-retry'),
            btnVictoryMap: document.getElementById('btn-victory-map'),
            
            defeatModal: document.getElementById('defeat-modal'),
            defeatAnswerBox: document.getElementById('defeat-correct-answer'),
            defeatExplanation: document.getElementById('defeat-explanation-text'),
            btnDefeatRetry: document.getElementById('btn-defeat-retry'),
            btnDefeatMap: document.getElementById('btn-defeat-map'),
            
            // End game screen
            btnEndgameMenu: document.getElementById('btn-endgame-menu'),
            btnEndgameReset: document.getElementById('btn-endgame-reset')
        };
    }

    initCanvasFX() {
        const bgCanvas = document.getElementById('global-particles-canvas');
        if (bgCanvas) {
            fx.init(bgCanvas);
        }
    }

    bindEvents() {
        // Loading Skip
        if (this.dom.loadingSkipBtn) {
            this.dom.loadingSkipBtn.addEventListener('click', () => {
                sound.playClick();
                state.setScreen('menu');
            });
        }

        // Main Menu
        this.dom.btnStartQuest.addEventListener('click', () => {
            sound.playClick();
            state.setScreen('topic');
        });

        this.dom.btnSystemConfig.addEventListener('click', () => {
            sound.playClick();
            this.openSettings();
        });

        this.dom.btnAbandonGame.addEventListener('click', () => {
            sound.playClick();
            if (confirm('Abandon current hunter session and return to Sanctuary?')) {
                state.setScreen('menu');
            }
        });

        // Topic Submission (Screen 3: Asta Chat)
        const submitTopic = async () => {
            const topic = (this.dom.topicInput.value || 'JavaScript Essentials').trim();
            sound.playClick();
            await this.generateDungeonWithOllama(topic);
        };

        this.dom.btnManifestDungeon.addEventListener('click', submitTopic);
        this.dom.topicInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitTopic();
            }
        });

        // Preset Chips
        this.dom.topicPresetChips.forEach(chip => {
            chip.addEventListener('click', () => {
                sound.playClick();
                this.dom.topicInput.value = chip.dataset.topic;
                submitTopic();
            });
        });

        // Map navigation
        this.dom.btnMapBackToMenu.addEventListener('click', () => {
            sound.playClick();
            state.setScreen('menu');
        });

        // Pause button
        this.dom.btnPauseGameplay.addEventListener('click', () => {
            sound.playClick();
            this.dom.pauseModal.classList.remove('hidden');
        });

        this.dom.btnResumeGameplay.addEventListener('click', () => {
            sound.playClick();
            this.dom.pauseModal.classList.add('hidden');
        });

        this.dom.btnPauseToMap.addEventListener('click', () => {
            sound.playClick();
            this.dom.pauseModal.classList.add('hidden');
            state.clearTypingTimer();
            state.setScreen('map');
        });

        this.dom.btnPauseSettings.addEventListener('click', () => {
            sound.playClick();
            this.dom.pauseModal.classList.add('hidden');
            this.openSettings();
        });

        // Victory Explanation Letter Buttons
        this.dom.btnVictoryNext.addEventListener('click', () => {
            sound.playClick();
            this.dom.victoryModal.classList.add('hidden');
            state.nextLevel();
        });

        this.dom.btnVictoryRetry.addEventListener('click', () => {
            sound.playClick();
            this.dom.victoryModal.classList.add('hidden');
            state.retryLevel();
        });

        this.dom.btnVictoryMap.addEventListener('click', () => {
            sound.playClick();
            this.dom.victoryModal.classList.add('hidden');
            state.setScreen('map');
        });

        // Defeat Explanation Letter Buttons
        this.dom.btnDefeatRetry.addEventListener('click', () => {
            sound.playClick();
            this.dom.defeatModal.classList.add('hidden');
            state.retryLevel();
        });

        this.dom.btnDefeatMap.addEventListener('click', () => {
            sound.playClick();
            this.dom.defeatModal.classList.add('hidden');
            state.setScreen('map');
        });

        // End Game Celebration Buttons
        this.dom.btnEndgameMenu.addEventListener('click', () => {
            sound.playClick();
            state.setScreen('menu');
        });

        this.dom.btnEndgameReset.addEventListener('click', () => {
            sound.playClick();
            state.resetProgress();
        });

        // Settings Modal events
        this.dom.settingsCloseBtn.addEventListener('click', () => {
            sound.playClick();
            this.closeSettings();
        });

        this.dom.settingsTestBtn.addEventListener('click', async () => {
            sound.playClick();
            this.dom.settingsTestResult.textContent = 'Testing connection to Ollama...';
            this.dom.settingsTestResult.className = 'test-result-pending';
            
            ollama.setHost(this.dom.settingsOllamaHost.value);
            ollama.setModel(this.dom.settingsOllamaModel.value);

            const result = await ollama.testConnection();
            if (result.online) {
                this.dom.settingsTestResult.textContent = `Online! Detected models: ${result.models.join(', ')}`;
                this.dom.settingsTestResult.className = 'test-result-success';
            } else {
                this.dom.settingsTestResult.textContent = `Offline: ${result.error}. (Fallback mock data will be used)`;
                this.dom.settingsTestResult.className = 'test-result-error';
            }
        });

        this.dom.settingsThemeSelect.addEventListener('change', (e) => {
            sound.playClick();
            state.setTheme(e.target.value);
        });

        this.dom.settingsSoundToggle.addEventListener('change', (e) => {
            sound.setMuted(!e.target.checked);
        });

        this.dom.settingsResetDataBtn.addEventListener('click', () => {
            if (confirm('Erase all hunter progress, rank, and unlocked levels?')) {
                sound.playWrong();
                state.resetProgress();
                this.closeSettings();
            }
        });
    }

    bindStateEvents() {
        state.subscribe((event, data) => {
            switch (event) {
                case 'screen_change':
                    this.showScreen(data);
                    break;
                case 'level_selected':
                    combat.renderCurrentLevel();
                    break;
                case 'player_victory':
                    this.showVictoryLetter(data);
                    break;
                case 'player_defeated':
                    this.showDefeatLetter(data);
                    break;
                case 'timer_defeat':
                    this.showDefeatLetter({ level: data, reason: 'Countdown timer elapsed!' });
                    break;
            }
        });
    }

    showScreen(screenName) {
        Object.entries(this.dom.screens).forEach(([name, el]) => {
            if (el) {
                if (name === screenName) {
                    el.classList.remove('hidden');
                } else if (!name.includes('modal')) {
                    el.classList.add('hidden');
                }
            }
        });

        if (screenName === 'map') {
            this.renderLevelMap();
        } else if (screenName === 'loading') {
            fx.setPortalActive(true);
        } else {
            fx.setPortalActive(false);
        }
    }

    runLoadingSequence() {
        // Display the portal artwork and transition automatically to Main Menu
        this.loadingTimer = setTimeout(() => {
            state.setScreen('menu');
        }, 2800);

        // Escape key skip
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.currentScreen === 'loading') {
                if (this.loadingTimer) clearTimeout(this.loadingTimer);
                sound.playClick();
                state.setScreen('menu');
            }
        });
    }

    async generateDungeonWithOllama(topic) {
        this.dom.topicStatusOverlay.classList.remove('hidden');
        this.dom.topicStatusText.textContent = `Awakening Gate for: "${topic}"...`;
        sound.playSwordSlash();

        const result = await ollama.generateCurriculum(topic, (msg) => {
            this.dom.topicStatusText.textContent = msg;
        });

        state.setCurriculum(result.levels, topic);
        this.dom.mapTopicBadge.textContent = topic.toUpperCase();

        setTimeout(() => {
            this.dom.topicStatusOverlay.classList.add('hidden');
            sound.playLevelUp();
            state.setScreen('map');
        }, 800);
    }

    renderLevelMap() {
        const container = this.dom.mapNodesContainer;
        if (!container) return;
        container.innerHTML = '';

        // 30 Candy-Crush style nodes in a responsive zigzag pathway
        for (let i = 1; i <= 30; i++) {
            const nodeEl = document.createElement('div');
            const diff = getDifficultyForLevel(i);
            const isBoss = diff === 'hard';
            const isCleared = i < state.unlockedLevel;
            const isCurrent = i === state.unlockedLevel;
            const isLocked = i > state.unlockedLevel;

            nodeEl.className = `map-node ${diff} ${isBoss ? 'boss-node' : ''} ${isCurrent ? 'current' : ''} ${isCleared ? 'cleared' : ''} ${isLocked ? 'locked' : 'unlocked'}`;
            
            nodeEl.innerHTML = `
                <div class="node-inner">
                    <span class="node-badge-tier">${diff.toUpperCase()}</span>
                    <span class="node-number">${isCleared ? '✓' : isLocked ? '🔒' : isBoss ? '💀' : String(i).padStart(2, '0')}</span>
                    <span class="node-title">${isBoss ? (i === 30 ? 'FINAL OVERLORD' : 'BOSS RAID') : `GATE ${i}`}</span>
                </div>
            `;

            if (!isLocked) {
                nodeEl.addEventListener('click', () => {
                    sound.playClick();
                    state.selectLevel(i);
                });
            }

            container.appendChild(nodeEl);
        }

        // Auto-scroll to current frontier
        setTimeout(() => {
            const currentEl = container.querySelector('.map-node.current');
            if (currentEl) {
                currentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }

    showVictoryLetter(data) {
        sound.playLevelUp();
        const level = data.level;
        this.dom.victoryAnswerBox.textContent = level.correct_answer;
        this.dom.victoryExplanation.textContent = level.explanation;
        this.dom.victoryXpText.textContent = `+${data.xpGained} XP`;

        this.dom.victoryModal.classList.remove('hidden');
    }

    showDefeatLetter(data) {
        sound.playDeath();
        const level = data.level;
        this.dom.defeatAnswerBox.textContent = level.correct_answer;
        this.dom.defeatExplanation.textContent = level.explanation;

        this.dom.defeatModal.classList.remove('hidden');
    }

    openSettings() {
        this.dom.settingsOllamaHost.value = ollama.host;
        this.dom.settingsOllamaModel.value = ollama.model;
        this.dom.settingsThemeSelect.value = state.theme;
        this.dom.settingsSoundToggle.checked = !sound.muted;
        this.dom.settingsTestResult.textContent = '';
        this.dom.settingsModal.classList.remove('hidden');
    }

    closeSettings() {
        this.dom.settingsModal.classList.add('hidden');
    }
}

// Bootstrap on DOM loaded
window.addEventListener('DOMContentLoaded', () => {
    const app = new AppController();
    app.init();
});
