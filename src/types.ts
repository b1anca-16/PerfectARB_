interface Task {
    date: Date,
    text: string,
    project: Project
}

interface Project {
    text: string,
    color: string
}