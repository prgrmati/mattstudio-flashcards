import { BaseWebComponent } from "../../extensions/BaseWebComponent.js";
import Flashcards from "../../services/Flashcards.js";
import Router from "../../services/Router.js";

export class CreatePage extends BaseWebComponent {
    #flashcard = {
        name: 'Flashcards',
        color: '',
        cards: [],
        lastStrike: {
            check: 0,
            uncheck: 0
        }
    }

    constructor() {
        super();

        this.loadCSS('/js/pages/Create/CreatePage.css');
        this.ProxiedFlashcards = {};
        this.flashcardBgColor = '';
    }

    connectedCallback() {
        const template = document.getElementById('create-page-template');
        const content = template.content.cloneNode(true);

        content.getElementById('group-name').addEventListener('input', this.setupInputBinding.bind(this));
        content.getElementById('add-new-card').addEventListener('click', this.addNewCard.bind(this));
        content.getElementById('save-flashcards').addEventListener('click', this.saveFlashcards.bind(this));

        this.fillUpColorsAndAddClickColorChange(content.querySelectorAll('.color-choices div[data-color]'));

        this.root.appendChild(content);

        this.cachedElements();
    }

    cachedElements() {
        this.groupNameInput = this.root.getElementById('group-name');
        this.displayGroupName = this.root.getElementById('group-name-preview');
        this.flashcardGroupPreview = this.root.querySelector('.create-flashcard-group-preview');
    }

    async saveFlashcards() {
        if (this.isAnyNewCardInputsEmpty()) {
            alert('Please fill all fronts and backs of the cards.');

            return;
        }
        try {
            this.setupAddedCards();

            await Flashcards.add(this.#flashcard);
            Router.go('/', true);
        } catch (error) {
            alert('Error', error);
        }
    }

    setupAddedCards() {
        const singleCards = this.root.querySelectorAll('.single-card');

        singleCards.forEach(card => {
            const frontInput = card.querySelector('input[data-front]');
            const backInput = card.querySelector('input[data-back]');

            const front = frontInput.value;
            const back = backInput.value;

            const flashcard = { front, back };

            this.#flashcard.cards = [...this.#flashcard.cards, flashcard]
        });
    }

    addNewCard() {
        const newCard = document.createElement('div');

        newCard.classList.add('single-card');
        newCard.innerHTML = `
            <input type="text" data-front placeholder="front" />
            <input type="text" data-back placeholder="back" />
        `;

        this.root.querySelector('.new-cards-wrapper').appendChild(newCard);
        this.updateTotalCardsCount();
    }

    isAnyNewCardInputsEmpty() {
        let isEmpty = false;

        this.root.querySelectorAll('.single-card').forEach(card => {
            const inputs = card.querySelectorAll('input[type="text"]');
            inputs.forEach(input => {
                if (input.value.trim() === '') {
                    isEmpty = true;
                }
            });
        });

        return isEmpty;
    }

    updateTotalCardsCount() {
        this.root.getElementById('flashcard-count').textContent = this.root.querySelectorAll('.single-card').length;
    }

    setupInputBinding({ target }) {
        const { value } = target;

        if (value.length < 16) {
            this.displayGroupName.textContent = value;
            this.#flashcard.name = value;
        }
    }

    fillUpColorsAndAddClickColorChange(colors) {
        colors.forEach(element => {
            const { color } = element.dataset;

            element.style.backgroundColor = `#${color}`;
            element.addEventListener('click', () => {
                this.flashcardGroupPreview.style.backgroundColor = `#${color}`;
                this.#flashcard.color = color;
            });
        });
    }
}

customElements.define('create-page', CreatePage);