import { shuffleArray, startGameTimer, MAX_ERRORS } from '../utils/helpers.js';
import { incrementCorrect, incrementWrong } from '../core/leaderboard.js';
import { startSectionTimer } from '../core/router.js';

export function renderSectionIntersection() {
    const div = document.createElement('div'); div.className = 'section-card';
    div.innerHTML = `<div class="concept-area"><div class="concept-title">🔗 交集 (Intersection)</div><div class="concept-def">✨ <strong>交集</strong>：共同擁有的元素，記作 A ∩ B。</div><div class="example-box">🌟 例如：A={紅色}, B={水果} → 交集={紅色水果}。</div></div>`;
    const startBtn = document.createElement('button'); startBtn.className = 'start-game-btn'; startBtn.innerText = '🎮 開始挑戰';
    const wrapper = document.createElement('div'); wrapper.className = 'game-wrapper';
    startBtn.addEventListener('click', () => {
        startSectionTimer();
        if (!wrapper.children.length) wrapper.appendChild(createIntersectionGame());
        wrapper.classList.add('active-game');
        startBtn.style.display = 'none';
    });
    div.appendChild(startBtn); div.appendChild(wrapper);
    return div;
}

function createIntersectionGame() {
    let missions = [], index = 0, score = 0, completedFlags = [], allDone = false, elements = {}, timerInterval = null;
    let errorCount = 0, selectedIndices = new Set();
    function init() { let shuffled = shuffleArray([...window.INTER_BANK]); missions = shuffled.slice(0, 5); completedFlags = new Array(5).fill(false); index = 0; score = 0; allDone = false; errorCount = 0; selectedIndices.clear(); }
    function getMission() { return missions[index]; }
    function getTotalCorrect() { return getMission().items.filter(i => i.inA && i.inB).length; }
    function isCurrentCompleted() { return completedFlags[index]; }
    function stopTimerCondition() { return allDone; }
    function updateUI() {
        elements.totalScore.innerText = score;
        let done = completedFlags.filter(v=>v).length;
        elements.progress.innerText = `${done} / ${missions.length}`;
        elements.missionCounter.innerText = `第${index+1}關 / 共${missions.length}關`;
        elements.errorDisplay.innerText = `❌ ${errorCount}/${MAX_ERRORS}`;
        elements.nextBtn.disabled = !isCurrentCompleted();
        elements.submitBtn.disabled = (selectedIndices.size === 0);
        if (isCurrentCompleted()) elements.nextBtn.innerText = (index === missions.length-1) ? "🏁 完成挑戰 🎉" : "🌟 下一關 ➡️";
        if (done === missions.length && !allDone) { allDone = true; setTimeout(() => document.getElementById('intersectionCompleteModal').classList.add('active'), 400); }
    }
    function forceNewQuestion() {
        let newMission; do { newMission = shuffleArray([...window.INTER_BANK])[0]; } while (newMission.setA === getMission().setA && newMission.setB === getMission().setB);
        missions[index] = newMission;
        selectedIndices.clear(); errorCount = 0; score = 0;
        elements.gameContainer.classList.remove('game-complete');
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = startGameTimer(elements.timerDisplay, stopTimerCondition);
        renderItems(); updateMissionDisplay(); updateUI();
        showFeedback(`⚠️ 錯誤次數過多，分數歸零並更換新題目！`, false);
    }
    function showFeedback(msg, isErr=false) { elements.feedback.innerHTML = `<span>${isErr ? '❌' : '💡'}</span> ${msg}`; }
    function handleSubmit() {
        if (isCurrentCompleted() || allDone) return;
        const mission = getMission();
        const correctIndices = mission.items.reduce((arr, item, idx) => (item.inA && item.inB) ? arr.concat(idx) : arr, []);
        const selectedArr = Array.from(selectedIndices);
        const isCorrect = selectedArr.length === correctIndices.length && selectedArr.every(idx => correctIndices.includes(idx));
        if (isCorrect) {
            score += 10; incrementCorrect();
            completedFlags[index] = true; updateUI();
            showFeedback(`✅ 正確！ +10分`, false);
            elements.gameContainer.classList.add('game-complete');
        } else {
            errorCount++; incrementWrong(); updateUI();
            if (errorCount >= MAX_ERRORS) { showFeedback(`❌ 錯誤達${MAX_ERRORS}次，分數歸零換新題。`, true); forceNewQuestion(); }
            else { showFeedback(`❌ 答案不正確 (剩餘錯誤: ${MAX_ERRORS-errorCount})`, true); selectedIndices.clear(); renderItems(); updateUI(); }
        }
    }
    function toggleSelect(idx) { if (isCurrentCompleted() || allDone) return; if (selectedIndices.has(idx)) selectedIndices.delete(idx); else selectedIndices.add(idx); renderItems(); elements.submitBtn.disabled = (selectedIndices.size === 0); }
    function renderItems() { const mission = getMission(); elements.grid.innerHTML = ''; mission.items.forEach((item, idx) => { const card = document.createElement('div'); card.className = 'item-card' + (selectedIndices.has(idx) ? ' selected' : ''); card.setAttribute('data-idx', idx); card.innerHTML = `<div class="item-emoji">${item.emoji}</div><div class="item-name">${item.name}</div>`; if (!isCurrentCompleted()) card.addEventListener('click', () => toggleSelect(idx)); elements.grid.appendChild(card); }); }
    function nextMission() { if (!isCurrentCompleted()) { showFeedback(`⚠️ 請先完成當前關卡`, true); return; } if (index === missions.length-1) return; index++; selectedIndices.clear(); errorCount=0; renderItems(); updateMissionDisplay(); updateUI(); elements.gameContainer.classList.remove('game-complete'); showFeedback(`🚀 進入下一題！`, false); }
    function updateMissionDisplay() { const m = getMission(); elements.setADesc.innerText = `${m.setAemoji} 集合A：${m.setA}`; elements.setBDesc.innerText = `${m.setBemoji} 集合B：${m.setB}`; }
    function resetFull() { if (timerInterval) clearInterval(timerInterval); init(); renderItems(); updateMissionDisplay(); updateUI(); elements.gameContainer.classList.remove('game-complete'); showFeedback(`🎯 點擊選擇，再按確定`, false); timerInterval = startGameTimer(elements.timerDisplay, stopTimerCondition); }
    init();
    const container = document.createElement('div'); container.className = 'game-container';
    container.innerHTML = `<div class="status-bar"><div class="score-box"><span>🏆 總分</span> <span id="interScore">0</span></div><div class="progress-badge">✅ 進度 <span id="interProgress">0 / 0</span> <span id="interMissionCounter">第1關 / 共5關</span></div><div class="timer-badge" id="interTimer">⏱️ 00:00</div><div class="error-counter" id="interErrors">❌ 0/3</div></div><div class="mission-card"><div class="mission-title">🔗 交集挑戰</div><div class="sets-description"><div class="set-badge" id="interSetA">集合A</div><div class="set-badge" id="interSetB">集合B</div></div><div class="mission-desc">🌟 點擊選擇交集物品，再按確定</div></div><div class="items-grid" id="interGrid"></div><div class="feedback-area" id="interFeedback"><span>🎯</span> 點擊選擇，再按「確定」提交</div><div class="buttons-panel"><button class="btn" id="interResetBtn">🔄 重新開始</button><button class="btn btn-primary" id="interSubmitBtn" disabled>✅ 確定</button><button class="btn btn-primary" id="interNextBtn" disabled>🌟 下一關 ➡️</button></div>`;
    elements = { totalScore: container.querySelector('#interScore'), progress: container.querySelector('#interProgress'), missionCounter: container.querySelector('#interMissionCounter'), setADesc: container.querySelector('#interSetA'), setBDesc: container.querySelector('#interSetB'), grid: container.querySelector('#interGrid'), feedback: container.querySelector('#interFeedback'), nextBtn: container.querySelector('#interNextBtn'), resetBtn: container.querySelector('#interResetBtn'), submitBtn: container.querySelector('#interSubmitBtn'), gameContainer: container, timerDisplay: container.querySelector('#interTimer'), errorDisplay: container.querySelector('#interErrors') };
    elements.nextBtn.addEventListener('click', nextMission); elements.resetBtn.addEventListener('click', resetFull); elements.submitBtn.addEventListener('click', handleSubmit);
    resetFull(); updateMissionDisplay(); renderItems(); updateUI();
    return container;
}