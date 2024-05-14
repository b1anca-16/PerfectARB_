
interface Task {
    id: String,
    date: Date,
    text: string,
    project: Project,
    mandays: number
}

export function setStorageTask(tasks: Task[]) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


export function getStorageTasks() {
    const storedTasksString = localStorage.getItem('tasks');
    const storedTasks: Task[] = storedTasksString ? JSON.parse(storedTasksString) : [];
    return storedTasks;
}
export function setStorageProjects(project: Project[]) {
    localStorage.setItem('project', JSON.stringify(project));
}

export function getStorageProjects() {
    const storedProjectsString = localStorage.getItem('project');
    const storedProjects: Project[] = storedProjectsString ? JSON.parse(storedProjectsString) : [];
    return storedProjects;
}

export function setCurrentDate(currentDate: Date) {
    localStorage.setItem('currentDate', JSON.stringify(currentDate));
}

export function getCurrentDate() {
    const storedTasksString = localStorage.getItem('currentDate');
    const date: Date = new Date (JSON.parse(storedTasksString));
    return date;
}

// Localstorage beispiel

/*
let lArr: Array<{id: string, text: string, projectId: string}> = [];
localStorage.setItem("projects", JSON.stringify(lArr))

function parseLocalstorage(){
    const stringData = localStorage.getItem("projects");
    const jsData = JSON.parse(stringData);

    return jsData;
}

function syncLocalstorage(){
    localStorage.setItem("projects", JSON.stringify(lArr))
}

lArr  = parseLocalstorage() as  Array<{id: string, text: string, projectId: string}>;
lArr.push({ 
    id: crypto.randomUUID(),
    text: "string",
    projectId: "a"})
    lArr.push({ 
        id: crypto.randomUUID(),
        text: "string",
        projectId: "b"})
    syncLocalstorage();

    function filterForProject(projectIdFilter:string){
        return lArr.filter((item)=>item.projectId === projectIdFilter)
    }

    console.log(filterForProject("b"))
*/

    /*

export const startDB = function () {
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

export async function addItemToStore(task: Task) {
    console.log(task);
    // Öffne die IndexedDB-Datenbank oder erstelle sie, falls sie noch nicht existiert
    const request = indexedDB.open('tasks', 1);
    
    return new Promise<void>((resolve, reject) => {
        request.onerror = (err) => {
            console.error(`IndexedDB error: ${request.error}`, err);
            reject(err);
        };
        
        request.onsuccess = () => {
            console.log("Success");
            const db = request.result;
            const transaction = db.transaction(['entrys'], 'readwrite');
            const store = transaction.objectStore('entrys');
            
            // Füge die einzelne Task zur Datenbank hinzu
            const addRequest = store.add(task);
            addRequest.onerror = (err) => {
                console.error('Fehler beim Hinzufügen der Task:', err);
                reject(err);
            };
            addRequest.onsuccess = () => {
                resolve();
            };
        };
    });
}

export async function getAllTasks() {
    // Öffne die IndexedDB-Datenbank oder erstelle sie, falls sie noch nicht existiert
    const request = indexedDB.open('tasks', 1);
    
    return new Promise<Task[]>((resolve, reject) => {
        request.onerror = (err) => {
            console.error(`IndexedDB error: ${request.error}`, err);
            reject(err);
        };
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['entrys'], 'readonly');
            const store = transaction.objectStore('entrys');
            
            // Rufe alle Einträge aus dem Objektstore ab
            const getAllRequest = store.getAll();
            getAllRequest.onerror = (err) => {
                console.error('Fehler beim Abrufen der Einträge:', err);
                reject(err);
            };
            getAllRequest.onsuccess = () => {
                const tasks: Task[] = getAllRequest.result;
                resolve(tasks);
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
*/

