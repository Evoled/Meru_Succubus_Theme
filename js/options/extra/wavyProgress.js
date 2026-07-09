(function () {
    var SELECTORS = [
        '._1EubJAK9z7JtdGks5M2f8t .wEM7Q5RG3mzmns1x1Zjux:last-child',
        '._2Dptk9e7W_k4zYB5wfRTcp .Qeg4qAFIMLaYd3mHOBndS',
        '._1-nHjRywUoX7Mpyc6JOPaQ ._2_0JonK7eKEvh8IoOvq0-B',
        '._2_FomluqqgQ2Hx8ON3AVep .wi0pDywRgOCxhG7OqQNaA',
        '._3szjUMH5QeRwtXAsLRcWt9._3DjdoQj5NoknowwV5t5JPN',
        '._25YVDTaClw6Y2COPsU0UaV',
        '._2IEorvaTnkOBZw3PEDXZoB',
        '._1f7qD1HD8b01m7JUphBILr'
    ];
    var NS = 'http://www.w3.org/2000/svg';
    var WAVELENGTH = 24;

    if (!document.getElementById('succubus-wavy-anim-style')) {
        var style = document.createElement('style');
        style.id = 'succubus-wavy-anim-style';
        style.textContent =
            '@keyframes succubusWaveScroll { from { transform: translateX(0); } to { transform: translateX(-' + WAVELENGTH + 'px); } }' +
            '.succubus-wavy-svg { position: absolute; left: 0; top: 50%; width: 100%; height: 300%; ' +
            'transform: translateY(-50%); overflow: hidden; pointer-events: none; }' +
            '.succubus-wavy-g { animation: succubusWaveScroll 0.7s linear infinite; }';
        document.head.appendChild(style);
    }

    function buildPathData(totalWidth, height) {
        var cy = height / 2;
        var amp = Math.min(height * 0.35, 5);
        var extra = WAVELENGTH * 2;
        var steps = Math.ceil((totalWidth + extra * 2) / (WAVELENGTH / 8)) + 1;
        var d = '';
        for (var i = 0; i <= steps; i++) {
            var x = -extra + i * (WAVELENGTH / 8);
            var y = cy - amp * Math.sin((2 * Math.PI * i) / 8);
            d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
        }
        return d;
    }

    function makeWavy(el) {
        if (el.dataset.succubusWavy) return;
        el.dataset.succubusWavy = '1';

        el.style.setProperty('background', 'transparent', 'important');
        el.style.setProperty('background-color', 'transparent', 'important');
        el.style.setProperty('background-image', 'none', 'important');
        el.style.setProperty('box-shadow', 'none', 'important');
        el.style.setProperty('border', 'none', 'important');
        if (!el.style.position) el.style.position = 'relative';

        var svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('class', 'succubus-wavy-svg');

        var g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'succubus-wavy-g');

        var path = document.createElementNS(NS, 'path');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', '3');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('style', 'stroke: var(--md-sys-color-primary);');

        g.appendChild(path);
        svg.appendChild(g);
        el.appendChild(svg);

        function update() {
            var w = el.clientWidth;
            var h = el.clientHeight || 8;
            if (w <= 0) return;
            svg.setAttribute('viewBox', '0 0 ' + w + ' ' + (h * 3));
            svg.setAttribute('preserveAspectRatio', 'none');
            path.setAttribute('d', buildPathData(w, h * 3));
        }

        update();
        if (window.ResizeObserver) {
            new ResizeObserver(update).observe(el);
        } else {
            setInterval(update, 500);
        }
    }

    function scan() {
        SELECTORS.forEach(function (sel) {
            document.querySelectorAll(sel).forEach(makeWavy);
        });
    }

    scan();
    new MutationObserver(scan).observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
})();
