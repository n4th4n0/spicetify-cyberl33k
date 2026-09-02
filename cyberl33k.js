/*
 * Cyberl33k Synced
 * Spicetify extension by n4th4n0
 *
 * Displays an animated Cyberl33k WebM above Spotify's playback bar
 * and follows Spotify's native playback progress movement.
 */

(function cyberl33kSynced() {
    const VIDEO_ID = "cyberl33k-synced-video";
    const STYLE_ID = "cyberl33k-synced-style";
    const VIDEO_URL =
        "https://raw.githubusercontent.com/n4th4n0/spicetify-cyberl33k/main/cyberl33k.webm";

    function getProgressBar() {
        return document.querySelector(
            ".player-controls .playback-progressbar .progress-bar"
        );
    }

    function installStyle() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
            .player-controls .playback-progressbar {
                overflow: visible !important;
            }

            .player-controls .playback-progressbar .progress-bar {
                position: relative !important;
                overflow: visible !important;
            }

            #${VIDEO_ID} {
                position: absolute !important;

                /* Follow Spotify's native playback position */
                left: var(--progress-bar-transform) !important;
                transition: left var(--progress-bar-duration) linear !important;

                /* Center Cyberl33k on the current playback position */
                transform: translateX(-50%) !important;

                /* Display dimensions */
                width: 64px !important;
                height: 96px !important;

                /* Position above the playback bar */
                bottom: calc(100% - 7px) !important;

                object-fit: contain !important;
                pointer-events: none !important;
                z-index: 9999 !important;
            }
        `;

        document.head.appendChild(style);
    }

    function mountVideo() {
        const bar = getProgressBar();
        if (!bar) return;

        let video = document.getElementById(VIDEO_ID);

        if (!video) {
            video = document.createElement("video");
            video.id = VIDEO_ID;
            video.src = VIDEO_URL;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.preload = "auto";
            video.setAttribute("aria-hidden", "true");
        }

        if (video.parentElement !== bar) {
            bar.appendChild(video);
        }

        const isPaused =
            Spicetify?.Player?.data?.isPaused ??
            Spicetify?.Player?.data?.is_paused ??
            false;

        if (isPaused) {
            video.pause();
        } else {
            video.play().catch(() => {});
        }
    }

    function start() {
        installStyle();
        mountVideo();

        if (window.Spicetify?.Player) {
            Spicetify.Player.addEventListener("songchange", () => {
                setTimeout(mountVideo, 100);
                setTimeout(mountVideo, 500);
            });

            Spicetify.Player.addEventListener("onplaypause", () => {
                setTimeout(mountVideo, 50);
            });
        }

        const observer = new MutationObserver(() => {
            if (!document.getElementById(VIDEO_ID)) {
                mountVideo();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function waitForSpotify() {
        if (
            window.Spicetify &&
            Spicetify.Player &&
            getProgressBar()
        ) {
            start();
        } else {
            setTimeout(waitForSpotify, 300);
        }
    }

    waitForSpotify();
})();
