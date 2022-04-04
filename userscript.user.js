// ==UserScript==
// @name         The Gacha Alliance r/place Script
// @namespace    http://tampermonkey.net/
// @version      6.9
// @description  The GFL/Va-11 Peppy OGs - Gacha Alliance official userscript
// @author       soreikomori, hime, Aldo796, LeftHandedBread and every single fellow weeb
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://github.com/GachaAlliance/Overlay/raw/main/logo.webp
// @grant        none
// @license      MIT
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
        document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
            (function () {
                const image = document.createElement("img");
                let undotted = "https://www.dropbox.com/s/btcpvdu9qctwayg/highlight.png?raw=1&";
                image.src = "https://www.dropbox.com/s/jr4crnn654mjxwz/overlay.png?raw=1&";

                image.onload = () => {
                    image.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px; transition: opacity 0.2s ease";
                };

                setInterval(() => {
                    image.src = "https://www.dropbox.com/s/jr4crnn654mjxwz/overlay.png?raw=1&cache=" + uuidv4();
                    undotted = "https://www.dropbox.com/s/btcpvdu9qctwayg/highlight.png?raw=1&" + uuidv4();
                }, 60000)

                // Add the image as overlay
                const camera = document.querySelector("mona-lisa-embed").shadowRoot.querySelector("mona-lisa-camera");
                const layout = document.querySelector("mona-lisa-embed").shadowRoot;
                const canvas = camera.querySelector("mona-lisa-canvas");
                canvas.shadowRoot.querySelector('.container').appendChild(image);

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
                        loadRegions()
                        setTimeout(() => {
                            loadRegions();
                            if (typeof regionInterval == "undefined") {
                                const regionInterval = setInterval(() => {
                                    loadRegions()
                                }, 5000)
                            }
                        }, 1000)
                    }
                }, 100);

                //Insert element after another element
                function insertAfter(newNode, referenceNode) {
                    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
                }

                //Slider initialization
                function initSlider() {
                    let visSlider = document.createElement("div");

                    visSlider.style = `
                     position: fixed;
                     left: calc(var(--sail) + 16px);
                     right: calc(var(--sair) + 16px);
                     display: flex;
                     flex-flow: row nowrap;
                     align-items: center;
                     justify-content: center;
                     height: 40px;
                     top: calc(var(--sait) + 48px);
                     text-shadow: black 1px 0 10px;
                     text-align:center;
                `;

                    //Text
                    let visText = document.createElement("div");
                    visText.innerText = "Highlight zones";
                    visSlider.appendChild(visText);

                    let lineSeparator = document.createElement("br");
                    visSlider.appendChild(lineSeparator);

                    //Range slider input
                    let visInput = document.createElement("input");
                    visInput.setAttribute("type", "range");
                    visInput.setAttribute("id", "visRange");
                    visInput.setAttribute("name", "range");
                    visInput.setAttribute("min", "0");
                    visInput.setAttribute("max", "100");
                    visInput.setAttribute("step", "1");
                    visInput.value = 0;

                    //Range slider label (name)
                    let visLabel = document.createElement("label");
                    visLabel.innerText = '0'


                    visSlider.appendChild(visInput);
                    visSlider.appendChild(visLabel);

                    var inputEvtHasNeverFired = true;

                    var rangeValue = { current: undefined, mostRecent: undefined };

                    visInput.addEventListener("input", function (evt) {
                        inputEvtHasNeverFired = false;
                        rangeValue.current = evt.target.value;
                        if (rangeValue.current !== rangeValue.mostRecent) {
                            visInput.value = rangeValue.current;
                            visLabel.innerText = rangeValue.current + '';
                            placeGlobal.visLevel = rangeValue.current / 100;
                            placeGlobal.svgMask.style.opacity = placeGlobal.visLevel + '';
                        }
                        rangeValue.mostRecent = rangeValue.current;
                    });

                    let topControls = document.querySelector("mona-lisa-embed").shadowRoot.querySelector(".layout .top-controls");
                    insertAfter(visSlider, topControls);
                    placeGlobal.slider = visSlider;
                }

                //Generate SVG function
                function generateSVG() {
                    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svg.setAttribute("width", "2000px");
                    svg.setAttribute("height", "2000px");
                    svg.style = `
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            opacity: `+ placeGlobal.visLevel + `;`;

                    let svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                    svg.appendChild(svgDefs);

                    let mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
                    mask.setAttribute("id", "osuplaceMask");
                    svgDefs.appendChild(mask);

                    let mainMask = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    mainMask.setAttribute('x', "0");
                    mainMask.setAttribute("y", "0");
                    mainMask.setAttribute('height', "100%");
                    mainMask.setAttribute('width', "100%");
                    mainMask.setAttribute('fill', 'white');
                    mask.appendChild(mainMask);

                    let imageMask = document.createElementNS("http://www.w3.org/2000/svg", 'image');
                    imageMask.setAttribute('href', undotted)
                    imageMask.setAttribute('x', "0");
                    imageMask.setAttribute("y", "0");
                    imageMask.setAttribute('height', "100%");
                    imageMask.setAttribute('width', "100%");
                    mask.appendChild(imageMask);

                    let svgBody = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    svgBody.setAttribute("width", "2000px");
                    svgBody.setAttribute("height", "2000px");
                    svgBody.setAttribute("x", "0");
                    svgBody.setAttribute("y", "0");
                    svg.appendChild(svgBody);

                    let bodyRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    bodyRect.setAttribute("width", "2000px");
                    bodyRect.setAttribute("height", "2000px");
                    bodyRect.setAttribute("x", "0");
                    bodyRect.setAttribute("y", "0");
                    bodyRect.setAttribute("fill", "rgba(0,0,0,0.6)");
                    bodyRect.setAttribute("mask", "url(#osuplaceMask)")
                    svgBody.appendChild(bodyRect);

                    return svg
                }

                //Global variables
                var placeGlobal = {
                    visLevel: 0,
                    slider: null,
                    svgMask: null
                }

                //Load mask
                function loadRegions() {
                    if (placeGlobal.svgMask != null) {
                        placeGlobal.svgMask.remove();
                    }

                    let svgClipBody = generateSVG();

                    placeGlobal.svgMask = svgClipBody;

                    //Generate slider UI

                    //if(placeGlobal.slider == null ){
                    let sliderState = layout.contains(layout.querySelector('#visRange'));
                    if (!sliderState) {
                        initSlider();
                    }
                    //}

                    canvas.shadowRoot.querySelector('.container').appendChild(svgClipBody);
                }

                return image;
            })())

    }, false);
}