import { shuffleArray, startGameTimer, MAX_ERRORS } from '../utils/helpers.js';
import { incrementCorrect, incrementWrong } from '../core/leaderboard.js';
import { startSectionTimer } from '../core/router.js';

export function renderSectionDifference() {
    const div = document.createElement('div'); div.className = 'section-card';
    div.innerHTML = `<div class="concept-area"><div class="concept-title">🌍 全集 (Universal Set) 與 差集 (Difference)</div><div class="concept-def">✨ <strong>全集 U</strong>：所有討論對象。</div><div class="concept-def">✨ <strong>差集 A - B</strong>：在 A 但不在 B 的元素。</div><div class="example-box">🌟 例如：U={水果}, A={紅色物品}, B={水果} → A-B={紅色非水果}。</div></div>`;
    const startBtn = document.createElement('button'); startBtn.className = 'start-game-btn'; startBtn.innerText = '🎮 開始挑戰';
    const wrapper = document.createElement('div'); wrapper.className = 'game-wrapper';
    startBtn.addEventListener('click', () => {
        startSectionTimer();
        if (!wrapper.children.length) wrapper.appendChild(createDifferenceGame());
        wrapper.classList.add('active-game');
        startBtn.style.display = 'none';
    });
    div.appendChild(startBtn); div.appendChild(wrapper);
    return div;
}

function createDifferenceGame() {
    let missions = [], currentIndex = 0, totalScore = 0, selectedIndices = [], missionCompleted = false, allDone = false, elements = {}, timerInterval = null;
    let errorCount = 0;
    function init() { let shuffled = shuffleArray([...window.DIFFERENCE_BANK]); missions = shuffled.slice(0, 5); currentIndex = 0; totalScore = 0; selectedIndices = []; missionCompleted = false; allDone = false; errorCount = 0; }
    function getCurrentMission() { return missions[currentIndex]; }
    function getTotalCorrect() { return getCurrentMission().diffItems.length; }
    function stopTimerCondition() { return allDone; }
    function updateUI() {
        elements.totalScore.innerText = totalScore;
        elements.progress.innerText = `${selectedIndices.length} / ${getTotalCorrect()}`;
        elements.missionCounter.innerText = `第${currentIndex+1}關 / 共${missions.length}關`;
        elements.errorDisplay.innerText = `❌ ${errorCount}/${MAX_ERRORS}`;
        elements.nextBtn.disabled = !missionCompleted;
        elements.submitBtn.disabled = (selectedIndices.length === 0);
        if (missionCompleted) elements.nextBtn.innerText = (currentIndex === missions.length-1) ? "🏁 完成挑戰 🎉" : "🌟 下一關 ➡️";
    }
    function forceNewQuestion() {
        let newMission; do { newMission = shuffleArray([...window.DIFFERENCE_BANK])[0]; } while (newMission.U === getCurrentMission().U);
        missions[currentIndex] = newMission;
        selectedIndices = []; missionCompleted = false; errorCount = 0; totalScore = 0;
        elements.gameContainer.classList.remove('game-complete');
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = startGameTimer(elements.timerDisplay, stopTimerCondition);
        renderItems(); updateMissionDisplay(); updateUI();
        showFeedback(`⚠️ 錯誤次數過多，分數歸零並更換新題目！`, false);
    }
    function showFeedback(msg, isErr=false) { elements.feedback.innerHTML = `<span>${isErr ? '❌' : '💡'}</span> ${msg}`; }
    function checkComplete() { if (selectedIndices.length === getTotalCorrect() && !missionCompleted) { missionCompleted = true; showFeedback(`🎉 完成差集挑戰！`, false); elements.gameContainer.classList.add('game-complete'); updateUI(); if (currentIndex === missions.length-1 && !allDone) { allDone = true; setTimeout(() => document.getElementById('differenceCompleteModal').classList.add('active'), 400); } } }
    function handleSubmit() {
        if (missionCompleted || allDone) return;
        const mission = getCurrentMission();
        const correctIndices = mission.A.items.reduce((arr, emoji, idx) => mission.diffItems.includes(emoji) ? arr.concat(idx) : arr, []);
        const isCorrect = selectedIndices.length === correctIndices.length && selectedIndices.every(idx => correctIndices.includes(idx));
        if (isCorrect) {
            totalScore += 10; incrementCorrect();
            showFeedback(`✅ 正確！ +10分`, false);
            missionCompleted = true; elements.gameContainer.classList.add('game-complete');
            updateUI(); checkComplete();
        } else {
            errorCount++; incrementWrong(); updateUI();
            if (errorCount >= MAX_ERRORS) { showFeedback(`❌ 答錯了！已達 ${MAX_ERRORS} 次錯誤。`, true); forceNewQuestion(); }
            else { showFeedback(`❌ 答案不正確，再試試看 (剩餘錯誤: ${MAX_ERRORS - errorCount})`, true); selectedIndices = []; renderItems(); updateUI(); }
        }
    }
    function toggleSelect(idx) { if (missionCompleted || allDone) return; if (selectedIndices.includes(idx)) selectedIndices = selectedIndices.filter(i => i !== idx); else selectedIndices.push(idx); renderItems(); elements.submitBtn.disabled = (selectedIndices.length === 0); }
    function renderItems() { const mission = getCurrentMission(); elements.grid.innerHTML = ''; mission.A.items.forEach((emoji, idx) => { const card = document.createElement('div'); card.className = 'item-card' + (selectedIndices.includes(idx) ? ' selected' : ''); card.innerHTML = `<div class="item-emoji">${emoji}</div><div class="item-name">${window.nameMapDiff[emoji] || emoji}</div>`; card.addEventListener('click', () => toggleSelect(idx)); elements.grid.appendChild(card); }); }
    function resetGame(keepScore=false) { if (timerInterval) clearInterval(timerInterval); selectedIndices = []; missionCompleted = false; errorCount = 0; if (!keepScore) totalScore = 0; elements.gameContainer.classList.remove('game-complete'); updateUI(); renderItems(); elements.feedback.innerHTML = `<span>🎯</span> 點擊物品選擇，再按「確定」提交。`; timerInterval = startGameTimer(elements.timerDisplay, stopTimerCondition); }
    function nextMission() { if (!missionCompleted) { showFeedback(`⚠️ 請先完成當前關卡`, true); return; } if (currentIndex === missions.length-1) return; currentIndex++; resetGame(false); updateMissionDisplay(); renderItems(); updateUI(); showFeedback(`🚀 進入下一題！`, false); }
    function updateMissionDisplay() { const m = getCurrentMission(); elements.missionTitle.innerText = `🌍 差集挑戰 (A - B)`; elements.uniDesc.innerText = `全集 U = { ${m.U} }`; elements.setADesc.innerText = `${m.A.emoji} 集合A：${m.A.name}`; elements.setBDesc.innerText = `${m.B.emoji} 集合B：${m.B.name}`; }
    function resetFull() { if (timerInterval) clearInterval(timerInterval); init(); resetGame(true); updateMissionDisplay(); renderItems(); updateUI(); showFeedback(`🔄 遊戲已重置！`, false); }
    init();
    const container = document.createElement('div'); container.className = 'game-container';
    container.innerHTML = `<div class="status-bar"><div class="score-box"><span>🏆 總分</span> <span id="diffScore">0</span></div><div class="progress-badge">✅ 進度 <span id="diffProgress">0 / 0</span> <span id="diffMissionCounter">第1關 / 共5關</span></div><div class="timer-badge" id="diffTimer">⏱️ 00:00</div><div class="error-counter" id="diffErrors">❌ 0/3</div></div><div class="mission-card"><div class="mission-title" id="diffTitle">🌍 差集挑戰</div><div class="sets-description"><div class="set-badge" id="diffUni">全集 U</div><div class="set-badge" id="diffSetA">集合A</div><div class="set-badge" id="diffSetB">集合B</div></div><div class="mission-desc">🌟 點擊選擇屬於 A 但不屬於 B 的物品</div></div><div class="items-grid" id="diffGrid"></div><div class="feedback-area" id="diffFeedback"><span>🎯</span> 點擊物品選擇，再按「確定」提交。</div><div class="buttons-panel"><button class="btn" id="diffResetBtn">🔄 重新開始</button><button class="btn btn-primary" id="diffSubmitBtn" disabled>✅ 確定</button><button class="btn btn-primary" id="diffNextBtn" disabled>🌟 下一關 ➡️</button></div>`;
    elements = { totalScore: container.querySelector('#diffScore'), progress: container.querySelector('#diffProgress'), missionCounter: container.querySelector('#diffMissionCounter'), missionTitle: container.querySelector('#diffTitle'), uniDesc: container.querySelector('#diffUni'), setADesc: container.querySelector('#diffSetA'), setBDesc: container.querySelector('#diffSetB'), grid: container.querySelector('#diffGrid'), feedback: container.querySelector('#diffFeedback'), nextBtn: container.querySelector('#diffNextBtn'), resetBtn: container.querySelector('#diffResetBtn'), submitBtn: container.querySelector('#diffSubmitBtn'), gameContainer: container, timerDisplay: container.querySelector('#diffTimer'), errorDisplay: container.querySelector('#diffErrors') };
    elements.nextBtn.addEventListener('click', nextMission); elements.resetBtn.addEventListener('click', resetFull); elements.submitBtn.addEventListener('click', handleSubmit);
    resetGame(true); updateMissionDisplay(); renderItems(); updateUI();
    return container;
}