// ===== Portfolio tab bar (Projects / Job Experience / Teams) =====
// The sliding underline (.tab-ink) is positioned in JS because it has to
// follow whichever tab is active, at any viewport width or font metric.

function showTab(name) {
    document.querySelectorAll('.tab-panel').forEach(function (panel) {
        panel.hidden = panel.id !== 'tab-panel-' + name;
    });
    document.querySelectorAll('.tab-link').forEach(function (btn) {
        var active = btn.id === 'tab-btn-' + name;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    positionTabInk();
}

function positionTabInk() {
    var bar = document.querySelector('.tab-bar');
    var ink = document.querySelector('.tab-ink');
    var active = document.querySelector('.tab-link.active');
    if (!bar || !ink || !active) return;
    var barRect = bar.getBoundingClientRect();
    var btnRect = active.getBoundingClientRect();
    ink.style.left = (btnRect.left - barRect.left) + 'px';
    ink.style.width = btnRect.width + 'px';
}

// Team cards: long stories start clamped; the toggle unfolds them.
function toggleTeam(btn) {
    var card = btn.closest('.team-card');
    var open = card.classList.toggle('team-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.querySelector('.team-toggle-label').textContent = open ? 'Show less' : 'Read the full story';
}

// Fonts loading in can shift the label widths, so re-measure after load too.
document.addEventListener('DOMContentLoaded', positionTabInk);
window.addEventListener('load', positionTabInk);
window.addEventListener('resize', positionTabInk);
