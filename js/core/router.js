import { currentUser } from './auth.js';
import { resetGameStats, fetchLeaderboard, setCurrentSectionId } from './leaderboard.js';
import { renderSectionBasic, renderSectionNotation, renderSectionIntersection, renderSectionUnion, renderSectionSubset, renderSectionDifference } from '../games/index.js';

export let sectionTimerStart = null;

export function startSectionTimer() {
    if (currentUser) sectionTimerStart = Date.now();
}

export function getSectionDuration() {
    return sectionTimerStart ? Date.now() - sectionTimerStart : 0;
}

export function switchSection(section) {
    if (!currentUser) return;
    setCurrentSectionId(section);
    startSectionTimer();
    resetGameStats();
    fetchLeaderboard();

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.closest('.nav-item')?.dataset.section === section);
    });

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = '';
    let card = null;
    if (section === 'basic') card = renderSectionBasic();
    else if (section === 'notation') card = renderSectionNotation();
    else if (section === 'intersection') card = renderSectionIntersection();
    else if (section === 'union') card = renderSectionUnion();
    else if (section === 'subset') card = renderSectionSubset();
    else if (section === 'difference') card = renderSectionDifference();
    if (card) contentArea.appendChild(card);
}

export function initNavigation() {
    const navMenu = document.getElementById('nav-menu');
    const sections = [
        { id: 'basic', icon: '📦', label: '1. 基礎集合概念' },
        { id: 'notation', icon: '📝', label: '2. 列舉法與描述法' },
        { id: 'intersection', icon: '🔗', label: '3. 交集' },
        { id: 'union', icon: '🧩', label: '4. 併集' },
        { id: 'subset', icon: '📂', label: '5. 子集 & 真子集' },
        { id: 'difference', icon: '🌍', label: '6. 全集 & 差集' }
    ];
    navMenu.innerHTML = sections.map(s => `
        <li class="nav-item" data-section="${s.id}">
            <div class="nav-link"><span class="nav-icon">${s.icon}</span> <span>${s.label}</span></div>
        </li>
    `).join('');

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => switchSection(item.dataset.section));
    });
}

export function toggleSidebar() {
    document.getElementById('left-sidebar').classList.toggle('collapsed');
}