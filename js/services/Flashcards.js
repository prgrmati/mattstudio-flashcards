let dbInstance = null;
const dbName = 'Flashcards';
const dbVersion = 1;

const load = (tableName) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = (event) => {
      const dbInstance = event.target.result;
      try {
        const transaction = dbInstance.transaction([tableName], 'readonly');
        const objectStore = transaction.objectStore(tableName);
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = (event) => {
          const groups = event.target.result;

          groups.sort((a, b) => b.id - a.id);

          resolve(groups);
        };

        getAllRequest.onerror = (event) => {
          console.error('Error fetching flashcards groups:', event.target.errorCode);
          reject(event.target.errorCode);
        };
      } catch (error) {
        alert(error);
      }
    };

    request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
};


const init = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('groups')) {
        db.createObjectStore('groups', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
}

const add = (group) => {
  return new Promise((resolve, reject) => {
    const transaction = dbInstance.transaction(['groups'], 'readwrite');
    const store = transaction.objectStore('groups');

    const request = store.add(group);

    request.onsuccess = () => {
      resolve(request.result);

      window.app.store.flashcardsGroups = [{ ...group }, ...window.app.store.flashcardsGroups];
    }
    request.onerror = () => reject(request.error);
  });
};

const remove = (key, successCallback) => {
  return new Promise((resolve, reject) => {
    const transaction = dbInstance.transaction(['groups'], 'readwrite');
    const objectStore = transaction.objectStore('groups');

    const deleteRequest = objectStore.delete(key);

    deleteRequest.onsuccess = () => {
      if (successCallback && typeof successCallback === 'function') {
        successCallback();
      }
      resolve();
    };

    deleteRequest.onerror = (event) => {
      console.error(`Error deleting flashcards with key ${key}:`, event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
};

const update = (key, newData) => {
  return new Promise((resolve, reject) => {
    const transaction = dbInstance.transaction(['groups'], 'readwrite');
    const objectStore = transaction.objectStore('groups');

    const getRequest = objectStore.get(key);

    getRequest.onsuccess = () => {
      const existingItem = getRequest.result;

      if (existingItem) {
        const updatedItem = { ...existingItem, ...newData };
        const putRequest = objectStore.put(updatedItem);

        putRequest.onsuccess = () => {
          resolve(updatedItem);
        };

        putRequest.onerror = (event) => {
          console.error('Error updating flashcards:', event.target.errorCode);
          reject(event.target.errorCode);
        };
      } else {
        reject(`Flashcard not found with key: ${key}`);
      }
    };

    getRequest.onerror = (event) => {
      console.error('Error getting flashcards:', event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
};

const Flashcards = {
  load,
  init,
  add,
  remove,
  update
}

export default Flashcards;