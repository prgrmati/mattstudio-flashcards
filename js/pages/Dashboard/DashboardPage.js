import { BaseWebComponent } from "../../extensions/BaseWebComponent.js";

export class DashboardPage extends BaseWebComponent {
    constructor() {
        super();

        this.loadCSS('/js/pages/Dashboard/Dashboard.css');
    }

    connectedCallback() {
        const template = document.getElementById('dashboard-page-template');
        const content = template.content.cloneNode(true);

        this.root.appendChild(content);

        this.render();
        this.initShadowRouting();
        this.appendComponent('dashboard-profile-component', 'profile-component');
        this.appendComponent('dashboard-date-component', 'date-component');
    }

    async renderFlashcardGroups() {
        const flashcardsGroups = app.store.flashcardsGroups;

        flashcardsGroups.forEach((flashcardGroup) => {
            const single = document.createElement('flashcard-group');

            const flashObject = {
                ...flashcardGroup
            }

            single.dataset.flashcardGroup = JSON.stringify(flashObject);
            this.root.getElementById('flashcard-groups').appendChild(single);
        });
    }

    async render() {
        await this.renderFlashcardGroups();
    }
}

customElements.define('dashboard-page', DashboardPage);