import { getStorageProjects, getStorageTasks } from "./db";

type ProjectExport = {
  project: Project;
  tasks: Task[];
};


const projects: Project[] = getStorageProjects();
const tasksString: Task[] = getStorageTasks();

const tasks = tasksString.map(task => {
  const date = new Date(task.date)
  task.date = date;
  return task;
});

export let exportArr: ProjectExport[] = [];
export let projectsString: String = "";


  export function makeExport() {
    projectsString = "";
    exportArr = [];
    projects.map(project => {
        const matchingTasks: Task[] = tasks.filter(task => {
            return task.project.text == project.text;
        })
        
        matchingTasks.sort(function(a, b){return a.date.getTime() - b.date.getTime()});
        const projectExp : ProjectExport = {
          project: project,
          tasks: matchingTasks
        }
        exportArr.push(projectExp);
    })
    exportArr = concatSameTasks(exportArr);
    toMandays(exportArr);
    exportArr.forEach(project => {
      makeString(project);
    })
  }

  function toMandays(array: ProjectExport[]) {
    return array.forEach(project => {
      project.tasks.map(task => {
        task.mandays = round(task.mandays / 8);
      })
    })
  }

  function round (num: number) {
    return Math.round(num * 100) / 100;
}

  function concatSameTasks(array: ProjectExport[]) {
    const exportArray: ProjectExport[] = [];
    array.forEach(item => {
      const mergedTasksMap : {[title: string] : Task} = {};
      item.tasks.forEach(task => {
        const existingTask = mergedTasksMap[task.text];
        if(existingTask) {
          existingTask.mandays += task.mandays;
        } else {
          mergedTasksMap[task.text] = {...task};
        }
      })
      const mergedTasks: Task[] = Object.values(mergedTasksMap);
      const exportItem: ProjectExport = {
        project: item.project,
        tasks: mergedTasks,
      }
      exportArray.push(exportItem);
    })
    return exportArray;
  }

  function makeString(project: ProjectExport) {
    let projString: String = `Projekt: ${project.project.text} \n`;
    project.tasks.forEach(task => {
      projString += `- ${task.text} (${task.mandays} PT)\n`;
    });
    projectsString += `${projString} \n`;
  }

