# Cyberl33k — Spicetify Playback Bar Animation

Animated **Cyberl33k** character for the Spotify playback bar using **Spicetify**.

The character dances while following the current playback position.

<p align="center">
  <img src="./cyberl33k.gif" alt="Cyberl33k animated preview" width="128">
</p>

## Features

- Animated transparent GIF
- Follows the playback progress
- Pixel-art rendering preserved
- Does not block clicking or dragging the progress bar
- No extension or JavaScript required
- Public GitHub-hosted asset

## Files

```text
spicetify-cyberl33k/
├── cyberl33k.gif
├── cyberl33k.css
└── README.md
```

## Installation

### Option 1 — Spicetify Marketplace / custom CSS

Copy the contents of [`cyberl33k.css`](./cyberl33k.css) into your custom CSS / Bribe snippet and enable it.

### Option 2 — Copy the CSS manually

```css
/*
 * Cyberl33k — Spicetify playback-bar animation
 * Author: n4th4n0
 * Repository: https://github.com/n4th4n0/spicetify-cyberl33k
 *
 * The character follows Spotify's playback progress.
 */

.player-controls .playback-progressbar {
    overflow: visible !important;
}

.player-controls .playback-progressbar .progress-bar {
    overflow: visible !important;
}

.player-controls .playback-progressbar .progress-bar::before {
    content: "" !important;
    position: absolute !important;

    /* Follow Spotify's current playback position */
    left: var(--progress-bar-transform) !important;
    transition: left var(--progress-bar-duration) linear !important;

    /* Center the character on the exact playback position */
    transform: translateX(-50%) !important;

    /* Character dimensions — original GIF is 64 × 96 */
    width: 64px !important;
    height: 96px !important;

    /* Put the feet just above the progress bar */
    bottom: calc(100% - 7px) !important;

    background-image: url("https://raw.githubusercontent.com/n4th4n0/spicetify-cyberl33k/main/cyberl33k.gif") !important;
    background-repeat: no-repeat !important;
    background-position: center bottom !important;
    background-size: contain !important;

    image-rendering: pixelated !important;
    pointer-events: none !important;
    z-index: 9999 !important;
}
```

## Direct links

**GIF**

```text
https://raw.githubusercontent.com/n4th4n0/spicetify-cyberl33k/main/cyberl33k.gif
```

**CSS**

```text
https://raw.githubusercontent.com/n4th4n0/spicetify-cyberl33k/main/cyberl33k.css
```

## Customization

Change the character size:

```css
width: 64px !important;
height: 96px !important;
```

Move the character vertically:

```css
bottom: calc(100% - 7px) !important;
```

For example, use `-3px` instead of `-7px` to place the character slightly higher.

## Compatibility

This snippet targets Spicetify's Spotify playback progress bar and uses Spotify's
`--progress-bar-transform` and `--progress-bar-duration` CSS variables to follow playback.

Spotify can change its internal interface at any time, so future Spotify/Spicetify updates
may require a selector adjustment.

## Credits

Created and maintained by **n4th4n0**.

Repository: https://github.com/n4th4n0/spicetify-cyberl33k

## License

No license is currently granted for redistribution or modification beyond use of this repository's
published files. Add a license later if you want to explicitly allow reuse, modification, or redistribution.
