import Router from "../services/Router.js";

export class BaseWebComponent extends HTMLElement {
    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });
        this.styles = document.createElement('style');
        this.root.appendChild(this.styles);
    }

    async loadCSS(path) {
        try {
            const request = await fetch(path);
            const css = await request.text();

            this.styles.textContent = css;
        } catch (error) {
            console.error('Failed to load CSS:', error);
        }
    }

    appendComponent(name, wrapper) {
        const component = document.createElement(name);

        this.root.getElementById(wrapper).appendChild(component);
    }

    initShadowRouting() {
        this.root.querySelectorAll('a.router-link').forEach(a => {
            a.addEventListener('click', event => {
                event.preventDefault();

                const url = event.currentTarget.getAttribute('href');

                Router.go(url);
            });
        });
    }
}
