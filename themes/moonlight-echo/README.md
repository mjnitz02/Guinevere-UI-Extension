# Moonlight Echo

A lightweight SillyTavern theme inspired by the Echo chat style from [Moonlit Echoes](https://github.com/RivelleDays/SillyTavern-MoonlitEchoesTheme) by Rivelle (AGPL-3.0).

## What it does

- Applies the **Echo** chat layout — character avatars are displayed as a gradient-masked background panel inside each message bubble
- Compact top navigation bar
- Full-width character/settings panels
- Larger portrait-ratio (2:3) character thumbnails in the character selector
- Character avatar shadows on recent chat entries on the welcome screen
- Expanded chat area height in Visual Novel (waifu) mode
- Hides the default assistant welcome message

## Customization

The variables at the top of `style.css` are the main knobs:

| Variable | Default | Description |
|----------|---------|-------------|
| `--custom-EchoAvatarWidth` | `25%` | Width of the avatar panel inside each message bubble |
| `--custom-EchoAvatarHeight` | `400px` | Height of the avatar panel (desktop) |
| `--custom-EchoAvatarMobileWidth` | `25%` | Avatar panel width on mobile |
| `--custom-EchoAvatarMobileHeight` | `250px` | Avatar panel height on mobile |
| `--custom-RecentChatAvatarYPosition` | `25%` | Vertical position of the avatar image in the recent chat shadow (0% = top, 100% = bottom; lower values show faces) |
| `--VN-sheld-height` | `50dvh` | Chat area height in Visual Novel mode |

## How the avatar injection works

SillyTavern does not set avatar URLs as CSS custom properties on message elements. `code.js` uses a `MutationObserver` to watch the chat container and injects `--mes-avatar-url` and `--mes-avatar-original-url` onto each `.mes` element so the CSS `::before` pseudo-elements can reference them.

A second observer watches the welcome screen's `.recentChatList` and injects `--chat-avatar-url` onto each `.recentChat` entry for the avatar shadow effect. The observer reconnects automatically if SillyTavern replaces the list element (e.g. after pinning or deleting a chat).
