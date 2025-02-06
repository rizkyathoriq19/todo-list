import ui from './ui.js';

export default window.customElements.define(
    'todo-list',
    class extends HTMLElement {
        constructor() {
            super();
            this.todoItems = [];
            this.doneItems = [];
            this.overdueItems = [];
        }

        getDueDate(priority) {
            const days = {
                low: 7,
                medium: 5,
                high: 3
            }[priority] || 7;

            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + days);
            return dueDate;
        }

        isOverdue(dueDate) { 
            const now = new Date();
            return now > dueDate;
        }

        createProfile() {
            const profileContainer = document.createElement('div');
            profileContainer.classList.add('todo__profile');

            const profileImage = document.createElement('img');
            profileImage.classList.add('todo__profile-image');
            profileImage.setAttribute('src', './avatar.png');
            profileImage.setAttribute('alt', 'Profile Image');

            const profileName = document.createElement('h1');
            profileName.classList.add('todo__profile-name');
            profileName.textContent = 'Muhamad Rizky Athoriq';

            const profileJob = document.createElement('h2');
            profileJob.classList.add('todo__profile-job');
            profileJob.textContent = 'Full Stack Web Developer';

            profileContainer.append(profileImage, profileName, profileJob);
            return profileContainer;
        }

        createFormList() {
            const self = this;

            const form = document.createElement('form');
            form.classList.add('todo__form');

            const title = document.createElement('h1');
            title.classList.add('todo__title');
            title.textContent = 'To Do';

            const submitText = document.createElement('div');
            submitText.classList.add('todo__submit');

            const input = document.createElement('input');
            input.classList.add('todo__input');
            input.setAttribute('type', 'text');
            input.setAttribute('placeholder', 'Input something here...');
            // input.setAttribute('maxlength', '20');

            const prioritySelect = document.createElement('select');
            prioritySelect.classList.add('todo__priority');
            ["low", "medium", "high"].forEach((priority) => {
                const option = document.createElement('option');
                option.setAttribute('value', priority);
                option.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
                prioritySelect.append(option);
            });

            const button = document.createElement('button');
            button.classList.add('todo__button');
            button.setAttribute('type', 'submit');
            button.textContent = 'Submit';

            const listSubmit = document.createElement('div');
            listSubmit.classList.add('todo__list');

            const clearAllTodo = document.createElement('div');
            clearAllTodo.classList.add('todo__clear-all');

            const clearAllButton = document.createElement('button');
            clearAllButton.classList.add('todo__clear-all-button');
            clearAllButton.setAttribute('type', 'button');
            clearAllButton.textContent = 'Clear Todo';

            const listTodo = document.createElement('ul');
            listTodo.classList.add('todo__list-result');

            submitText.append(input, prioritySelect, button);
            clearAllTodo.append(clearAllButton);
            listSubmit.append(listTodo);
            form.append(title, submitText, clearAllTodo, listSubmit);

            button.addEventListener('click', (e) => {
                e.preventDefault();

                self.addTodo(input.value, prioritySelect.value);
                input.value = '';
            });

            clearAllButton.addEventListener('click', () => { 
                self.todoItems = [];
                self.renderTodoList();
            });

            return form;
        }

        createFormDone() {
            const self = this;

            const form = document.createElement('form');
            form.classList.add('todo__formDone');

            const wrapperDone = document.createElement('div');
            wrapperDone.classList.add('done__wrapper');

            const title = document.createElement('h1');
            title.classList.add('done__title');
            title.textContent = 'Done';

            const wrapperButton = document.createElement('div');
            wrapperButton.classList.add('done__wrapper-button');

            const clearAllButton = document.createElement('button');
            clearAllButton.classList.add('done__clear-all-button');
            clearAllButton.setAttribute('type', 'button');
            clearAllButton.textContent = 'Clear Done';

            const listDone = document.createElement('ul');
            listDone.classList.add('done__list');

            wrapperButton.append(clearAllButton);
            wrapperDone.append(title, wrapperButton, listDone);
            form.append(wrapperDone);

            clearAllButton.addEventListener('click', () => { 
                self.doneItems = [];
                self.renderDoneList();
            });
            
            return form;
        }

        createFormOverdue() { 
            const self = this;

            const form = document.createElement('form');
            form.classList.add('todo__formOverdue');

            const wrapperOverdue = document.createElement('div');
            wrapperOverdue.classList.add('overdue__wrapper');

            const title = document.createElement('h1');
            title.classList.add('overdue__title');
            title.textContent = 'Overdue';

            const wrapperButton = document.createElement('div');
            wrapperButton.classList.add('overdue__wrapper-button');

            const clearAllButton = document.createElement('button');
            clearAllButton.classList.add('overdue__clear-all-button');
            clearAllButton.setAttribute('type', 'button');
            clearAllButton.textContent = 'Clear Overdue';
            
            const listDone = document.createElement('ul');
            listDone.classList.add('overdue__list');

            wrapperButton.append(clearAllButton);
            wrapperOverdue.append(title, wrapperButton, listDone);
            form.append(wrapperOverdue);

            clearAllButton.addEventListener('click', () => { 
                self.overdueItems = [];
                self.renderOverdueList();
            });

            return form;
        }

        addTodo(todoText, priority) {
            const self = this;

            if (todoText.trim() !== '') {
                const dueDate = self.getDueDate(priority);
                self.todoItems.push({ text: todoText, priority: priority, completed: false, dueDate });
                self.renderTodoList();
            }
        }

        renderTodoList() {
            const self = this;
            
            const listTodo = self.querySelector('.todo__list-result');
            listTodo.innerHTML = '';

            self.todoItems.forEach((item, index) => { 
                const li = document.createElement('li');
                li.classList.add(`priority__${item.priority}`);

                if (self.isOverdue(item.dueDate)) {
                    self.markAsOverdue(index);
                }

                const wrapperText = document.createElement('div');
                wrapperText.classList.add('todo__list-wrapper-text');

                const checkbox = document.createElement('input');
                checkbox.classList.add('todo__checkbox');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.checked = item.completed;

                checkbox.addEventListener('change', () => {
                    self.toggleComplete(index);
                });

                const taskText = document.createElement('span');
                taskText.classList.add('todo__task-text');
                taskText.textContent = item.text;

                const prioritySpan = document.createElement('span');
                prioritySpan.classList.add('todo__task-priority');
                prioritySpan.textContent = `Prioritas: ${item.priority}`;

                const dateSpan = document.createElement('span');
                dateSpan.classList.add('todo__task-date');
                dateSpan.textContent = `Submit: ${self.updateDate()}`;
                
                if (item.completed) {
                    taskText.classList.add('todo__completed');
                    prioritySpan.classList.add('todo__completed');
                    dateSpan.classList.add('todo__completed');
                }

                const wrapperButton = document.createElement('div');
                wrapperButton.classList.add('todo__list-wrapper-button');

                const doneButton = document.createElement('button');
                doneButton.classList.add('todo__done-button');
                doneButton.setAttribute('type', 'button');
                doneButton.textContent = 'Done';

                doneButton.addEventListener('click', () => { 
                    self.markAsDone(index);
                })

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('todo__delete-button');
                deleteButton.setAttribute('type', 'button');
                deleteButton.textContent = 'Delete';

                deleteButton.addEventListener('click', () => { 
                    self.deleteTodo(index);
                });

                wrapperText.append(taskText, prioritySpan, dateSpan);
                wrapperButton.append(doneButton, deleteButton);
                li.append(checkbox, wrapperText, wrapperButton);
                listTodo.appendChild(li);
            })

            if (!self.updateInterval) {
                self.updateInterval = setInterval(() => {
                    self.renderTodoList();
                }, 1000 * 60 * 24);
            }
        }

        renderDoneList() {
            const self = this; 
            const listDone = self.querySelector('.done__list');
            listDone.innerHTML = '';

            self.doneItems.forEach((item) => {
                const li = document.createElement('li');

                const wrapperText = document.createElement('div');
                wrapperText.classList.add('done__list-wrapper-text');

                const taskDone = document.createElement('span');
                taskDone.classList.add('done__task-text');
                taskDone.textContent = item.text;

                const priorityDone = document.createElement('span');
                priorityDone.classList.add('done__task-priority');
                priorityDone.textContent = `Prioritas: ${item.priority}`;

                const dateDone = document.createElement('span');
                dateDone.classList.add('done__task-date');
                dateDone.textContent = `Done: ${self.updateDate()}`;

                wrapperText.append(taskDone, priorityDone, dateDone);
                li.append(wrapperText);
                
                listDone.appendChild(li);
            })
        }

        renderOverdueList() {
            const self = this; 
            const listOverdue = self.querySelector('.overdue__list');
            listOverdue.innerHTML = '';

            self.overdueItems.forEach((item) => {
                const li = document.createElement('li');

                const wrapperText = document.createElement('div');
                wrapperText.classList.add('overdue__list-wrapper-text');

                const taskOverdue = document.createElement('span');
                taskOverdue.classList.add('overdue__task-text');
                taskOverdue.textContent = item.text;

                const priorityOverdue = document.createElement('span');
                priorityOverdue.classList.add('overdue__task-priority');
                priorityOverdue.textContent = `Prioritas: ${item.priority}`;

                const dateOverdue = document.createElement('span');
                dateOverdue.classList.add('overdue__task-date');
                dateOverdue.textContent = `Done: ${self.updateDate()}`;

                wrapperText.append(taskOverdue, priorityOverdue, dateOverdue);
                li.append(wrapperText);
                
                listOverdue.appendChild(li);
            })
        }

        markAsDone(index) { 
            const self = this;

            const doneItem = self.todoItems.splice(index, 1)[0];
            doneItem.completed = true;
            self.doneItems.push(doneItem);
            self.renderTodoList();
            self.renderDoneList();
        }

        markAsOverdue(index) { 
            const self = this;

            const overdueItem = self.todoItems.splice(index, 1)[0];
            overdueItem.completed = true;
            self.overdueItems.push(overdueItem);
            self.renderTodoList();
            self.renderOverdueList();
        }

        toggleComplete(index) {
            const self = this;

            self.todoItems[index].completed = !self.todoItems[index].completed;
            self.renderTodoList();
        }

        deleteTodo(index) {
            const self = this;

            self.todoItems.splice(index, 1);
            self.renderTodoList();
        }

        updateDate() {
            const now = new Date();
            
            const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
            const today = days[now.getDay()];
            
            const day = String(now.getDate()).padStart(2, '0');    
            const month = String(now.getMonth() + 1).padStart(2, '0'); 
            const year = now.getFullYear();

            const dateString = `${day}-${month}-${year}`; 

            const timeString = `${today}, ${dateString}`;

            return timeString;
        }

        connectedCallback() {
            const self = this;

            self.classList.add('todo-list');
            
            const updateToday = document.createElement('div');
            updateToday.classList.add('todo__updateToday');
            
            const formsContainer = document.createElement('div');
            formsContainer.classList.add('todo__forms-container');
            
            const timeString = self.updateDate();
            const profile = self.createProfile();
            const formList = self.createFormList();
            const formDone = self.createFormDone();
            const formOverdue = self.createFormOverdue();
            
            updateToday.append(timeString);
            formsContainer.append(formList, formDone, formOverdue);

            self.append(updateToday, profile, formsContainer);

            self._listeners = {
                
                'screen-resize': () => { 
                    const formsContainer = this.querySelector(".todo__forms-container");
                    const updateToday = this.querySelector(".todo__updateToday");
                    const profile = this.querySelector(".todo__profile");

                    if (ui.isTablet()) {
                        formsContainer.classList.add("tablet");
                        formsContainer.classList.remove("mobile");
                        updateToday.classList.remove("mobile");
                        profile.classList.remove("mobile");
                    } else if (ui.isMobile()) {
                        formsContainer.classList.add("mobile");
                        formsContainer.classList.remove("tablet");
                        updateToday.classList.add("mobile");
                        profile.classList.add("mobile");
                    } else {
                        formsContainer.classList.remove("mobile", "tablet");
                        updateToday.classList.remove("mobile");
                        profile.classList.remove("mobile");
                    }
                }
            }
            
            ui.addEventListener('screen-resize', self._listeners['screen-resize']);
            self._listeners['screen-resize']();

            self.clockInterval = setInterval(() => {
                self.updateDate();
            }, 1000 * 60 * 24);
            
        }

        disconnectedCallback() {
            const self = this;
            if (self.updateInterval) {
                clearInterval(self.updateInterval);
            }

            if (self.clockInterval) {
                clearInterval(self.clockInterval);
            }

            ui.removeEventListener('screen-resize', self._listeners['screen-resize']);
        }
    }
);
