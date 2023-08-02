import "./style.scss";

type Task = {
  text: string;
  id: number;
  completed: boolean;
};

let state = {
  tasks: [] as Task[],
  mode: "light" as "light" | "dark",
  filter: "all" as "all" | "active" | "complete",
  counter: 0,
};

const taskForm = document.querySelector(".form-create") as HTMLFormElement;

const taskInput = document.querySelector("[name='todo']") as HTMLInputElement;

const taskList = document.querySelector(".task-list") as HTMLUListElement;

const taskClearBtn = document.querySelector(".task-clear") as HTMLButtonElement;

const taskCreateBtn = document.querySelector(
  ".form-create__btn"
) as HTMLButtonElement;

const filters = document.querySelectorAll(".filter");

const filterAll = document.querySelector(".filter--all") as HTMLButtonElement;

const filterActive = document.querySelector(
  ".filter--active"
) as HTMLButtonElement;

const filterCompleted = document.querySelector(
  ".filter--completed"
) as HTMLButtonElement;

const activeCount = document.querySelector(".active-count");

const modeBtn = document.querySelector(".btn-mode");

const body = document.querySelector("body");

const modeIcon = document.querySelector(".icon-mode");

const addTask = function (task: string) {
  const tasks = [...state.tasks];
  const counter = state.counter;

  tasks.push({ text: task, id: counter, completed: false });

  state = { ...state, tasks: tasks, counter: counter + 1 };

  taskList.insertAdjacentHTML(
    "beforeend",
    `<li class="bg-task task-item"
    data-id = ${counter}
    >
  <form class="form-complete">
    <input
      class="task checkbox"
      type="checkbox"
      name="checkbox--${counter}"
      id="checkbox--${counter}"
    />
  </form>
  <div class="task task-text">${task}</div>
  <button class="btn-delete">
    <img src="/images/icon-cross.svg" alt="Cross icon" />
  </button>
</li>`
  );

  countActiveTasks();
};

const deleteTask = function (id: number) {
  const tasks = [...state.tasks].filter((task) => task.id !== id);

  state = { ...state, tasks: tasks };

  taskList.querySelector(`[data-id='${id}']`)?.remove();

  countActiveTasks();
};

const completeTask = function (id: number, isComplete: boolean) {
  const tasks = [...state.tasks];

  const task = tasks.find((task) => task.id === id);

  if (!task) return;

  task.completed = isComplete;

  const taskEl = taskList.querySelector(`[data-id='${id}']`);

  isComplete
    ? taskEl?.classList.add("complete-task")
    : taskEl?.classList.remove("complete-task");

  state = { ...state, tasks: tasks };

  countActiveTasks();
};

const clearTasks = function () {
  const activeTasks = state.tasks.filter((task) => !task.completed);
  const completedTasks = state.tasks.filter((task) => task.completed);

  completedTasks.forEach((task) => {
    taskList.querySelector(`[data-id='${task.id}']`)?.remove();
  });

  state = { ...state, tasks: activeTasks };

  countActiveTasks();
};

const filterTasks = function (filter: "all" | "active" | "complete") {
  const taskEls = taskList.querySelectorAll(".task-item");

  taskEls.forEach((taskEl) => {
    taskEl.classList.remove("hide-task");
  });

  if (state.filter === filter) {
    state = { ...state, filter: "all" };

    setCurrFilter("all");

    return;
  }

  state.filter = filter;

  if (filter === "all") {
    setCurrFilter("all");
    return;
  }

  if (filter === "active") {
    setCurrFilter("active");

    const taskEls = state.tasks
      .filter((task) => task.completed)
      .map(({ id }) => taskList.querySelector(`[data-id='${id}']`));

    if (!taskEls) return;

    taskEls.forEach((taskEl) => {
      taskEl && taskEl.classList.add("hide-task");
    });
  }

  if (filter === "complete") {
    setCurrFilter("complete");

    const taskEls = state.tasks
      .filter((task) => !task.completed)
      .map(({ id }) => taskList.querySelector(`[data-id='${id}']`));

    if (!taskEls) return;

    taskEls.forEach((taskEl) => {
      taskEl && taskEl.classList.add("hide-task");
    });
  }
};

const setCurrFilter = function (filter: "all" | "active" | "complete") {
  filters.forEach((filter) => filter.classList.remove("filter--current"));

  if (filter === "all") {
    filterAll.classList.add("filter--current");
  }

  if (filter === "active") {
    filterActive.classList.add("filter--current");
  }

  if (filter === "complete") {
    filterCompleted.classList.add("filter--current");
  }
};

const countActiveTasks = function () {
  const taskEls = state.tasks
    .filter((task) => !task.completed)
    .map(({ id }) => taskList.querySelector(`[data-id='${id}']`));

  const activeTasksCount = taskEls.length;

  activeCount?.textContent &&
    (activeCount.textContent = activeTasksCount.toString());
};

taskCreateBtn.addEventListener("click", function (event: any) {
  event.preventDefault();

  if (taskInput.value === "") return;

  addTask(taskInput.value);

  taskInput.value = "";
});

taskForm?.addEventListener("keydown", function (event: any) {
  if (event.key === "Enter") {
    if (taskInput.value === "") return;
    event.preventDefault();

    addTask(taskInput.value);

    taskInput.value = "";
  }
});

taskList.addEventListener("click", function (event: any) {
  const btnDelete = event.target.closest(".btn-delete");

  if (!btnDelete) return;

  const id = btnDelete.closest(".task-item").dataset.id as string;

  deleteTask(+id);
  // completeTask(+id);
});

taskList.addEventListener("input", function (event: any) {
  const input = event.target;

  if (!input.classList.contains("checkbox")) return;

  const id = input.closest(".task-item").dataset.id as string;

  completeTask(+id, input.checked);
});

taskClearBtn.addEventListener("click", function (event: any) {
  event.preventDefault();

  clearTasks();
});

filterActive.addEventListener("click", function () {
  filterTasks("active");
});

filterCompleted.addEventListener("click", function () {
  filterTasks("complete");
});

filterAll.addEventListener("click", function () {
  filterTasks("all");
});

modeBtn?.addEventListener("click", function () {
  if (state.mode === "dark") {
    state.mode = "light";

    body?.classList.remove("dark-theme");

    modeIcon?.setAttribute("src", "images/icon-moon.svg");

    // pageBgImg?.setAttribute("src", "images/bg-mobile-light.jpg");
  } else if (state.mode === "light") {
    state.mode = "dark";

    body?.classList.add("dark-theme");

    modeIcon?.setAttribute("src", "images/icon-sun.svg");

    // pageBgImg?.setAttribute("src", "images/bg-mobile-dark.jpg");
  }
});
