
// Function to display liked recipes
function displayLikedRecipes() {

    const likedRecipesList = document.querySelector('.liked-recipe-card');
    likedRecipesList.innerHTML = ''; // Clear the list

    likedRecipes.forEach((recipe, index) => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="${recipe.imageUrl}" alt="${recipe.name}">
            <h2>${recipe.name}</h2>
            <p>${recipe.description}</p>
            <p style="margin-bottom: 20px; font-weight: bold;">Ingredients</p>
            <ul class="ingredients-list"></ul>
            <button class="remove-button">Remove</button>
           
        `;

        const removeButton = recipeCard.querySelector(".remove-button");
        removeButton.addEventListener("click", () => {
            removeRecipe(index);
        });

        const ingredientsList = recipeCard.querySelector(".ingredients-list");
        for (const ingredient of recipe.ingredients) {
            const listItem = document.createElement("li");
            listItem.textContent = ingredient;
            ingredientsList.appendChild(listItem);
        }

        likedRecipesList.appendChild(recipeCard);
    });
}

// Call the function to display liked recipes when the page loads
fetchLikedRecipesData();
displayLikedRecipes();

// Function to retrieve liked recipes from local storage

const dropdownButton = document.querySelector(".dropdown-button");
const dropdownMenu = document.querySelector(".dropdown-menu");

function toggleDropdownMenu() {
    if (dropdownMenu.style.display === "block") {
        dropdownMenu.style.display = "none";
    } else {
        dropdownMenu.style.display = "block";
    }
}

dropdownButton.addEventListener("click", toggleDropdownMenu);

// Function to save the liked recipes to local storage

function fetchLikedRecipesData() {
    console.log("poop");
    fetch('/likedRecipes')
        .then(response => response.json())
        .then(data => {
            likedRecipes = data
            console.log(likedRecipes)
            displayLikedRecipes(likedRecipes);
        })
        .catch(error => {
            console.error('Error:', error);
        });

}
// Function to remove a liked recipe

function removeRecipe(index) {
    console.log(index)
    if (index >= 0 && index < likedRecipes.length) {
        const likedRecipeID = likedRecipes[index]._id;
        removeLikedRecipe(likedRecipeID)
        likedRecipes.splice(index, 1); // Remove the recipe from the likedRecipes array
        
        displayLikedRecipes(); // Update the displayed liked recipes
    }
}

// Function to send a request to remove a liked recipe from the server

function removeLikedRecipe(recipeId) {
    // You can use JavaScript fetch or another method to make the request
    fetch(`/api/removeLikedRecipe/${recipeId}`, {
        method: 'DELETE',
    })

    .then(response => {
        if (response.status === 200) {
            // Update the UI to indicate that the recipe has been liked
            console.log('Removing liked recipe'); // Disable the button, for example
        } else {
            console.error('Error saving liked recipe');
        }
    })
    .catch(error => {
        console.error('Network error:', error);
    });
}
