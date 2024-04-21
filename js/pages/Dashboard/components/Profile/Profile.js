export class Profile extends HTMLElement {
    constructor() {
        super();    
    }   

    async connectedCallback() {
        const templateResponse = await fetch('/js/pages/Dashboard/components/Profile/Profile.html');
        const templateText = await templateResponse.text();

        const template = document.createElement('template');
        template.innerHTML = templateText;

        const content = template.content.cloneNode(true);
        this.appendChild(content);    
    }
}

customElements.define('dashboard-profile-component', Profile);