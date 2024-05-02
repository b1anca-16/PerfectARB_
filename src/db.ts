import { openDB, DBSchema } from 'idb';

interface Task {
    date: Date,
    text: string,
    project: string
}

interface MyDBSchema extends DBSchema {
    projects: {
        key: string;
        value: Task;
    };
    entrys: {
        key: string;
        value: Task;
    };
};

export const startDB = function () {
    console.log("Aufruf startDB");
    let db!: IDBDatabase;
    const request = indexedDB.open('tasks', 1);
    request.onerror = (err) => console.error(`IndexedDB error: ${request.error}`, err);
    request.onsuccess = () => (db = request.result);
    request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
        
        if (!db.objectStoreNames.contains('entrys')) {
            const entrysStore = db.createObjectStore('entrys', { autoIncrement: true });
            entrysStore.createIndex('date', 'date', { unique: false });
            entrysStore.createIndex('project', 'project', { unique: false });
            entrysStore.createIndex('text', 'text', { unique: false });
        }
    };
    return db;
};

export async function addItemToStore(tasks: Task[]) {
    console.log(tasks);
    // Öffne die IndexedDB-Datenbank oder erstelle sie, falls sie noch nicht existiert
    const request = indexedDB.open('tasks', 1);
    
    return new Promise<void>((resolve, reject) => {
        request.onerror = (err) => {
            console.error(`IndexedDB error: ${request.error}`, err);
            reject(err);
        };
        
        request.onsuccess = () => {
            console.log("Sucess");
            const db = request.result;
            const transaction = db.transaction(['entrys'], 'readwrite');
            const store = transaction.objectStore('entrys');
            console.log(store);
            
            // Füge jeden Task einzeln der Datenbank hinzu
            for (const task of tasks) {
                const request = store.add(task);
                request.onerror = (err) => {
                    console.error('Fehler beim Hinzufügen des Tasks:', err);
                    reject(err);
                };
            }
            
            transaction.oncomplete = () => {
                console.log('Tasks erfolgreich hinzugefügt.');
                resolve();
            };
        };
    });
}


export const addTask = (payload: Task) => {
    const store = "tasks";
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

export const addProject = (payload: Project) => {
    const store = "projects";
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