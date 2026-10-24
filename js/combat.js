// Combat View Controller & Battle Stage Animations
// Coordinates hero/enemy sprites, attack slashes, health bars, countdown timer bar, and the Shadow Pet.

import { state } from './state.js';
import { getMonsterForLevel } from './levels.js';
import { sound } from './audio.js';
import { fx } from './particles.js';

class CombatController {
    constructor() {
        this.dom = {};
        this.isAnimating = false;
    }

    init() {
        this.dom = {
            hudRank: document.getElementById('hud-rank'),
            hudLevel: document.getElementById('hud-level'),
            hudXpBar: document.getElementById('hud-xp-fill'),
            hudXpText: document.getElementById('hud-xp-text'),
            hudHearts: document.getElementById('hud-hearts'),
            
            // Battle Arena
            arenaBg: document.getElementById('battle-arena-bg'),
            heroContainer: document.getElementById('hero-sprite-container'),
            heroImg: document.getElementById('hero-sprite-img'),
            heroHpSegments: document.getElementById('hero-hp-segments'),
            
            enemyContainer: document.getElementById('enemy-sprite-container'),
            enemyImg: document.getElementById('enemy-sprite-img'),
            enemyName: document.getElementById('enemy-name-tag'),
            enemyHpBar: document.getElementById('enemy-hp-fill'),
            
            shadowPet: document.getElementById('battle-shadow-pet'),
            petSpeechBubble: document.getElementById('pet-speech-bubble'),
            
            // Quest Card
            dialogueAvatar: document.getElementById('dialogue-avatar-img'),
            dialogueText: document.getElementById('dialogue-prompt-text'),
            bugCodeSnippet: document.getElementById('bug-code-snippet'),
            
            // Interaction Areas
            mcqArea: document.getElementById('interaction-mcq-area'),
            mcqButtons: [
                document.getElementById('mcq-opt-a'),
                document.getElementById('mcq-opt-b'),
                document.getElementById('mcq-opt-c')
            ],
            typingArea: document.getElementById('interaction-typing-area'),
            typingInput: document.getElementById('typing-code-input'),
            typingSubmitBtn: document.getElementById('typing-submit-btn'),
            typingTimerBar: document.getElementById('typing-timer-progress'),
            typingTimerLabel: document.getElementById('typing-timer-label'),
            
            // Hint modal
            hintModal: document.getElementById('hint-dialog-modal'),
            hintContent: document.getElementById('hint-dialog-content'),
            hintCloseBtn: document.getElementById('hint-close-btn'),
            
            // Sidebar mini track
            sidebarTrack: document.getElementById('sidebar-level-nodes')
        };

        this.bindEvents();
    }

    bindEvents() {
        // Multiple Choice clicks
        this.dom.mcqButtons.forEach((btn, idx) => {
            if (btn) {
                btn.addEventListener('click', () => {
                    if (this.isAnimating) return;
                    sound.playClick();
                    const answer = btn.dataset.value;
                    this.handleSubmission(answer, btn);
                });
            }
        });

        // Typing submission
        if (this.dom.typingSubmitBtn && this.dom.typingInput) {
            const submitTyping = () => {
                if (this.isAnimating) return;
                const val = this.dom.typingInput.value.trim();
                if (!val) return;
                sound.playClick();
                this.handleSubmission(val);
            };

            this.dom.typingSubmitBtn.addEventListener('click', submitTyping);
            this.dom.typingInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    submitTyping();
                }
            });
        }

        // Shadow Pet click
        if (this.dom.shadowPet) {
            this.dom.shadowPet.addEventListener('click', () => {
                sound.playClick();
                this.toggleHint();
            });
        }

        if (this.dom.hintCloseBtn) {
            this.dom.hintCloseBtn.addEventListener('click', () => {
                sound.playClick();
                this.dom.hintModal.classList.add('hidden');
            });
        }
    }

    renderCurrentLevel() {
        const level = state.currentLevel;
        const levelNum = state.currentLevelIndex + 1;
        const monster = getMonsterForLevel(levelNum);

        // Update Top HUD
        this.dom.hudRank.textContent = `${state.playerRank}`;
        this.dom.hudLevel.textContent = `LEVEL ${String(levelNum).padStart(2, '0')} / 30`;
        const xpPercent = Math.min(100, (state.xp % 100));
        this.dom.hudXpBar.style.width = `${xpPercent}%`;
        this.dom.hudXpText.textContent = `${state.xp} XP`;
        this.renderHearts();

        // Update Battle Sprites
        this.dom.heroImg.src = 'assets/hero_idle.png';
        this.dom.heroImg.className = 'hero-sprite idle';
        this.dom.heroContainer.style.transform = 'translateX(0)';

        this.dom.enemyImg.src = monster.sprite;
        this.dom.enemyImg.className = `enemy-sprite idle ${monster.type}`;
        this.dom.enemyName.textContent = monster.name;
        this.dom.enemyHpBar.style.width = '100%';

        // Background styling
        if (state.theme === 'light') {
            this.dom.arenaBg.style.backgroundImage = 'url("assets/bg_nature_arena.jpg")';
        } else {
            this.dom.arenaBg.style.backgroundImage = 'url("assets/bg_dungeon_arena.jpg")';
        }

        // Shadow Pet state
        this.dom.shadowPet.classList.remove('active', 'glowing');
        this.dom.petSpeechBubble.classList.add('hidden');

        // Quest Card info
        this.dom.dialogueText.textContent = level.prompt;
        this.formatSyntaxHighlightedCode(level.buggy_code);

        // Dynamic Interaction Area (Mode A vs Mode B)
        if (level.mode === 'typing') {
            this.dom.mcqArea.classList.add('hidden');
            this.dom.typingArea.classList.remove('hidden');
            this.dom.typingInput.value = '';
            this.dom.typingInput.placeholder = 'Type the exact bug fix code here...';
            this.dom.typingInput.disabled = false;
            this.dom.typingInput.focus();

            // Start Typing Timer
            state.startTypingTimer(
                (remaining, total) => this.updateTimerBar(remaining, total),
                () => this.onTypingTimeout()
            );
        } else {
            this.dom.typingArea.classList.add('hidden');
            this.dom.mcqArea.classList.remove('hidden');

            const letters = ['A', 'B', 'C'];
            level.options.forEach((optText, i) => {
                const btn = this.dom.mcqButtons[i];
                if (btn) {
                    btn.dataset.value = optText;
                    btn.classList.remove('wrong-shake', 'correct-glow', 'disabled');
                    btn.disabled = false;
                    btn.innerHTML = `<span class="opt-badge">${letters[i]}</span><span class="opt-label">${this.escapeHtml(optText)}</span>`;
                }
            });
        }

        this.renderSidebarTrack();
    }

    renderHearts() {
        if (!this.dom.hudHearts) return;
        this.dom.hudHearts.innerHTML = '';
        for (let i = 1; i <= state.maxHp; i++) {
            const heart = document.createElement('span');
            heart.className = `heart-icon ${i <= state.currentHp ? 'filled' : 'empty'}`;
            heart.innerHTML = i <= state.currentHp ? '❤️' : '🖤';
            this.dom.hudHearts.appendChild(heart);
        }

        // Update Hero segmented HP
        if (this.dom.heroHpSegments) {
            const p1 = state.currentHp >= 1 ? 'filled' : 'empty';
            const p2 = state.currentHp >= 2 ? 'filled' : 'empty';
            this.dom.heroHpSegments.innerHTML = `
                <div class="hp-segment ${p1}"></div>
                <div class="hp-segment ${p2}"></div>
            `;
        }
    }

    updateTimerBar(remaining, total) {
        const pct = Math.max(0, (remaining / total) * 100);
        this.dom.typingTimerBar.style.width = `${pct}%`;
        this.dom.typingTimerLabel.textContent = `${remaining}s`;

        if (remaining <= 5) {
            this.dom.typingTimerBar.classList.add('danger');
            sound.playTimerTick();
        } else if (remaining <= 10) {
            this.dom.typingTimerBar.classList.add('warning');
            this.dom.typingTimerBar.classList.remove('danger');
        } else {
            this.dom.typingTimerBar.classList.remove('warning', 'danger');
        }
    }

    onTypingTimeout() {
        sound.playDeath();
        fx.screenShake(document.getElementById('gameplay-screen'), 14, 500);
        this.dom.heroImg.src = 'assets/hero_hurt.png';
        this.dom.heroImg.className = 'hero-sprite hurt';
        fx.spawnFloatingText('TIME EXPIRED!', window.innerWidth * 0.4, window.innerHeight * 0.4, '#ef4444', true);
        
        setTimeout(() => {
            state.setScreen('defeat');
        }, 1200);
    }

    handleSubmission(answer, clickedBtn = null) {
        if (this.isAnimating) return;

        const isCorrect = state.validateAnswer(answer);

        if (isCorrect) {
            this.executeVictoryAttack();
        } else {
            this.executeEnemyCounter(clickedBtn);
        }
    }

    executeVictoryAttack() {
        this.isAnimating = true;
        state.clearTypingTimer();

        // 1. Hero runs forward
        this.dom.heroImg.src = 'assets/hero_run.png';
        this.dom.heroImg.className = 'hero-sprite running';
        this.dom.heroContainer.style.transition = 'transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)';
        this.dom.heroContainer.style.transform = 'translateX(260px)';

        sound.playSwordSlash();

        // 2. Midpoint: Hero slashes with massive cyan crescent arc!
        setTimeout(() => {
            this.dom.heroImg.src = 'assets/hero_attack.png';
            this.dom.heroImg.className = 'hero-sprite attack';

            const enemyRect = this.dom.enemyImg.getBoundingClientRect();
            fx.burstSlashSparks(enemyRect.left + enemyRect.width / 2, enemyRect.top + enemyRect.height / 2, 35);
            fx.spawnFloatingText('-100 CRIT BUG FIX!', enemyRect.left, enemyRect.top - 20, '#00f0ff', true);
            sound.playHit();
            sound.playCorrect();

            // Enemy hit flash and HP drain
            this.dom.enemyImg.classList.add('hit-flash');
            this.dom.enemyHpBar.style.width = '0%';
            fx.screenShake(document.getElementById('gameplay-screen'), 10, 300);

            // 3. Return hero to idle stance
            setTimeout(() => {
                this.dom.heroContainer.style.transition = 'transform 0.3s ease';
                this.dom.heroContainer.style.transform = 'translateX(0)';
                this.dom.heroImg.src = 'assets/hero_idle.png';
                this.dom.heroImg.className = 'hero-sprite idle';
                this.dom.enemyImg.classList.remove('hit-flash');

                // Trigger victory state transition
                setTimeout(() => {
                    this.isAnimating = false;
                    const res = state.handleCorrectAnswer();
                    if (res.isFinalBoss) {
                        state.setScreen('endgame');
                    } else {
                        state.setScreen('victory');
                    }
                }, 400);
            }, 350);
        }, 280);
    }

    executeEnemyCounter(clickedBtn) {
        this.isAnimating = true;
        sound.playWrong();

        if (clickedBtn) {
            clickedBtn.classList.add('wrong-shake');
            clickedBtn.disabled = true;
        }

        // Enemy attacks
        this.dom.enemyImg.classList.add('attacking');

        setTimeout(() => {
            sound.playHit();
            this.dom.enemyImg.classList.remove('attacking');

            // Hero takes damage
            this.dom.heroImg.src = 'assets/hero_hurt.png';
            this.dom.heroImg.className = 'hero-sprite hurt';

            const heroRect = this.dom.heroImg.getBoundingClientRect();
            fx.burstDamageBlood(heroRect.left + heroRect.width / 2, heroRect.top + heroRect.height / 2, 25);
            fx.spawnFloatingText('-1 HP DAMAGE!', heroRect.left, heroRect.top - 20, '#ef4444', true);
            fx.screenShake(document.getElementById('gameplay-screen'), 12, 350);

            const result = state.handleWrongAnswer();
            this.renderHearts();

            if (result.defeated) {
                // 2nd strike: DEFEAT
                sound.playDeath();
                setTimeout(() => {
                    this.isAnimating = false;
                    state.setScreen('defeat');
                }, 1000);
            } else {
                // 1st strike: Reveal Shadow Pet hint!
                this.dom.shadowPet.classList.add('active', 'glowing');
                this.dom.petSpeechBubble.classList.remove('hidden');
                this.dom.petSpeechBubble.textContent = 'Hint Unlocked! Click me!';

                setTimeout(() => {
                    this.dom.heroImg.src = 'assets/hero_idle.png';
                    this.dom.heroImg.className = 'hero-sprite idle';
                    this.isAnimating = false;
                }, 600);
            }
        }, 200);
    }

    toggleHint() {
        if (!state.hintRevealed) return;
        this.dom.hintContent.textContent = state.currentLevel.hint;
        this.dom.hintModal.classList.remove('hidden');
    }

    renderSidebarTrack() {
        if (!this.dom.sidebarTrack) return;
        this.dom.sidebarTrack.innerHTML = '';

        const currentLvl = state.currentLevelIndex + 1;
        // Display a 6-node window around current level (matching image 1!)
        const start = Math.max(1, Math.min(25, currentLvl - 2));
        const end = Math.min(30, start + 5);

        for (let i = start; i <= end; i++) {
            const node = document.createElement('div');
            const isCleared = i < state.unlockedLevel;
            const isCurrent = i === currentLvl;
            const isLocked = i > state.unlockedLevel;

            node.className = `mini-node ${isCurrent ? 'active-glow' : ''} ${isCleared ? 'cleared' : ''} ${isLocked ? 'locked' : ''}`;
            node.innerHTML = `
                <div class="node-circle">
                    ${isCleared ? '✓' : isLocked ? '🔒' : String(i).padStart(2, '0')}
                </div>
            `;
            if (!isLocked) {
                node.addEventListener('click', () => {
                    if (this.isAnimating) return;
                    sound.playClick();
                    state.selectLevel(i);
                });
            }
            this.dom.sidebarTrack.appendChild(node);
        }
    }

    formatSyntaxHighlightedCode(codeStr) {
        if (!this.dom.bugCodeSnippet) return;
        // Fast syntax highlighting with glowing blank indicator for '?'
        let highlighted = this.escapeHtml(codeStr)
            .replace(/\b(const|let|var|function|def|return|if|else|elif|for|while|await|async|try|catch|class|new|print)\b/g, '<span class="kw">$1</span>')
            .replace(/\b(console|Promise|JSON|Number|Math|Array|Object|window)\b/g, '<span class="built-in">$1</span>')
            .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="str">$1</span>')
            .replace(/\b(\d+)\b/g, '<span class="num">$1</span>')
            .replace(/(\/\/.*$|#.*$)/gm, '<span class="comment">$1</span>')
            .replace(/(\?)/g, '<span class="target-blank">?</span>');

        this.dom.bugCodeSnippet.innerHTML = highlighted;
    }

    escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

export const combat = new CombatController();
