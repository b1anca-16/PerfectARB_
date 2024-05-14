interface Task {
    id: String
    date: Date,
    text: string,
    project: Project,
    mandays: number
}

interface Project {
    text: string,
    color: string
}