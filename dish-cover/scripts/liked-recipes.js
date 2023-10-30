
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

dropdownButton.addEventListener("click", toggleDropdownMenu);

// Function to save the liked recipes to local storage

function fetchLikedRecipesData() {
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


function removeLikedRecipe(recipeId) {
    // You can use JavaScript fetch or another method to make the request
    fetch(`/api/removeLikedRecipe/${recipeId}`, {
        method: 'DELETE',
    })

    .then(response => {
        if (response.status === 200) {
            // Update the UI to indicate that the recipe has been liked
            console.log('Removing liked recipe'); 
        } else {
            console.error('Error saving liked recipe');
        }
    })
    .catch(error => {
        console.error('Network error:', error);
    });
}
