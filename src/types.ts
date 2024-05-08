interface Task {
    id: String
    date: Date,
    text: string,
    project: Project,
    mandays: Number
}

interface Project {
    text: string,
    color: string
}