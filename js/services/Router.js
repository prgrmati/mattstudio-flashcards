const Router = {
    init: () => {
        document.querySelectorAll('a.navlink').forEach(a => {
            a.addEventListener('click', event => {
                event.preventDefault();

                const url = event.target.getAttribute('href');

                Router.go(url);
            });
        });

        window.addEventListener('popstate', event => {
            Router.go(event.state.route, false);
        });

        Router.go(location.pathname);
    },
    go: (route, addToHistory = true) => {
        const main = document.querySelector('main');

        if (addToHistory) {
            history.pushState({ route }, null, route);
        }

        let pageContent = '';

        switch (route) {
            case '/':
            case '/dashboard':
                pageContent = document.createElement('dashboard-page');
                break;
            case '/create':
                pageContent = document.createElement('create-page');
                break;
            case `/switch`:
                pageContent = document.createElement('switch-page');
                break;
            default:
                break;
        }

        main.innerHTML = '';
        main.appendChild(pageContent);

        window.scrollX = 0;
        window.scrollY = 0;
    }
}

export default Router;