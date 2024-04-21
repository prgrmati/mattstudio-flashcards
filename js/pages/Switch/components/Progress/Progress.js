export class Progress extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        const templateResponse = await fetch('/js/pages/Switch/components/Progress/Progress.html');
        const templateText = await templateResponse.text();

        const template = document.createElement('template');
        template.innerHTML = templateText;

        const content = template.content.cloneNode(true);

        this.appendChild(content);

        this.render();
        this.setListeners();
    }

    setListeners() {
        window.addEventListener('Card_Check', () => {
            this.editProgress(true);
        });
        window.addEventListener('Card_Uncheck', () => {
            this.editProgress(false);
        });
        window.addEventListener('Card_Reset', () => {
            this.resetProgress();
        });
    }

    resetProgress() {
        const progressContainer = this.querySelector('#progress');

        const divsInsideProgress = progressContainer.querySelectorAll('div');

        divsInsideProgress.forEach((div) => {
            div.className = '';
        });

    }

    editProgress(check) {
        const progressContainer = this.querySelector('#progress');
        const firstUneditedDiv = progressContainer.querySelector('div:not(.edited)');

        if (firstUneditedDiv) {
            firstUneditedDiv.classList.add(check ? 'green' : 'red', 'edited');
        }
    }

    render() {
        const cardsLength = app.store.selectedFlashcard.cards.length;

        const progressContainer = this.querySelector('#progress');

        if (progressContainer) {
            progressContainer.style.gridTemplateColumns = `repeat(${cardsLength}, 1fr)`;

            this.createProgressDivs(cardsLength);
        }
    }

    createProgressDivs(cardsLength) {
        for (let i = 0; i < cardsLength; i++) {
            const cardDiv = document.createElement('div');
            this.querySelector('#progress').appendChild(cardDiv);
        }
    }

}

customElements.define('switch-progress-component', Progress);