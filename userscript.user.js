// ==UserScript==
// @name         The Gacha Alliance r/place Script
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  The GFL/Va-11 Peppy OGs - Gacha Alliance official userscript
// @author       soreikomori, hime, LeftHandedBread and every single fellow weeb
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
        document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
            (function () {
                const image = document.createElement("img");
                image.src = "https://www.dropbox.com/s/jr4crnn654mjxwz/overlay.png?raw=1&";
                image.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px; transition: opacity 0.2s ease";

                setInterval(() => {
                    image.src = "https://www.dropbox.com/s/jr4crnn654mjxwz/overlay.png?raw=1&cache=" + uuidv4();
                }, 60000)

                function uuidv4() {
                    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                    );
                }

                // Press Shift + S to show/hide the overlay
                document.body.addEventListener('keypress', (e) => {
                    if (e.code == 'KeyS') {
                        image.style.opacity = (+image.style.opacity) ? 0 : 1;
                    }
                })

                // Add a style to put a hole in the pixel preview (to see the current or desired color)
                const waitForPreview = setInterval(() => {
                    const preview = camera.querySelector("mona-lisa-pixel-preview");
                    if (preview) {
                        clearInterval(waitForPreview);
                        const style = document.createElement('style')
                        style.innerHTML = '.pixel { clip-path: polygon(-20% -20%, -20% 120%, 37% 120%, 37% 37%, 62% 37%, 62% 62%, 37% 62%, 37% 120%, 120% 120%, 120% -20%); }'
                        preview.shadowRoot.appendChild(style);
                    }
                }, 100);

                return image;
            })())

    }, false);
}