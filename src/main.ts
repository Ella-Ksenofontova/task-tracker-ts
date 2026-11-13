import {listTasks, getStats, createTask, findTask, updateTask, changeStatus} from './tasks.js';

// Тест 1

const tasks = listTasks();
const stats = getStats();
const statsExample = {todo: 0, doing: 0, done: 0};

if (tasks.length > 0) {
    throw new Error("При запуске программы список задач не пустой!");
}

if (JSON.stringify(stats) !== JSON.stringify(statsExample)) {
    throw new Error("При запуске программы статистика задач не пустая!");
}

// Тест 2

const newTask = createTask(' Разобрать union ', "normal");
const newTaskExample = {id: 1, title: 'Разобрать union', priority: "normal", status: "todo"};

if (!newTask.ok) {
    throw new Error("Создание задачи завершилось с ошибкой!");
}

if (JSON.stringify(newTask.value) !== JSON.stringify(newTaskExample)) {
    throw new Error("Созданная задача не соответствует эталону!");
}

// Тест 3
for (let incorrectValue of [null, 42, "   "]) {
    const incorrectTask = createTask(incorrectValue, "normal");
    if (incorrectTask.ok) {
        throw new Error("Создана некорректная задача!");
    }
}

// Тест 4
let longString = "a".repeat(80);
const longNamedTask = createTask(longString, "normal");

if (!longNamedTask.ok) {
    throw new Error("Задача с заголовком допустимой длины не была создана!");
}

const tooLongNamedTask = createTask(longString + "a", "normal");
if (tooLongNamedTask.ok) {
    throw new Error("Создана задача с заголовком недопустимой длины!");
}

// Тест 5
const correctPriorityTask = createTask("Задача с корректным приоритетом", "normal");
if (!correctPriorityTask.ok) {
    throw new Error("Задача с корректным приоритетом не была создана!");
}

const incorrectPriorityTask = createTask("Задача с некорректным приоритетом", "urgent");
if (incorrectPriorityTask.ok) {
    throw new Error("Создана задача с некорректным приоритетом (строка, не входящая в тип Priority)!");
}

const nullPriorityTask = createTask("Задача с некорректным приоритетом", null);
if (nullPriorityTask.ok) {
    throw new Error("Создана задача с некорректным приоритетом (null)!");
}

// Тест 6

const nonExistingTask = findTask(999);
if (nonExistingTask !== undefined) {
    throw new Error("Найдена несуществующая задача!");
}

const nonExistingTaskUpdate = updateTask(999, {title: "Обновление несуществующей задачи"});
if (nonExistingTaskUpdate.ok) {
    throw new Error("Обновлена несуществующая задача!");
}

// Тест 7

const incorrectPatch = updateTask(1, {title: " ", priority: "high"});
const taskAfterIncorrectPatch = findTask(1);

if (incorrectPatch.ok || taskAfterIncorrectPatch?.priority === "high") {
    throw new Error("Некорректный патч привёл к изменению задания!")
}

// Тест 8

const emptyPatch = updateTask(1, {});
if (!emptyPatch.ok) {
    throw new Error("Обновление задачи с пустым патчем не прошло!");
}

const sameStatusPatch = changeStatus(1, "todo");
if (!sameStatusPatch.ok) {
    throw new Error("Обновление задачи с тем же статусом не прошло!");
}

// Тест 9

const taskWithDoingStatus = createTask("Задача со статусом doing", "normal");

if (!taskWithDoingStatus.ok) {
    throw new Error("Задача, статус которой планировалось изменить на 'doing', не была создана!");
}

changeStatus(taskWithDoingStatus.value.id, "doing");

const taskWithDoneStatus = createTask("Задача со статусом done", "normal");

if (!taskWithDoneStatus.ok) {
    throw new Error("Задача, статус которой планировалось изменить на 'done', не была создана!");
}

changeStatus(taskWithDoneStatus.value.id, "done");

const updatedStats = getStats();
if (updatedStats.doing !== 1 || updatedStats.done !== 1) {
    throw new Error("Статистика после обновления задач некорректна!");
}

// Тест 10

const firstTask = findTask(1);
if (firstTask) firstTask.title = "Обновленный заголовок первой задачи";

const firstTaskAfterUpdate = findTask(1);
if (firstTaskAfterUpdate && firstTaskAfterUpdate.title === "Обновленный заголовок первой задачи") {
    throw new Error("Заголовок первой задачи был изменен напрямую, что недопустимо!");
}