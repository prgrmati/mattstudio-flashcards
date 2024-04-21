import Store from './services/Store.js';
import Flashcards from './services/Flashcards.js';
import Router from './services/Router.js';

import { DashboardPage } from './pages/Dashboard/DashboardPage.js';
import { CreatePage } from './pages/Create/CreatePage.js';
import { SwitchPage } from './pages/Switch/SwitchPage.js';
import { FlashcardGroup } from './pages/Dashboard/components/FlashcardGroup/FlashcardGroup.js';
import { Profile } from './pages/Dashboard/components/Profile/Profile.js';
import { DateInfo } from './pages/Dashboard/components/Date/Date.js';

import { Progress } from './pages/Switch/components/Progress/Progress.js';
import { Summary } from './pages/Switch/components/Summary/Summary.js';

window.app = {};

app.store = Store;
app.router = Router;

async function main() {
  try {
    await Flashcards.init();
    window.app.store.flashcardsGroups = await Flashcards.load('groups');
    app.router.init();

  } catch (error) {
    console.error('Error loading the app:', error);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  main();
});