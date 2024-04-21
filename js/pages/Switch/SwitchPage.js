import { BaseWebComponent } from "../../extensions/BaseWebComponent.js";
import Flashcards from "../../services/Flashcards.js";

export class SwitchPage extends BaseWebComponent {
    #selectedFlashcard = {}
    #currentIndex = -1;
    #currentCard = {}

    constructor() {
        super();

        this.loadCSS('/js/pages/Switch/Switch.css');
    }

    connectedCallback() {
        const template = document.getElementById('switch-page-template');
        const content = template.content.cloneNode(true);

        this.root.appendChild(content);

        this.switchFlashcard();
        this.setInitCard();
        this.setNextCard();
        this.setActionsButtons();
        this.setResetFlashcard();

        this.appendComponent('switch-progress-component', 'progress-component');
        this.appendComponent('switch-summary-component', 'summary-component');
    }

    setResetFlashcard() {
        this.root.getElementById('redo').addEventListener('click', this.resetFlashcard.bind(this))
    }
    
    resetFlashcard() {
        this.#currentIndex = -1;
        this.#selectedFlashcard.lastStrike.check = 0;
        this.#selectedFlashcard.lastStrike.uncheck = 0;

        this.setNextCard();

        this.root.getElementById('flashcard').classList.remove('hidden');
        this.root.getElementById('switch-btn-actions').classList.remove('hidden');
        this.root.getElementById('summary-btn-actions').classList.add('hidden');
        this.root.querySelector('.switch-summary-component').classList.add('hidden');

        window.dispatchEvent(new Event('Card_Reset'));
    }

    setInitCard() {
        this.#selectedFlashcard = app.store.selectedFlashcard;
    }

    setNextCard() {
        this.#currentIndex += 1;
        this.#currentCard = this.#selectedFlashcard.cards[this.#currentIndex];

        if(this.#currentCard) {
            const { front, back } = this.#currentCard;

            const flashcard = this.root.getElementById('flashcard');
    
            flashcard.querySelector('[data-front-text]').textContent = front;
            flashcard.querySelector('[data-back-text]').textContent = back;
        }
        else {
            this.hideCardAndShowSummary();
        }
    }

    hideCardAndShowSummary() {
        this.root.getElementById('flashcard').classList.add('hidden');
        this.root.getElementById('switch-btn-actions').classList.add('hidden');
        this.root.getElementById('summary-btn-actions').classList.remove('hidden');
        this.root.querySelector('.switch-summary-component').classList.remove('hidden');

        console.log(this.#selectedFlashcard);

        Flashcards.update(app.store.selectedFlashcard.id, this.#selectedFlashcard);

        const cardTotalsEvent = new Event('Card_DisplayTotals');

        cardTotalsEvent.summary = {
            total: this.#selectedFlashcard.cards.length,
            checked: this.#selectedFlashcard.lastStrike.check,
            unchecked: this.#selectedFlashcard.lastStrike.uncheck,
            successPercentage: this.calculateSuccessPercentage(this.#selectedFlashcard.cards.length, this.#selectedFlashcard.lastStrike.check)
        }

        window.dispatchEvent(cardTotalsEvent);
    }

    calculateSuccessPercentage(total, checked) {
        if (total === 0) {
            return 0;
        }

        return Math.round((checked / total) * 100);;
    }

    switchFlashcard() {
        this.root.getElementById('flashcard').addEventListener('click', (card) => {
            card.currentTarget.style.transform = card.currentTarget.style.transform === 'rotateY(180deg)' ? 'rotateY(0deg)' : 'rotateY(180deg)';
        });
    }

    setActionsButtons() {
        this.root.getElementById('uncheck').addEventListener('click', this.uncheckAction.bind(this));
        this.root.getElementById('check').addEventListener('click', this.checkAction.bind(this));
    }

    uncheckAction() {
        this.#selectedFlashcard.lastStrike.uncheck = this.#selectedFlashcard.lastStrike.uncheck + 1;
        this.setNextCard();

        window.dispatchEvent(new Event('Card_Uncheck'));
    }

    checkAction() {
        this.#selectedFlashcard.lastStrike.check = this.#selectedFlashcard.lastStrike.check + 1;
        this.setNextCard();
        
        window.dispatchEvent(new Event('Card_Check'));
    }
}

customElements.define('switch-page', SwitchPage);