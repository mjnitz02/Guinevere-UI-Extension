# Moonlight Ripple

A lightweight SillyTavern theme inspired by the Ripple chat style from [Moonlit Echoes](https://github.com/RivelleDays/SillyTavern-MoonlitEchoesTheme) by Rivelle (AGPL-3.0).

## What it does

- Applies the **Ripple** chat layout — tall portrait-ratio avatar on the left of each message bubble with a soft gradient fade, and a divider under the character name
- Compact top navigation bar
- Full-width character/settings panels
- Larger portrait-ratio (2:3) character thumbnails in the character selector
- Character avatar shadows on recent chat entries on the welcome screen
- Expanded chat area height in Visual Novel (waifu) mode
- Hides the default assistant welcome message

Activate by enabling the `ripplestyle` chat style in SillyTavern (User Settings → Chat Display).

## Customization

The variables at the top of `style.css` are the main knobs:

| Variable | Default | Description |
|----------|---------|-------------|
| `--customRippleAvatarWidth` | `180px` | Ripple avatar column width (desktop) |
| `--customRippleAvatarMobileWidth` | `100px` | Ripple avatar column width (mobile) |
| `--customRippleAvatarRatio` | `1.5` | Avatar height-to-width ratio (height = width × ratio) |
| `--custom-RecentChatAvatarYPosition` | `25%` | Vertical position of the avatar image in the recent chat shadow (0% = top, 100% = bottom; lower values show faces) |
| `--VN-sheld-height` | `50dvh` | Chat area height in Visual Novel mode |

## How the avatar injection works

The Ripple chat style uses SillyTavern's native `.avatar img` element directly, so no per-message CSS variable injection is required for the message bubbles themselves.

`code.js` still runs a `MutationObserver` on the welcome screen's `.recentChatList` and injects `--chat-avatar-url` onto each `.recentChat` entry for the avatar shadow effect. The observer reconnects automatically if SillyTavern replaces the list element (e.g. after pinning or deleting a chat). The `.mes`-level avatar vars are also injected but are unused by the Ripple style.
