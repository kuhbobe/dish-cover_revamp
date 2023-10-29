For MongoDB

Collections:
users
recipes (import recipes.json from database import folder to this collection)
liked-recipes


10/29/2023 5:16 AM

I added the ability to removeLikedRecipe from user database, as well as a way to retrieve the recipeID from the users likedRecipes and convert it into an array of recipes similar to the JSON 
(Check Example). But I did not know how to transer this data from the server to the client side in order to display it on the likedRecipes page.




Ex. [
  {
    _id: new ObjectId("653b45b6ba3dad17740528c6"),
    name: 'Instant Pot Chicken Paprikash',
    description: "You have the choice to prepare this chicken paprikash either using an Instant Pot or a stovetop. Regardless of your chosen method, it will be ready in under half an hour! You're welcome to experiment with paprika varieties; I, for instance, incorporated three distinct types: smoked paprika, sweet paprika, and the standard version of paprika.",
    imageUrl: '/recipes/paprika-chicken-recipe.jpg',
    ingredients: [
      '4 boneless, skinless chicken breasts',
      '2 tablespoons olive oil',
      '1 onion, chopped',
      '2 cloves garlic, minced',
      '2 tablespoons paprika',
      '1 cup chicken broth',
      '1 cup sour cream',
      'Salt and pepper to taste'
    ]
  }
]

