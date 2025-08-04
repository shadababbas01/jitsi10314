/* Jitsi Meet – Web app entry‑point (modernised) */
// If torture‑tests still need jQuery, leave this block; otherwise remove it.
import $ from 'jquery';
window.$ = window.jQuery = $;

/* Polyfills and early initialisers
   ─────────────────────────────── */

import '@matrix-org/olm';   // E2EE library – must load before React tree
import 'focus-visible';     // :focus-visible polyfill
import './react/features/base/jitsi-local-storage/setup'; // local‑storage bridge

/* Safari < 14 createImageBitmap polyfill (Canvas only) */
if (!('createImageBitmap' in window)) {
    window.createImageBitmap = canvas =>
        new Promise((resolve, reject) => {
            if (!(canvas instanceof HTMLCanvasElement)) {
                return reject(
                    new Error('createImageBitmap polyfill only handles HTMLCanvasElement')
                );
            }
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = canvas.toDataURL();
        });
}

/* Initialise Olm as early as possible. If it fails, remove it so code
 * that checks `window.Olm` disables E2EE gracefully. */
if (window.Olm) {
    window.Olm.init().catch(err => {
        console.error('Failed to initialise Olm, E2EE disabled:', err);
        delete window.Olm;
    });
}

/* Expose legacy globals for external APIs */
import conference from './conference';
import API        from './modules/API';
import UI         from './modules/UI/UI';
import translation from './modules/translation/translation';

window.APP = { API, conference, translation, UI };

/* ────────────────────────────────────────────────────────── */
/*  React entry – we now start from react/index.web.js       */
/* ────────────────────────────────────────────────────────── */

import React from 'react';
import ReactDOM from 'react-dom';
import Root from './react/index.web';            // ← new canonical web entry

/* Minimal Error Boundary so uncaught JS errors show a friendly UI instead
 * of crashing the whole bundle (and silencing Metro with “no stack”). */
class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, info) {
        console.error('Uncaught error in React tree', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    height: '100vh',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18
                }}>
                    Something went wrong. Please reload the page.
                </div>
            );
        }
        return this.props.children;
    }
}

ReactDOM.render(
    <ErrorBoundary>
        <Root />
    </ErrorBoundary>,
    document.getElementById('react‑root') || document.body.appendChild(document.createElement('div'))
);
