export class DateInfo extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        const templateResponse = await fetch('/js/pages/Dashboard/components/Date/Date.html');
        const templateText = await templateResponse.text();

        const template = document.createElement('template');
        template.innerHTML = templateText;

        const content = template.content.cloneNode(true);
        this.appendChild(content);

        this.render();
    }

    render() {
        this.generateCurrentDate();
    }

    generateCurrentDate() {
        const date = new Date();
        const months = [
            'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
            'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
        ];

        const daysOfWeek = [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday',
            'Thursday', 'Friday', 'Saturday'
        ];

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const dayOfWeek = daysOfWeek[date.getDay()];

        this.querySelector('.date-day').textContent = day;
        this.querySelector('.date-month').textContent = `${month}, ${year}`;
        this.querySelector('.date-week').textContent = dayOfWeek;
    }
}

customElements.define('dashboard-date-component', DateInfo);