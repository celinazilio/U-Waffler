function llamado() {
	let name = document.getElementById('inputNombre').value;
	sessionStorage.setItem('nombreUsuario', name);
}

// span, secciones
window.onload = function () {
	document.getElementById('bienvUsuario').innerText = ", " + sessionStorage.getItem('nombreUsuario');
};

// reloj
let time = document.getElementById("time");
let day = document.getElementById("day");
let midday = document.getElementById("midday");

let clock = setInterval(
    function calcTime(){
        var date_now = new Date();
        var hr = date_now.getHours();
        var min = date_now.getMinutes();
        var sec = date_now.getSeconds();
        var middayValue = "AM"
        var days = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
        
        day.textContent = days[date_now.getDay()];

        middayValue = (hr >= 12) ? "PM" : "AM";

        if(hr == 0){
            hr = 12;
        }
        else if(hr > 12){
            hr-=12;
        }

        hr = (hr < 10) ? "0" + hr : hr;
        min = (min < 10) ? "0" + min : min;
        sec = (sec < 10) ? "0" + sec : sec;

        time.textContent = hr + ":" + min + ":" + sec;
        midday.textContent = middayValue;
    },
    1000
);

// list 
window.addEventListener('load', () => {
	todos = JSON.parse(localStorage.getItem('todos')) || [];
	const newTodoForm = document.querySelector('#new-todo-form');
	newTodoForm.addEventListener('submit', e => {
		e.preventDefault();
		const todo = {
			content: e.target.elements.content.value,
			category: e.target.elements.category.value,
			done: false,
			createdAt: new Date().getTime()
		}
		todos.push(todo);
		localStorage.setItem('todos', JSON.stringify(todos));
		// Reset 
		e.target.reset();
		DisplayTodos()
	})
	DisplayTodos()
})

function DisplayTodos() {
	let todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";
	todos.forEach(todo => {
		let todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');
		let label = document.createElement('label');
		let input = document.createElement('input');
		let span = document.createElement('span');
		let content = document.createElement('div');
		let actions = document.createElement('div');
		let edit = document.createElement('button');
		let deleteButton = document.createElement('button');
		input.type = 'checkbox';
		input.checked = todo.done;
		span.classList.add('bubble');
		if (todo.category == 'personal') {
			span.classList.add('personal');
		} else {
			span.classList.add('business');
		}
		content.classList.add('todo-content');
		actions.classList.add('actions');
		edit.classList.add('edit');
		deleteButton.classList.add('delete');
		content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
		edit.innerHTML = '📝';
		deleteButton.innerHTML = '❌';
		label.appendChild(input);
		label.appendChild(span);
		actions.appendChild(edit);
		actions.appendChild(deleteButton);
		todoItem.appendChild(label);
		todoItem.appendChild(content);
		todoItem.appendChild(actions);
		todoList.appendChild(todoItem);

		if (todo.done) {
			todoItem.classList.add('done');
		}

		input.addEventListener('change', (e) => {
			todo.done = e.target.checked;
			localStorage.setItem('todos', JSON.stringify(todos));
			if (todo.done) {
				todoItem.classList.add('done');
			} else {
				todoItem.classList.remove('done');
			}
			DisplayTodos()
		})

		edit.addEventListener('click', (e) => {
			const input = content.querySelector('input');
			input.removeAttribute('readonly');
			input.focus();
			input.addEventListener('blur', (e) => {
				input.setAttribute('readonly', true);
				todo.content = e.target.value;
				localStorage.setItem('todos', JSON.stringify(todos));
				DisplayTodos()

			})
		})

		deleteButton.addEventListener('click', (e) => {
			todos = todos.filter(t => t != todo);
			localStorage.setItem('todos', JSON.stringify(todos));
			DisplayTodos()
		})

	})
}

/// API
let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

searchBtn.addEventListener("click", () => {
  let userInp = document.getElementById("user-inp").value;
  if (userInp.length == 0) {
    result.innerHTML = `<h3>¡No puedes dejarlo vacio!</h3>`;
  } else {
    fetch(url + userInp)
      .then((response) => response.json())
      .then((data) => {
        let myMeal = data.meals[0];
        console.log(myMeal);
        console.log(myMeal.strMealThumb);
        console.log(myMeal.strMeal);
        console.log(myMeal.strArea);
        console.log(myMeal.strInstructions);
        let count = 1;
        let ingredients = [];
        for (let i in myMeal) {
          let ingredient = "";
          let measure = "";
          if (i.startsWith("strIngredient") && myMeal[i]) {
            ingredient = myMeal[i];
            measure = myMeal[`strMeasure` + count];
            count += 1;
            ingredients.push(`${measure} ${ingredient}`);
          }
        }
        console.log(ingredients);

        result.innerHTML = `
    <img src=${myMeal.strMealThumb}>
    <div class="details">
        <h2>${myMeal.strMeal}</h2>
        <h4>${myMeal.strArea}</h4>
    </div>
    <div id="ingredient-con"></div>
    <div id="recipe">
        <button id="hide-recipe">❌</button>
        <pre id="instructions">${myMeal.strInstructions}</pre>
    </div>
    <button id="show-recipe">Ver Receta</button>
    `;
        let ingredientCon = document.getElementById("ingredient-con");
        let parent = document.createElement("ul");
        let recipe = document.getElementById("recipe");
        let hideRecipe = document.getElementById("hide-recipe");
        let showRecipe = document.getElementById("show-recipe");

        ingredients.forEach((i) => {
          let child = document.createElement("li");
          child.innerText = i;
          parent.appendChild(child);
          ingredientCon.appendChild(parent);
        });

        hideRecipe.addEventListener("click", () => {
          recipe.style.display = "none";
        });
        showRecipe.addEventListener("click", () => {
          recipe.style.display = "block";
        });
      })
      .catch(() => {
        result.innerHTML = `<h3>No encontré nada...</h3>`;
      });
  }
});
