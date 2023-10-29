// Sample recipe data (you would fetch this data from your back end)
let recipes = [];
let currentIndex = 0;
const likeList = [];

// Function to retrieve liked recipes from local storage
function getLikedRecipesFromLocalStorage() {
    try {
        const storedLikedRecipes = localStorage.getItem('likedRecipes');
        return storedLikedRecipes ? JSON.parse(storedLikedRecipes) : [];
    } catch (error) {
        console.error('Error retrieving liked recipes:', error);
        return [];
    }
}

// Fetch the recipe data from the JSON file
fetch('/api/recipes')
    .then(response => response.json())
    .then(data => {
        recipes = data;
        // Now, you can work with the 'recipes' array to display the recipes.
        showRecipe(currentIndex);
       
    })
    .catch(error => {
        console.error('Error fetching recipe data:', error);
    });
   
   // Function to display a recipe based on the current index
    function showRecipe(index) {
        console.log("Showing recipe at index:", index);
        
        const recipeCard = document.querySelector(".recipe-card");
        
        if (index < 0 || index >= recipes.length) {
            console.log("Index out of bounds.");
            recipeCard.innerHTML = "No more recipes to display.";
            return;
        }
    
        const recipe = recipes[index];
    
        console.log("Recipe:", recipe);
        // Update the recipe card elements with the current recipe's data

        recipeCard.querySelector("h2").textContent = recipe.name;
        recipeCard.querySelector("p").textContent = recipe.description;
        recipeCard.querySelector("img").src = recipe.imageUrl;
    }
 
// Function to toggle the dropdown menu
function toggleDropdownMenu() {
    const dropdownMenu = document.querySelector(".dropdown-menu");
    if (dropdownMenu.style.display === "block") {
        dropdownMenu.style.display = "none";
    } else {
        dropdownMenu.style.display = "block";
    }
}

// Function to handle the "dislike" action
function dislikeRecipe() {
    currentIndex++;
    showRecipe(currentIndex);
}

// Event listener for the like button
document.querySelector(".like-button").addEventListener("click", () => {
    const currentRecipe = recipes[currentIndex];

    if (currentRecipe) {
        // Assuming currentRecipe._id is a valid ObjectId
        const likedRecipeID = currentRecipe._id;
        console.log(likedRecipeID);
        saveLikedRecipe(likedRecipeID)
    }
    currentIndex++;
    showRecipe(currentIndex);
});

// Event listener for the dislike button
document.querySelector(".dislike-button").addEventListener("click", () => {
    const currentRecipe = recipes[currentIndex];

    if (currentRecipe) {
        // Assuming currentRecipe._id is a valid ObjectId
        const likedRecipeID = currentRecipe._id;
        console.log(likedRecipeID);
        removeLikedRecipe(likedRecipeID)
    }
    currentIndex++;
    showRecipe(currentIndex);
});

// Event listener for the dropdown button
const dropdownButton = document.querySelector(".dropdown-button");
const dropdownMenu = document.querySelector(".dropdown-menu");

dropdownButton.addEventListener("click", toggleDropdownMenu);

// Function to save a liked recipe to the user's profile
function saveLikedRecipe(recipeId) {
    // You can use JavaScript fetch or another method to make the request
    fetch(`/api/saveLikedRecipe/${recipeId}`, {
        method: 'POST',
    })
    .then(response => {
        if (response.status === 200) {
            // Update the UI to indicate that the recipe has been liked
            console.log('Saving liked recipe'); // Disable the button, for example
        } else {
            console.error('Error saving liked recipe');
        }
    })
    .catch(error => {
        console.error('Network error:', error);
    });
}


// Function to remove a liked recipe from the user's profile
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




