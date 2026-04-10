import { shuffleArray, startGameTimer, MAX_ERRORS } from '../utils/helpers.js';
import { incrementCorrect, incrementWrong } from '../core/leaderboard.js';
import { startSectionTimer } from '../core/router.js';

export function renderSectionSubset() {
    const div = document.createElement('div'); div.className = 'section-card';
    div.innerHTML = `<div class="concept-area"><div class="concept-title">📂 子集 (Subset) 與 真子集 (Proper Subset)</div><div class="concept-def">✨ <strong>子集</strong>：A 的所有元素都在 B 中，記作 A ⊆ B。</div><div class="concept-def">✨ <strong>真子集</strong>：A ⊆ B 且 A ≠ B，記作 A ⊂ B。</div><div class="example-box">🌟 例如：{紅色水果} ⊂ {水果}，{水果} ⊆ {水果} 但非真子集。</div></div>`;
    const startBtn = document.createElement('button'); startBtn.className = 'start-game-btn'; startBtn.innerText = '🎮 開始挑戰';
    const wrapper = document.createElement('div'); wrapper.className = 'game-wrapper';
    startBtn.addEventListener('click', () => {
        startSectionTimer();
        if (!wrapper.children.length) {
            const subWrapper = document.createElement('div');
            const game1W = document.createElement('div'); game1W.className = 'game-wrapper';
            const btn1 = document.createElement('button'); btn1.className = 'start-game-btn'; btn1.innerText = '🎮 1. 子集判斷遊戲 (A ⊆ B ?)';
            btn1.addEventListener('click', () => {
                startSectionTimer();
                if (!game1W.children.length) game1W.appendChild(createSubsetGameBasic());
                game1W.classList.add('active-game'); btn1.style.display = 'none';
            });
            const game2W = document.createElement('div'); game2W.className = 'game-wrapper';
            const btn2 = document.createElement('button'); btn2.className = 'start-game-btn'; btn2.innerText = '🎮 2. 真子集分辨遊戲 (A ⊂ B ?)';
            btn2.addEventListener('click', () => {
                startSectionTimer();
                if (!game2W.children.length) game2W.appendChild(createProperSubsetGame());
                game2W.classList.add('active-game'); btn2.style.display = 'none';
            });
            subWrapper.appendChild(btn1); subWrapper.appendChild(game1W);
            subWrapper.appendChild(btn2); subWrapper.appendChild(game2W);
            wrapper.appendChild(subWrapper);
        }
        wrapper.classList.add('active-game'); startBtn.style.display = 'none';
    });
    div.appendChild(startBtn); div.appendChild(wrapper);
    return div;
}

function createSubsetGameBasic() {
    let missions = [], index = 0, score = 0, completedFlags = [], allDone = false, elements = {}, timerInterval = null;
    let errorCount = 0, selectedAnswer = null;
    function init() { let shuffled = shuffleArray([...window.SUBSET_BANK]); missions = shuffled.slice(0, 5); completedFlags = new Array(5).fill(false); index = 0; score = 0; allDone = false; errorCount = 0; selectedAnswer = null; }
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
        elements.submitBtn.disabled = (selectedAnswer === null);
        if (isCurrentCompleted()) elements.nextBtn.innerText = (index === missions.length-1) ? "🏁 完成挑戰 🎉" : "🌟 下一關 ➡️";
        if (done === missions.length && !allDone) { allDone = true; setTimeout(() => document.getElementById('subsetBasicModal').classList.add('active'), 400); }
    }
    function forceNewQuestion() {
        let newMission; do { newMission = shuffleArray([...window.SUBSET_BANK])[0]; } while (newMission.setA.name === getMission().setA.name && newMission.setB.name === getMission().setB.name);
        missions[index] = newMission;
        selectedAnswer = null; errorCount = 0; score = 0;
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
        if (selectedAnswer === mission.isSubset) {
            score += 10; incrementCorrect();
            completedFlags[index] = true; updateUI();
            showFeedback(`✅ 正確！ +10分`, false);
            elements.gameContainer.classList.add('game-complete');
        } else {
            errorCount++; incrementWrong(); updateUI();
            if (errorCount >= MAX_ERRORS) { showFeedback(`❌ 錯誤達${MAX_ERRORS}次，分數歸零換新題。`, true); forceNewQuestion(); }
            else { showFeedback(`❌ 答案不正確 (剩餘錯誤: ${MAX_ERRORS-errorCount})`, true); selectedAnswer = null; renderQuestion(); updateUI(); }
        }
    }
    function selectAnswer(val) { if (isCurrentCompleted() || allDone) return; selectedAnswer = val; renderQuestion(); elements.submitBtn.disabled = false; }
    function renderQuestion() {
        const mission = getMission();
        const renderSetItems = (items) => items.map(emoji => `<span style="font-size:1.8rem; margin:0 4px;">${emoji}</span>`).join('');
        elements.setADisplay.innerHTML = `<div style="font-size:1.2rem; font-weight:bold;">${mission.setA.name}</div><div>${renderSetItems(mission.setA.items)}</div>`;
        elements.setBDisplay.innerHTML = `<div style="font-size:1.2rem; font-weight:bold;">${mission.setB.name}</div><div>${renderSetItems(mission.setB.items)}</div>`;
        elements.questionText.innerHTML = `<strong>A ⊆ B</strong> 嗎？<br>即：「${mission.setA.name}」是否為「${mission.setB.name}」的子集？`;
        elements.yesBtn.classList.toggle('selected', selectedAnswer === true);
        elements.noBtn.classList.toggle('selected', selectedAnswer === false);
        if (isCurrentCompleted()) { elements.yesBtn.disabled = true; elements.noBtn.disabled = true; }
    }
    function nextMission() { if (!isCurrentCompleted()) { showFeedback(`⚠️ 請先完成當前關卡`, true); return; } if (index === missions.length-1) return; index++; selectedAnswer = null; errorCount = 0; renderQuestion(); updateUI(); elements.gameContainer.classList.remove('game-complete'); showFeedback(`🚀 進入下一題！`, false); }
    function resetFull() { if (timerInterval) clearInterval(timerInterval); init(); renderQuestion(); updateUI(); elements.gameContainer.classList.remove('game-complete'); showFeedback(`🎯 判斷 A 是否為 B 的子集`, false); timerInterval = startGameTimer(elements.timerDisplay, stopTimerCondition); }
    init();
    const container = document.createElement('div'); container.className = 'game-container';
    container.innerHTML = `<div class="status-bar"><div class="score-box"><span>🏆 總分</span> <span id="subScore">0</span></div><div class="progress-badge">✅ 進度 <span id="subProgress">0 / 0</span> <span id="subMissionCounter">第1關 / 共5關</span></div><div class="timer-badge" id="subTimer">⏱️ 00:00</div><div class="error-counter" id="subErrors">❌ 0/3</div></div><div class="mission-card"><div class="mission-title">📂 子集判斷</div><div class="sets-description" style="display: flex; gap: 20px; justify-content: center;"><div style="background:#ffe6c7; border-radius: 40px; padding: 12px 20px; min-width: 150px;" id="subSetA"></div><div style="background:#ffe6c7; border-radius: 40px; padding: 12px 20px; min-width: 150px;" id="subSetB"></div></div><div class="mission-desc" id="subQuestion" style="font-size: 1.3rem; margin-top: 15px;">❓ 判斷以下關係是否成立？</div><div class="buttons-panel" style="margin-top: 20px;"><button class="btn" id="subYesBtn">✅ 是，A ⊆ B</button><button class="btn" id="subNoBtn">❌ 否，A ⊄ B</button></div></div><div class="feedback-area" id="subFeedback"><span>🎯</span> 點選答案，再按「確定」</div><div class="buttons-panel"><button class="btn" id="subResetBtn">🔄 重新開始</button><button class="btn btn-primary" id="subSubmitBtn" disabled>✅ 確定</button><button class="btn btn-primary" id="subNextBtn" disabled>🌟 下一關 ➡️</button></div>`;
    elements = { totalScore: container.querySelector('#subScore'), progress: container.querySelector('#subProgress'), missionCounter: container.querySelector('#subMissionCounter'), setADisplay: container.querySelector('#subSetA'), setBDisplay: container.querySelector('#subSetB'), questionText: container.querySelector('#subQuestion'), feedback: container.querySelector('#subFeedback'), yesBtn: container.querySelector('#subYesBtn'), noBtn: container.querySelector('#subNoBtn'), nextBtn: container.querySelector('#subNextBtn'), resetBtn: container.querySelector('#subResetBtn'), submitBtn: container.querySelector('#subSubmitBtn'), gameContainer: container, timerDisplay: container.querySelector('#subTimer'), errorDisplay: container.querySelector('#subErrors') };
    elements.yesBtn.addEventListener('click', () => selectAnswer(true)); elements.noBtn.addEventListener('click', () => selectAnswer(false));
    elements.nextBtn.addEventListener('click', nextMission); elements.resetBtn.addEventListener('click', resetFull); elements.submitBtn.addEventListener('click', handleSubmit);
    resetFull(); renderQuestion(); updateUI();
    return container;
}

function createProperSubsetGame() {
    let missions = [], index = 0, score = 0, completedFlags = [], allDone = false, elements = {}, timerInterval = null;
    let errorCount = 0, selectedAnswer = null;
    function init() { let shuffled = shuffleArray([...window.PROPER_BANK]); missions = shuffled.slice(0, 5); completedFlags = new Array(5).fill(false); index = 0; score = 0; allDone = false; errorCount = 0; selectedAnswer = null; }
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
        elements.submitBtn.disabled = (selectedAnswer === null);
        if (isCurrentCompleted()) elements.nextBtn.innerText = (index === missions.length-1) ? "🏁 完成挑戰 🎉" : "🌟 下一關 ➡️";
        if (done === missions.length && !allDone) { allDone = true; setTimeout(() => document.getElementById('properSubsetModal').classList.add('active'), 400); }
    }
    function forceNewQuestion() {
        let newMission; do { newMission = shuffleArray([...window.PROPER_BANK])[0]; } while (newMission.setA.name === getMission().setA.name && newMission.setB.name === getMission().setB.name);
        missions[index] = newMission;
        selectedAnswer = null; errorCount = 0; score = 0;
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
        if (selectedAnswer === mission.isProper) {
            score += 10; incrementCorrect();
            completedFlags[index] = true; updateUI();
            showFeedback(`✅ 正確！ +10分`, false);
            elements.gameContainer.classList.add('game-complete');
        } else {
            errorCount++; incrementWrong(); updateUI();
            if (errorCount >= MAX_ERRORS) { showFeedback(`❌ 錯誤達${MAX_ERRORS}次，分數歸零換新題。`, true); forceNewQuestion(); }
            else { showFeedback(`❌ 答案不正確 (剩餘錯誤: ${MAX_ERRORS-errorCount})`, true); selectedAnswer = null; renderQuestion(); updateUI(); }
        }
    }
    function selectAnswer(val) { if (isCurrentCompleted() || allDone) return; selectedAnswer = val; renderQuestion(); elements.submitBtn.disabled = false; }
    function renderQuestion() {
        const mission = getMission();
        const renderSetItems = (items) => items.map(emoji => `<span style="font-size:1.8rem; margin:0 4px;">${emoji}</span>`).join('');
        elements.setADisplay.innerHTML = `<div style="font-size:1.2rem; font-weight:bold;">${mission.setA.name}</div><div>${renderSetItems(mission.setA.items)}</div>`;
        elements.setBDisplay.innerHTML = `<div style="font-size:1.2rem; font-weight:bold;">${mission.setB.name}</div><div>${renderSetItems(mission.setB.items)}</div>`;
        elements.questionText.innerHTML = `<strong>A ⊂ B</strong> 嗎？<br>即：「${mission.setA.name}」是否為「${mission.setB.name}」的<strong>真子集</strong>？<br><span style="font-size:0.9rem;">(真子集 = A ⊆ B 且 A ≠ B)</span>`;
        elements.yesBtn.classList.toggle('selected', selectedAnswer === true);
        elements.noBtn.classList.toggle('selected', selectedAnswer === false);
        if (isCurrentCompleted()) { elements.yesBtn.disabled = true; elements.noBtn.disabled = true; }
    }
    function nextMission() { if (!isCurrentCompleted()) { showFeedback(`⚠️ 請先完成當前關卡`, true); return; } if (index === missions.length-1) return; index++; selectedAnswer = null; errorCount = 0; renderQuestion(); updateUI(); elements.gameContainer.classList.remove('game-complete'); showFeedback(`🚀 進入下一題！`, false); }
    function resetFull() { if (timerInterval) clearInterval(timerInterval); init(); renderQuestion(); updateUI(); elements.gameContainer.classList.remove('game-complete'); showFeedback(`🎯 判斷 A 是否為 B 的真子集`, false); timerInterval = startGameTimer(elements.timerDisplay, stopTimerCondition); }
    init();
    const container = document.createElement('div'); container.className = 'game-container';
    container.innerHTML = `<div class="status-bar"><div class="score-box"><span>🏆 總分</span> <span id="propScore">0</span></div><div class="progress-badge">✅ 進度 <span id="propProgress">0 / 0</span> <span id="propMissionCounter">第1關 / 共5關</span></div><div class="timer-badge" id="propTimer">⏱️ 00:00</div><div class="error-counter" id="propErrors">❌ 0/3</div></div><div class="mission-card"><div class="mission-title">📂 真子集分辨</div><div class="sets-description" style="display: flex; gap: 20px; justify-content: center;"><div style="background:#ffe6c7; border-radius: 40px; padding: 12px 20px; min-width: 150px;" id="propSetA"></div><div style="background:#ffe6c7; border-radius: 40px; padding: 12px 20px; min-width: 150px;" id="propSetB"></div></div><div class="mission-desc" id="propQuestion" style="font-size: 1.3rem; margin-top: 15px;">❓ 判斷以下關係是否成立？</div><div class="buttons-panel" style="margin-top: 20px;"><button class="btn" id="propYesBtn">✅ 是，A ⊂ B</button><button class="btn" id="propNoBtn">❌ 否，A ⊄ B</button></div></div><div class="feedback-area" id="propFeedback"><span>🎯</span> 點選答案，再按「確定」</div><div class="buttons-panel"><button class="btn" id="propResetBtn">🔄 重新開始</button><button class="btn btn-primary" id="propSubmitBtn" disabled>✅ 確定</button><button class="btn btn-primary" id="propNextBtn" disabled>🌟 下一關 ➡️</button></div>`;
    elements = { totalScore: container.querySelector('#propScore'), progress: container.querySelector('#propProgress'), missionCounter: container.querySelector('#propMissionCounter'), setADisplay: container.querySelector('#propSetA'), setBDisplay: container.querySelector('#propSetB'), questionText: container.querySelector('#propQuestion'), feedback: container.querySelector('#propFeedback'), yesBtn: container.querySelector('#propYesBtn'), noBtn: container.querySelector('#propNoBtn'), nextBtn: container.querySelector('#propNextBtn'), resetBtn: container.querySelector('#propResetBtn'), submitBtn: container.querySelector('#propSubmitBtn'), gameContainer: container, timerDisplay: container.querySelector('#propTimer'), errorDisplay: container.querySelector('#propErrors') };
    elements.yesBtn.addEventListener('click', () => selectAnswer(true)); elements.noBtn.addEventListener('click', () => selectAnswer(false));
    elements.nextBtn.addEventListener('click', nextMission); elements.resetBtn.addEventListener('click', resetFull); elements.submitBtn.addEventListener('click', handleSubmit);
    resetFull(); renderQuestion(); updateUI();
    return container;
}