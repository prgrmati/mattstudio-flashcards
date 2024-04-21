import Router from '../../../../services/Router.js';
import Flashcards from '../../../../services/Flashcards.js';

export class FlashcardGroup extends HTMLElement {
    #flashcard = {
        name: '',
        color: '',
        cards: [],
        lastStrike: {}
    }

    constructor() {
        super();
    }

    async connectedCallback() {
        const templateResponse = await fetch('/js/pages/Dashboard/components/FlashcardGroup/FlashcardGroup.html');
        const templateText = await templateResponse.text();

        const template = document.createElement('template');
        template.innerHTML = templateText;

        const content = template.content.cloneNode(true);
        this.appendChild(content);

        const flashcardGroupData = JSON.parse(this.dataset.flashcardGroup);

        this.render(flashcardGroupData);
        this.initEvents();
    }

    initEvents() {
        this.addEventListener('click', event => {
            const path = event.composedPath();

            if (path.some(node => node.classList && node.classList.contains('remove-action'))) {
                this.removeFlashcardGroup();
            } else {
                this.setChoosenFlashcardAndGoToSwitchPage();
            }
        });
    }

    removeFlashcardGroup(e) {
        if (confirm('Are you sure?') === true) {
            console.log(JSON.parse(this.dataset.flashcardGroup).id);
            Flashcards.remove(JSON.parse(this.dataset.flashcardGroup).id, () => {
                this.classList.add('hidden');
            });
        }
    }

    render({ name, color, cards, lastStrike, id }) {
        this.#flashcard = {
            id,
            name,
            color,
            cards,
            lastStrike
        }

        this.querySelector('[data-name]').textContent = name;
        this.querySelector('[data-count]').textContent = cards.length;
        this.querySelector('[data-check]').textContent = lastStrike.check;
        this.querySelector('[data-uncheck]').textContent = lastStrike.uncheck;
        this.querySelector('[data-color]').style.backgroundColor = `#${color}`;
    }

    setChoosenFlashcardAndGoToSwitchPage(e) {
        this.#flashcard.lastStrike.check = 0;
        this.#flashcard.lastStrike.uncheck = 0;

        app.store.selectedFlashcard = this.#flashcard;
        Router.go('/switch');
    }
}

customElements.define('flashcard-group', FlashcardGroup);