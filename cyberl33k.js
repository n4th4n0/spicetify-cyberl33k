/*
 * Cyberl33k Synced
 * Spicetify extension by n4th4n0
 *
 * Displays an animated Cyberl33k WebM above Spotify's playback bar
 * and keeps it synced with the current playback position.
 */

(function cyberl33kSynced() {
    const VIDEO_ID = "cyberl33k-synced-video";
    const STYLE_ID = "cyberl33k-synced-style";
    const VIDEO_URL =
        "https://raw.githubusercontent.com/n4th4n0/spicetify-cyberl33k/main/cyberl33k.webm";

    let animationFrame = null;
    let observer = null;

    function ready() {
        return (
            window.Spicetify &&
            Spicetify.Player &&
            typeof Spicetify.Player.getProgressPercent === "function"
        );
    }

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
                width: 64px !important;
                height: 96px !important;
                bottom: calc(100% - 7px) !important;
                transform: translateX(-50%) !important;
                object-fit: contain !important;
                pointer-events: none !important;
                z-index: 9999 !important;
            }
        `;
        document.head.appendChild(style);
    }

    function mountVideo() {
        const bar = getProgressBar();
        if (!bar) return null;

        let video = document.getElementById(VIDEO_ID);

        if (!video) {
            video = document.createElement("video");
            video.id = VIDEO_ID;
            video.src = VIDEO_URL;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.setAttribute("aria-hidden", "true");
            video.setAttribute("preload", "auto");
        }

        if (video.parentElement !== bar) {
            bar.appendChild(video);
        }

        return video;
    }

    function updatePosition() {
        const video = mountVideo();

        if (video) {
            const progress = Math.max(
                0,
                Math.min(1, Spicetify.Player.getProgressPercent() || 0)
            );

            video.style.left = `${progress * 100}%`;

            const isPaused = Spicetify.Player.data?.isPaused ?? false;

            if (isPaused) {
                if (!video.paused) video.pause();
            } else if (video.paused) {
                video.play().catch(() => {});
            }
        }

        animationFrame = requestAnimationFrame(updatePosition);
    }

    function remountSoon() {
        window.setTimeout(mountVideo, 100);
        window.setTimeout(mountVideo, 500);
    }

    function start() {
        installStyle();
        mountVideo();

        Spicetify.Player.addEventListener("songchange", remountSoon);
        Spicetify.Player.addEventListener("onplaypause", remountSoon);
        Spicetify.Player.addEventListener("onprogress", mountVideo);

        observer = new MutationObserver(() => {
            if (!document.getElementById(VIDEO_ID)) {
                mountVideo();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        updatePosition();
    }

    function waitForSpicetify() {
        if (ready()) {
            start();
            return;
        }

        window.setTimeout(waitForSpicetify, 300);
    }

    waitForSpicetify();
})();
