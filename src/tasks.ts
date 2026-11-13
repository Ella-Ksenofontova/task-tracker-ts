import type { Priority, Result, Task, TaskPatch, TaskStatus } from "./models.js";
import { parseTitle, parsePriority } from "./validation.js";
import {findById} from "./utils.js";


let currentTaskId = 1;
let tasks: Task[] = [];

export function createTask(rawTitle: unknown, priority: Priority): Result<Task> {
    const titleResult = parseTitle(rawTitle);
    const priorityResult = parsePriority(priority);

    if (!titleResult.ok) {
        return titleResult;
    }

    if (!priorityResult.ok) {
        return priorityResult;
    }

    const newTask: Task = {
        id: currentTaskId++,
        title: titleResult.value,
        priority: priorityResult.value,
        status: "todo"
    };

    tasks.push(newTask);

    return {
        ok: true,
        value: Object.assign({}, newTask)
    };
}

export function updateTask(id: number, patch: TaskPatch): Result<Task> {
    const task = findById(tasks, id);
    if (!task) {
        return {
            ok: false,
            error: "Задания с таким id не существует"
        };
    }

    if (patch.title !== undefined) {
        const titleResult = parseTitle(patch.title);
        if (!titleResult.ok) {
            return titleResult;
        }
        task.title = titleResult.value;
    }
    if (patch.priority !== undefined) {
        const priorityResult = parsePriority(patch.priority);
        if (!priorityResult.ok) {
            return priorityResult;
        }
        task.priority = priorityResult.value;
    }
    return {
        ok: true,
        value: Object.assign({}, task)
    };
}

export function changeStatus(id: number, status: TaskStatus): Result<Task> {
    const task = findById(tasks, id);
    if (!task) {
        return {
            ok: false,
            error: "Задания с таким id не существует"
        };
    }   

    if (status !== "todo" && status !== "doing" && status !== "done") {
        return {
            ok: false,
            error: "Недопустимый статус"
        };
    }

    task.status = status;

    return {
        ok: true,
        value: Object.assign({}, task)
    };
}

export function findTask(id: number): Task | undefined {
    const result = findById(tasks, id);
    return result === undefined ? undefined : Object.assign({}, result);
}

export function listTasks(status?: TaskStatus): Task[] {
    if (status) {
        return tasks.filter(task => task.status === status);
    }

    return tasks;
}

export function getStats(): Record<TaskStatus, number> {
    return {
        "todo": tasks.filter(task => task.status === "todo").length,
        "doing": tasks.filter(task => task.status === "doing").length,
        "done": tasks.filter(task => task.status === "done").length
    }
}