
    let taskInput = document.getElementById("taskInput");
    const addBtn = document.getElementById("addBtn");
    let taskList = document.getElementById("taskList");
    let selectElement = document.getElementById("categorySelect");

    // Kategoriler -->
    const category = ["İş","Kişisel","Alışveriş",];

    // Sürükleme özelliği ve ayarları
    new Sortable(taskList,{
      animation: 150,  
      ghostClass: "dragging",
    });

    // Kısa ve Düzgün localStorage kullanımı için ayrı fonksiyon
    function saveTasks() {
      let tasks = [];
      document.querySelectorAll("#taskList li").forEach(li => {
        let text = li.querySelector("span:not(.category-label)").textContent;
        let done = li.classList.contains("completed");
        let category = li.querySelector(".category-label").textContent.replace(/\[|\]/g,"").trim();
        tasks.push({ text, done, category });
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            createTaskElement(task.text, task.category, task.done);
        });
    }

    // Görev Oluşturma 
    function createTaskElement(value, selectedCategory, isDone=false){
        let li = document.createElement("li");

        let categorySpan = document.createElement("span");
        categorySpan.className = "category-label";
        categorySpan.textContent = `[${selectedCategory}] `;
        li.prepend(categorySpan);

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = isDone;

        let span = document.createElement("span");
        span.textContent = value;

        let delBtn = document.createElement("button");
        delBtn.textContent = "Sil";

        let editBtn = document.createElement("button");
        editBtn.textContent = "Düzenle";

        if(isDone) li.classList.add("completed");

        checkbox.addEventListener("change",function(){
            if(this.checked){
                li.classList.add("completed");
            }else{
                li.classList.remove("completed");
            }
            saveTasks();
        });

        delBtn.addEventListener("click",function(){
            li.remove();
            saveTasks();
        });

        editBtn.addEventListener("click",()=>{
            span.contentEditable = true;
            span.addEventListener("keydown", function(e){
                if(e.key === "Enter"){
                    e.preventDefault();
                    span.contentEditable = false;
                    saveTasks();
                }
            });
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
        li.appendChild(editBtn);

        taskList.appendChild(li);

        saveTasks();
    }


    for(let i = 0; i < category.length; i++){
      let option = document.createElement("option");
      option.value = category[i];
      option.textContent = category[i];
      selectElement.appendChild(option);
    }

    function addTask(){
        if(!taskInput.value) return;
        let value = taskInput.value;
        let selectedCategory = selectElement.value;
        createTaskElement(value, selectedCategory);
        taskInput.value = "";
    }

document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
});

taskInput.addEventListener("keydown",function(e){
    if(e.key === "Enter"){
        addTask();
    }
})
