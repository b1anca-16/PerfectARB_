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

export const exportArr: ProjectExport[] = [];
export let projectsString: String = "";


  export function makeExport() {
    projectsString = "";
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
        makeString(projectExp);
        console.log(exportArr);
    })
  }

  function makeString(project: ProjectExport) {
    let projString: String = `Projekt: ${project.project.text} \n`;
    project.tasks.forEach(task => {
      projString += `- ${task.text} (${task.mandays} PT)\n`;
    });
    projectsString += `${projString} \n`;
  }

