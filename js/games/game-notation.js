import { shuffleArray, startGameTimer, MAX_ERRORS } from '../utils/helpers.js';
import { incrementCorrect, incrementWrong } from '../core/leaderboard.js';
import { startSectionTimer } from '../core/router.js';

export function renderSectionNotation() {
    const div = document.createElement('div'); div.className = 'section-card';
    div.innerHTML = `<div class="concept-area"><div class="concept-title">📝 列舉法與描述法</div><div class="concept-def">✨ <strong>列舉法</strong>：將所有元素列出，如 { 🍎, 🍌, 🍓 }。</div><div class="concept-def">✨ <strong>描述法</strong>：用條件描述，如 { x | x 是水果 }。</div><div class="example-box">🌟 例：{ 2, 4, 6 } 的描述法是「小於 7 的正偶數」。</div></div>`;
    const startBtn = document.createElement('button'); startBtn.className = 'start-game-btn'; startBtn.innerText = '🎮 開始挑戰';
    const wrapper = document.createElement('div'); wrapper.className = 'game-wrapper';
    startBtn.addEventListener('click', () => {
        startSectionTimer();
        if (!wrapper.children.length) wrapper.appendChild(createNotationGame());
        wrapper.classList.add('active-game');
        startBtn.style.display = 'none';
    });
    div.appendChild(startBtn); div.appendChild(wrapper);
    return div;
}

function createNotationGame() {
    let missions = [], index = 0, score = 0, completedFlags = [], allDone = false, elements = {}, timerInterval = null;
    let errorCount = 0, selectedOption = null;
    function init() { let shuffled = shuffleArray([...window.NOTATION_BANK]); missions = shuffled.slice(0, 5); completedFlags = new Array(5).fill(false); index = 0; score = 0; allDone = false; errorCount = 0; selectedOption = null; }
    function getMission() { return missions[index]; }
    function isCurrentCompleted() { return completedFlags[index]; }
    function stopTimerCondition() { return allDone; }
    function updateUI() {
        elements.totalScore.innerText = score;
        let done = completedFlags.filter(v=>v).length;
        elements.progress.innerText = `${done} / ${missions.length}`;
        elements.missionCounter.innerText = `第${index+1}關 / 共${missions.length}關`;
        elements.errorDisplay.innerText = `❌ ${errorCount}/${MAX_ERRORS}`;
        elements.nextBtn.disabled = !isCurrentCompleted();
        elements.submitBtn.disabled = (selectedOption === null);
        if (isCurrentCompleted()) elements.nextBtn.innerText = (index === missions.length-1) ? "🏁 完成挑戰 🎉" : "🌟 下一關 ➡️";
        if (done === missions.length && !allDone) { allDone = true; setTimeout(() => document.getElementById('notationCompleteModal').classList.add('active'), 400); }
    }
    function forceNewQuestion() {
        let newMission; do { newMission = shuffleArray([...window.NOTATION_BANK])[0]; } while (newMission.desc === getMission().desc);
        missions[index] = newMission;
        selectedOption = null; errorCount = 0; score = 0;
        elements.gameContainer.classList.remove('game-complete');
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = startGameTimer(elements.timerDisplay, stopTimerCondition);
        renderQuestion(); updateUI();
        showFeedback(`⚠️ 錯誤次數過多，分數歸零並更換新題目！`, false);
    }
    function showFeedback(msg, isErr=false) { elements.feedback.innerHTML = `<span>${isErr ? '❌' : '💡'}</span> ${msg}`; }
    function handleSubmit() {
        if (isCurrentCompleted() || allDone) return;
        const mission = getMission();
        if (selectedOption === mission.answer) {
            score += 10; incrementCorrect();
            completedFlags[index] = true;
            showFeedback(`✅ 正確！ +10分`, false);
            elements.gameContainer.classList.add('game-complete');
            updateUI();
        } else {
            errorCount++; incrementWrong(); updateUI();
            if (errorCount >= MAX_ERRORS) { showFeedback(`❌ 答錯了！已達 ${MAX_ERRORS} 次錯誤。`, true); forceNewQuestion(); }
            else { showFeedback(`❌ 答案不正確，再試試看 (剩餘錯誤: ${MAX_ERRORS - errorCount})`, true); selectedOption = null; renderQuestion(); updateUI(); }
        }
    }
    function selectOption(idx) { if (isCurrentCompleted() || allDone) return; selectedOption = idx; renderQuestion(); elements.submitBtn.disabled = false; }
    function renderQuestion() {
        const mission = getMission();
        elements.questionDesc.innerText = mission.desc;
        elements.optionsContainer.innerHTML = '';
        mission.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn' + (selectedOption === idx ? ' selected' : '');
            btn.innerText = opt;
            btn.addEventListener('click', () => selectOption(idx));
            if (isCurrentCompleted()) btn.disabled = true;
            elements.optionsContainer.appendChild(btn);
        });
    }
    function nextMission() { if (!isCurrentCompleted()) { showFeedback(`⚠️ 請先完成當前關卡`, true); return; } if (index === missions.length-1) return; index++; selectedOption = null; errorCount = 0; renderQuestion(); updateUI(); elements.gameContainer.classList.remove('game-complete'); showFeedback(`🚀 進入下一題！`, false); }
    function resetFull() { if (timerInterval) clearInterval(timerInterval); init(); renderQuestion(); updateUI(); elements.gameContainer.classList.remove('game-complete'); showFeedback(`🎯 選擇正確的描述法或列舉法`, false); timerInterval = startGameTimer(elements.timerDisplay, stopTimerCondition); }
    init();
    const container = document.createElement('div'); container.className = 'game-container';
    container.innerHTML = `<div class="status-bar"><div class="score-box"><span>🏆 總分</span> <span id="notScore">0</span></div><div class="progress-badge">✅ 進度 <span id="notProgress">0 / 0</span> <span id="notMissionCounter">第1關 / 共5關</span></div><div class="timer-badge" id="notTimer">⏱️ 00:00</div><div class="error-counter" id="notErrors">❌ 0/3</div></div><div class="mission-card"><div class="mission-title">📝 列舉法 vs 描述法</div><div class="mission-desc" id="notQuestion">題目載入中...</div></div><div id="notOptions" class="options-container"></div><div class="feedback-area" id="notFeedback"><span>🎯</span> 點擊選項，再按「確定」提交</div><div class="buttons-panel"><button class="btn" id="notResetBtn">🔄 重新開始</button><button class="btn btn-primary" id="notSubmitBtn" disabled>✅ 確定</button><button class="btn btn-primary" id="notNextBtn" disabled>🌟 下一關 ➡️</button></div>`;
    elements = { totalScore: container.querySelector('#notScore'), progress: container.querySelector('#notProgress'), missionCounter: container.querySelector('#notMissionCounter'), questionDesc: container.querySelector('#notQuestion'), optionsContainer: container.querySelector('#notOptions'), feedback: container.querySelector('#notFeedback'), nextBtn: container.querySelector('#notNextBtn'), resetBtn: container.querySelector('#notResetBtn'), submitBtn: container.querySelector('#notSubmitBtn'), gameContainer: container, timerDisplay: container.querySelector('#notTimer'), errorDisplay: container.querySelector('#notErrors') };
    elements.nextBtn.addEventListener('click', nextMission); elements.resetBtn.addEventListener('click', resetFull); elements.submitBtn.addEventListener('click', handleSubmit);
    resetFull(); renderQuestion(); updateUI();
    return container;
}