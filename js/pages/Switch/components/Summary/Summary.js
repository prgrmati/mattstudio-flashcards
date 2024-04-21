export class Summary extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        const templateResponse = await fetch('/js/pages/Switch/components/Summary/Summary.html');
        const templateText = await templateResponse.text();

        const template = document.createElement('template');
        template.innerHTML = templateText;

        const content = template.content.cloneNode(true);

        this.appendChild(content);

        this.setListeners();
    }

    render({ total, checked, unchecked, successPercentage}) {
        this.querySelector('[data-total]').textContent = total;
        this.querySelector('[data-checked]').textContent = checked;
        this.querySelector('[data-unchecked]').textContent = unchecked;
        this.querySelector('[data-success-percentage]').textContent = successPercentage;
    }

    setListeners() {
        window.addEventListener('Card_DisplayTotals', (event) => {
            this.render(event.summary);
        });
    }
}

customElements.define('switch-summary-component', Summary);
