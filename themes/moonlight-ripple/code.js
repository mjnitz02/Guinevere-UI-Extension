/**
 * Moonlight Light Theme
 * Applies the Ripple chat style from Moonlit Echoes by Rivelle (AGPL-3.0).
 *
 * Adds `body.ripplestyle` so the CSS selectors match. The Ripple style itself
 * uses SillyTavern's native .avatar img, so per-message avatar-url injection
 * is not required for messages — but we keep it for parity with the Echo theme
 * and for the .recentChat avatar shadow on the welcome screen.
 */

let avatarObserver = null;
let recentChatObserver = null;
let welcomePanelWatcher = null;

function stripOrigin(url) {
    if (!url) return '';
    return url.startsWith(window.location.origin)
        ? url.replace(window.location.origin, '')
        : url;
}

function getAvatarSources(src) {
    if (!src) return { thumb: null, original: null };

    const normalized = stripOrigin(src);
    const trimmed = normalized.startsWith('/') ? normalized.slice(1) : normalized;

    let type = null;
    let file = null;

    try {
        const parsed = new URL(normalized, window.location.origin);
        if (parsed.pathname.endsWith('thumbnail')) {
            type = parsed.searchParams.get('type');
            const rawFile = parsed.searchParams.get('file');
            file = rawFile ? decodeURIComponent(rawFile) : null;
        }
    } catch (_) {}

    if (!type) {
        if (trimmed.startsWith('characters/')) {
            type = 'avatar';
            file = trimmed.replace(/^characters\//, '');
        } else if (trimmed.startsWith('User Avatars/')) {
            type = 'persona';
            file = trimmed.replace(/^User Avatars\//, '');
        }
    }

    const abs = (p) => (p ? (p.startsWith('/') ? p : `/${p}`) : '');

    const thumb =
        type === 'avatar' || type === 'persona'
            ? `/thumbnail?type=${type}&file=${encodeURIComponent(file)}`
            : abs(trimmed);

    const original =
        type === 'avatar'
            ? abs(`characters/${file}`)
            : type === 'persona'
            ? abs(`User Avatars/${file}`)
            : abs(trimmed);

    return {
        thumb: stripOrigin(thumb),
        original: stripOrigin(original),
    };
}

function injectRecentChatVars() {
    document.querySelectorAll('.recentChat').forEach((chat) => {
        const img = chat.querySelector('.avatar img');
        if (!img) return;

        const src = img.getAttribute('src') || img.getAttribute('data-src');
        const { thumb } = getAvatarSources(src);
        if (!thumb) return;

        chat.style.setProperty('--chat-avatar-url', `url('${thumb}')`);
    });
}

function startRecentChatObserver() {
    // Always reconnect — the list element may have been replaced by a re-render.
    if (recentChatObserver) {
        recentChatObserver.disconnect();
        recentChatObserver = null;
    }

    const list = document.querySelector('.recentChatList');
    if (!list) return;

    injectRecentChatVars();

    let debounce;
    recentChatObserver = new MutationObserver(() => {
        clearTimeout(debounce);
        debounce = setTimeout(injectRecentChatVars, 100);
    });
    recentChatObserver.observe(list, { childList: true, subtree: true });
}

function injectAvatarVars() {
    document.querySelectorAll('.mes').forEach((mes) => {
        const avatarImg = mes.querySelector('.avatar img');
        if (!avatarImg) return;

        const src = avatarImg.getAttribute('src') || avatarImg.getAttribute('data-src');
        const { thumb, original } = getAvatarSources(src);
        if (!thumb && !original) return;

        const thumbUrl = thumb || original;
        const originalUrl = original || thumbUrl;

        mes.style.setProperty('--mes-avatar-thumb-url', `url('${thumbUrl}')`);
        mes.style.setProperty('--mes-avatar-original-url', `url('${originalUrl}')`);
        mes.style.setProperty('--mes-avatar-url', `url('${thumbUrl}')`);
    });
}

export async function execute() {
    document.body.classList.add('ripplestyle');

    injectAvatarVars();

    const chatContainer = document.getElementById('chat');
    if (chatContainer) {
        let debounce;
        avatarObserver = new MutationObserver(() => {
            clearTimeout(debounce);
            debounce = setTimeout(injectAvatarVars, 100);
        });
        avatarObserver.observe(chatContainer, { childList: true, subtree: true });
    }

    // Start immediately if the welcome panel is already in the DOM.
    startRecentChatObserver();

    // Keep a persistent watcher on #chat so that if SillyTavern replaces the
    // .recentChatList element entirely (e.g. after pin/delete/show-more), we
    // reconnect to the new node and re-inject the avatar vars.
    const chatEl = document.getElementById('chat');
    if (chatEl) {
        let watcherDebounce;
        welcomePanelWatcher = new MutationObserver(() => {
            clearTimeout(watcherDebounce);
            watcherDebounce = setTimeout(() => {
                if (document.querySelector('.recentChatList')) {
                    startRecentChatObserver();
                }
            }, 150);
        });
        welcomePanelWatcher.observe(chatEl, { childList: true, subtree: true });
    }
}

export function disable() {
    document.body.classList.remove('ripplestyle');

    if (avatarObserver) {
        avatarObserver.disconnect();
        avatarObserver = null;
    }

    if (recentChatObserver) {
        recentChatObserver.disconnect();
        recentChatObserver = null;
    }

    if (welcomePanelWatcher) {
        welcomePanelWatcher.disconnect();
        welcomePanelWatcher = null;
    }

    document.querySelectorAll('.mes').forEach((mes) => {
        mes.style.removeProperty('--mes-avatar-thumb-url');
        mes.style.removeProperty('--mes-avatar-original-url');
        mes.style.removeProperty('--mes-avatar-url');
    });

    document.querySelectorAll('.recentChat').forEach((chat) => {
        chat.style.removeProperty('--chat-avatar-url');
    });
}
