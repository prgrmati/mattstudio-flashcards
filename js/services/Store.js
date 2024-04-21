const Store = {
    flashcardsGroups: [],
    selectedFlashcard: {}
}

const proxiedStore = new Proxy(Store, {
    set(target, property, value) {
        target[property] = value;

        if(property === 'flashcards') {
            window.dispatchEvent(new Event('FlashcardsChanged'));
        }

        return true;
    }
});

export default proxiedStore;