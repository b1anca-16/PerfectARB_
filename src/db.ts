import { openDB, DBSchema } from 'idb';

interface Entry {
    uuid: string;
    title: string;
    content: string;
}

interface MyDBSchema extends DBSchema {
    entrys: {
        key: string;
        value: Entry;
    };
};

export const DBStart = function () {
    let db!: IDBDatabase;
    const request = indexedDB.open('tasks', 1);
    request.onerror = (err) => console.error(`IndexedDB error: ${request.error}`, err);
    request.onsuccess = () => (db = request.result);
    request.onupgradeneeded = () => {
        //const db = request.result;
        // Überprüfe, ob der Objektstore bereits vorhanden ist
        if (!db.objectStoreNames.contains('entrys')) {
            // Erstelle den Objektstore entsprechend dem Schema
            const entrysStore = db.createObjectStore('entrys', { keyPath: 'uuid' });
            // Erstelle Indizes, wenn benötigt
            entrysStore.createIndex('title', 'title', { unique: false });
        }
    };
    
    return db;
};

export async function addItemToStore(tasks: Task[]) {
    // Öffne die IndexedDB-Datenbank oder erstelle sie, falls sie noch nicht existiert
    const db = await openDB('tasks', 1, {
      upgrade(db) {
        // Erstelle einen Objektspeicher für die Tasks
        const store = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
        // Definiere Indexe, wenn nötig
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('project', 'project', { unique: false });
        store.createIndex('text', 'text', { unique: false });
      },
    });
  
    // Füge jeden Task einzeln der Datenbank hinzu
    for (const task of tasks) {
      await db.add('tasks', { date: task.date, project: task.project, text: task.text });
    }
  }
  

let db: IDBDatabase;
export const getElement = <T>(store: string, key: string) => {
    const open = indexedDB.open('data');
    return new Promise<T>((resolve, reject) => {
        open.onsuccess = () => {
            let request!: IDBRequest;
            db = open.result;
            if ([...db.objectStoreNames].find((name) => name === store)) {
                const transaction = db.transaction(store);
                const objectStore = transaction.objectStore(store);
                if (key === 'all') request = objectStore.getAll();
                else request = objectStore.get(key);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
                transaction.oncomplete = () => db.close();
            } else {
                indexedDB.deleteDatabase('data');
            }
        };
    });
};
export const addElement = (store: string, payload: Entry) => {
    const open = indexedDB.open('data');
    open.onsuccess = () => {
        const db = open.result;
        if ([...db.objectStoreNames].find((name) => name === store)) {
            const transaction = db.transaction(store, 'readwrite');
            const objectStore = transaction.objectStore(store);
            const request = objectStore.add(payload);
            request.onerror = () => console.error(request.error);
            transaction.oncomplete = () => db.close();
        } else {
            indexedDB.deleteDatabase('data');
        }
    };
};

export const editElement = <T>(store: string, key: string, payload: object) => {
    const open = indexedDB.open('data');
    return new Promise<T>((resolve, reject) => {
        open.onsuccess = () => {
            let request: IDBRequest;
            db = open.result;
            if ([...db.objectStoreNames].find((name) => name === store)) {
                const transaction = db.transaction(store, 'readwrite');
                const objectStore = transaction.objectStore(store);
                if (key === 'all') request = objectStore.getAll();
                else request = objectStore.get(key);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => {
                    const serialized = JSON.parse(JSON.stringify(payload));
                    const updateRequest = objectStore.put(serialized);
                    updateRequest.onsuccess = () => resolve(request.result);
                };
                transaction.oncomplete = () => db.close();
            } else {
                indexedDB.deleteDatabase('data');
            }
        };
    });
};
export const removeElement = (store: string, key: string) => {
    const open = indexedDB.open('data');
    open.onsuccess = () => {
        let request: IDBRequest;
        db = open.result;
        if ([...db.objectStoreNames].find((name) => name === store)) {
            const transaction = db.transaction(store, 'readwrite');
            const objectStore = transaction.objectStore(store);
            if (key === 'all') request = objectStore.clear();
            else request = objectStore.delete(key);
            request.onerror = () => console.error(request.error);
            transaction.oncomplete = () => db.close();
        } else {
            indexedDB.deleteDatabase('data');
        }
    };
};