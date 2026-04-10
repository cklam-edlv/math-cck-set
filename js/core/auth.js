import { rdb } from '../config/firebase.js';
import { formatTime } from '../utils/helpers.js';
import { switchSection } from './router.js';

export let currentUser = "";
export let sessionStart = null;
export let myTotalMs = 0;
export let sessionTimerInterval = null;
export let totalMsInterval = null;

export function updateUserDisplay() {
    document.getElementById('header-username').innerText = currentUser || '未登入';
    document.getElementById('display-username-side').innerText = currentUser ? `👤 ${currentUser}` : '👤 未登入';
    document.getElementById('logout-btn').style.display = currentUser ? 'flex' : 'none';
}

export async function startLogin() {
    const name = document.getElementById('login-name').value.trim();
    if (!name) return alert("請輸入姓名");
    currentUser = name;
    updateUserDisplay();

    const userRef = rdb.ref(rdb.db, 'users/' + currentUser);
    const snapshot = await rdb.get(userRef);
    if (snapshot.exists()) {
        myTotalMs = snapshot.val().totalMs || 0;
    } else {
        await rdb.set(userRef, { totalMs: 0, lastActive: Date.now() });
    }

    sessionStart = Date.now();
    if (sessionTimerInterval) clearInterval(sessionTimerInterval);
    sessionTimerInterval = setInterval(() => {
        if (sessionStart) {
            document.getElementById('session-timer').innerText = `⏳ 本次學習: ${formatTime(Date.now() - sessionStart)}`;
        }
    }, 1000);

    if (totalMsInterval) clearInterval(totalMsInterval);
    totalMsInterval = setInterval(() => {
        if (!currentUser) return;
        myTotalMs += 10000;
        rdb.update(rdb.ref(rdb.db, 'users/' + currentUser), { totalMs: myTotalMs, lastActive: Date.now() });
    }, 10000);

    document.getElementById('login-modal').classList.remove('active');
    switchSection('basic');
}

export function handleLogout() {
    if (confirm('確定要登出嗎？您的學習進度已儲存。')) {
        if (sessionTimerInterval) clearInterval(sessionTimerInterval);
        if (totalMsInterval) clearInterval(totalMsInterval);
        currentUser = "";
        sessionStart = null;
        updateUserDisplay();
        document.getElementById('login-modal').classList.add('active');
        document.getElementById('session-timer').innerText = '⏳ 本次學習: 00:00';
        document.getElementById('contentArea').innerHTML = '';
    }
}