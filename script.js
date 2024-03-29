// Creation des variables (const = qu'on ne peut pas changer) 

let message = document.querySelector(".message-container");
const taskInput = document.querySelector(".task-input input"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clear-btn"),
    taskBox = document.querySelector(".task-box");
addbtn = document.querySelector(".add-btn");

let editId,
    isEditTask = false,
    todos = JSON.parse(localStorage.getItem("todo-list"));

//Sert à filtrer
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

 // Fonction pour afficher les données sauvegarder a chaque ouverture du navigateur ou rafraichissement de la page
function showTodo(filter) {
    let liTag = "";
    if (todos) {
        todos.forEach((todo, id) => {
            //Verifie l'etat de la tache (en cours, terminée) et les filtres 
            let completed = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Modifier</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Supprimer</li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>Vous n'avez aucune tâche ici</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodo("all");

 // Fonction pour afficher le menu pour afficher les boton modifier et supprimer
function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

//Fonction de mise à jour de la tâche
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
}

//Fonction pour la modification de la tâche
function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

//Fonction supprimer
function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
    message.classList.toggle("error");
    message.textContent = "Tâche supprimée";

    setTimeout(() => {
        message.classList.toggle("error");
    }, 2000);
}

//Supprimer toutes les taches
clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo()

    message.classList.toggle("ended");
    message.textContent = "Toutes les tâches ont été supprimées";

    setTimeout(() => {
        message.classList.toggle("ended");
    }, 2000);
});

//Evenement pour modifier une tache
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);

        message.classList.toggle("success");
        message.textContent = "Tâche Modifiée";

        setTimeout(() => {
            message.classList.toggle("success");
        }, 2000);
    }
});

// Creation de la fonction ajouter (lorsque l'on click sur le bouton ajouter)
function add(e) {

    // si l'utilisateur n'ecris rien il y'aura cette alert
    if (taskInput.value === '') {
        message.classList.toggle("alert");
        message.textContent = "Tu dois écrire quelque chose!";

        setTimeout(() => {
            message.classList.toggle("alert");
        }, 2000);
    }

    // sinon la fonction s'execute en créant un nouveau li (liste)
    else {

        
        let userTask = taskInput.value.trim();

        if (!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo);
            message.classList.toggle("success");
            message.textContent = "Tâche ajoutée";

            setTimeout(() => {
                message.classList.toggle("success");
            }, 2000);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
        }

        // récuperation de la valeur saisie
        taskInput.value = "";

        // Fonction qui sauvegarde les données
        localStorage.setItem("todo-list", JSON.stringify(todos));

       
        showTodo(document.querySelector("span.active").id);
    }


}