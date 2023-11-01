# Dish-Cover
This is a repository containing the code for Dish-cover, a website application that supplies different recipes from around the world and allows the user to save recipes they seem to enjoy or to pass on certain recipes in a tinder-like format.

## What this project achives
```
1. A Log-in/Sign-Up page for users to access the website
2. A Like/Dislike system for each recipe
3. A system to save the liked recipes and display them in the liked recipes tab
4. A database that holds user information, as well as recipes to be displayed.
5. Session handling to track which user is currently accessing the website
```

## How to install the project

1. Clone this repository
2. Install express, express-session, mongoose, body-parser, and nodemon
```
  npm i express express-session mongoose body-parser nodemon
```
3. Setup a Database with MongoDB Atlas: https://www.mongodb.com/cloud/atlas/register
4. Once Database is setup, copy connection string with proper authentication and paste into the index.js mongoose.connect(). 
```
mongoose.connect('INSERT-URL-HERE', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
```
5. Creates 2 collections called "users" and "recipes"
6. Import the recipes.json from database imports into the recipes collection
7. Run the website locally by running
```
npm start
```
in the console
  - Make sure to being the 'dish-cover' directory
