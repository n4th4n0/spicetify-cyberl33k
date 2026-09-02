/*
 * Cyberl33k Synced
 * Spicetify extension by n4th4n0
 *
 * Displays an animated Cyberl33k WebM above Spotify's playback bar.
 * Playback position changes are smoothed so Cyberl33k glides instead
 * of teleporting when the user seeks forward or backward.
 */

(function cyberl33kSynced() {
    const VIDEO_ID = "cyberl33k-synced-video";
    const STYLE_ID = "cyberl33k-synced-style";
    const VIDEO_URL =
        "https://raw.githubusercontent.com/n4th4n0/spicetify-cyberl33k/main/cyberl33k.webm";

    // Approximate time for a seek jump to visually settle.
    const SEEK_GLIDE_MS = 420;

    let visualProgress = null;
    let lastFrameTime = performance.now();
    let snapToRealProgress = true;

    function ready() {
        return (
            window.Spicetify &&
            Spicetify.Player &&
            typeof Spicetify.Player.getProgressPercent === "function"
        );
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function getRealProgress() {
        let value = Number(Spicetify.Player.getProgressPercent());

        if (!Number.isFinite(value)) return 0;

        // Handles either 0–1 or 0–100 values safely.
        if (value > 1) value /= 100;

        return clamp(value, 0, 1);
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
                will-change: left !important;
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
            video.preload = "auto";
            video.setAttribute("aria-hidden", "true");
        }

        if (video.parentElement !== bar) {
            bar.appendChild(video);
        }

        return video;
    }

    function syncVideoPlayback(video) {
        if (!video) return;

        const isPaused = Spicetify.Player.data?.isPaused ?? false;

        if (isPaused) {
            if (!video.paused) video.pause();
        } else if (video.paused) {
            video.play().catch(() => {});
        }
    }

    function animatePosition(now) {
        const video = mountVideo();
        const realProgress = getRealProgress();

        const dt = clamp(now - lastFrameTime, 0, 100);
        lastFrameTime = now;

        if (visualProgress === null || snapToRealProgress) {
            visualProgress = realProgress;
            snapToRealProgress = false;
        } else {
            /*
             * Exponential smoothing:
             * - normal playback remains fluid;
             * - seeking forward/backward glides instead of teleporting.
             * Around 95% of the distance is covered in SEEK_GLIDE_MS.
             */
            const tau = SEEK_GLIDE_MS / 3;
            const alpha = 1 - Math.exp(-dt / tau);

            visualProgress += (realProgress - visualProgress) * alpha;

            if (Math.abs(realProgress - visualProgress) < 0.00005) {
                visualProgress = realProgress;
            }
        }

        visualProgress = clamp(visualProgress, 0, 1);

        if (video) {
            video.style.left = `${visualProgress * 100}%`;
            syncVideoPlayback(video);
        }

        requestAnimationFrame(animatePosition);
    }

    function remountSoon() {
        window.setTimeout(mountVideo, 100);
        window.setTimeout(mountVideo, 500);
    }

    function handleSongChange() {
        // New song: jump directly to the new song position.
        snapToRealProgress = true;
        remountSoon();
    }

    function start() {
        installStyle();
        mountVideo();

        Spicetify.Player.addEventListener("songchange", handleSongChange);
        Spicetify.Player.addEventListener("onplaypause", remountSoon);
        Spicetify.Player.addEventListener("onprogress", mountVideo);

        const observer = new MutationObserver(() => {
            if (!document.getElementById(VIDEO_ID)) {
                mountVideo();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        lastFrameTime = performance.now();
        requestAnimationFrame(animatePosition);
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
