// Required modules
var express = require("express");
var bodyParse = require("body-parser");
var session = require('express-session')
var mongoose = require("mongoose");
const store = new session.MemoryStore();
const e = require("express");

// Initialize Express
const app = express()
// Session configuration
app.use(session({
    secret: 'some secret',
    cookie: { maxAge: 120000,}, // Set to 'None' for cross-site cookies},
    saveUninitialized: false,
    store
}));

// Middleware setup
app.use(bodyParse.json())
app.use(express.static('dish-cover'))
app.use(express.static('dish-cover/views'))
app.use(express.static('dish-cover/recipes'))
app.use(express.static('dish-cover/scripts'))
app.use(bodyParse.urlencoded({ extended: true }))

// MongoDB connection
mongoose.connect('mongodb+srv://andayakobe:Andaya032003@dish-cover.2nh1ekf.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

var db = mongoose.connection;
// Define schemas for MongoDB collections
const LogInSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
})

const recipeSchema = new mongoose.Schema({
    name: String,
    description: String,
    imageUrl: String,
    ingredients: [String],
  });

// Database connection handling

db.on('error', () => console.log("error in connecting database"));
db.once('open', () => console.log("Connected to Database"));
// Create models for MongoDB collections

const collection = new mongoose.model("users", LogInSchema);
const Recipe = new mongoose.model("recipes", recipeSchema);
// Route for the root path

app.get("/", (req, res) => {

    res.set({
        "Allow-access-Allow-Origin": '*'
    })

    return res.redirect('home.html');

});

// Route for user signup page

app.get("/signup", (req, res)=>{
    return res.redirect("signup.html");
})

// Route for user signup form submission

app.post("/signup", (request, response)=>{
    const email = request.body.email;
    const password = request.body.password;
    const likedRecipes = [];

    var data = {
        "email": email,
        "password": password,
        "likedRecipes": likedRecipes
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    })
    return response.redirect("index.html");
})

// Route for user login
app.post("/login", (req, res) => {
    console.log(req.sessionID)
    const { email, password } = req.body;
    if (email && password ) {
        if(req.session.authenticated){
            res.json(req.session);
        } else {
            db.collection('users').findOne({ email: email }, (err, user) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Internal Server Error");
                }
    
                if (!user) {
                    return res.redirect('signup.html');
                }
    
                if (user.password === password) {
                    req.session.authenticated = true;
                    req.session.user = email;
                    
                    return res.redirect('home.html');
                } else {
                    return res.status(401).send("Invalid Password");
                }
            });
        }
    }
});


// Route for user logout

app.get('/logout', (req, res) => {
    if (req.session.authenticated) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Internal Server Error');
            }
            // Redirect the user to the login page after logging out
            return res.redirect('index.html'); // Change to the appropriate URL
        });
    } else {
        // If the user is not authenticated, you can handle this case as needed.
        // For example, you can redirect to the login page or display an error message.
        return res.redirect('index.html'); // Change to the appropriate URL
    }
});

  // Define an API endpoint to retrieve recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
} catch (error) {
    console.error('Error fetching recipe data:', error);
    
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to fetch and return user's liked recipes

app.get('/likedRecipes', async (req, res) => {
    const username = req.session.user;
  
    try {
      const user = await collection.findOne({ email: username });
  
      if (user) {
        const likedRecipes = user.likedRecipes;
  
        // Use Promise.all to fetch all liked recipes concurrently
        const results = await Promise.all(
          likedRecipes.map(async (likedRecipe) => {
            try {
              return await Recipe.findOne({ _id: likedRecipe }).exec();
            } catch (err) {
              console.error('Error searching for document with ObjectID', likedRecipe, ':', err);
              return null; // Return null for failed queries
            }
          })
        );
  
        res.json(results);
      }
    } catch (err) {
      console.error('Error retrieving user from the database:', err);
    }
  });
  

//save likes recipes ID to user 
app.post('/api/saveLikedRecipe/:recipeId', async (req, res) => {
    const recipeId = req.params.recipeId;
    const username = req.session.user; // Get the username from the session

    try {
        // Look up the user based on the username and update their data
        const user = await collection.findOne({ email: username });

        if (user) {
            // Check if the recipeId is already in the likedRecipes array
            if (!user.likedRecipes) {
                user.likedRecipes = []; // Initialize likedRecipes if it doesn't exist
            }

            if (!user.likedRecipes.includes(recipeId)) {
                user.likedRecipes.push(recipeId);

                // Update the user's likedRecipes in the database
                await collection.updateOne({ email: username }, { $set: { likedRecipes: user.likedRecipes } });

                res.status(200).json({ message: 'Recipe added to liked recipes.' });
            } else {
                res.status(400).json({ message: 'Recipe is already in liked recipes.' });
            }
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error saving liked recipe:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to remove a liked recipe from a user's profile

app.delete('/api/removeLikedRecipe/:recipeId', async (req, res) => {
    const recipeId = req.params.recipeId;
    const username = req.session.user; // Get the username from the session

    try {
        // Look up the user based on the username
        const user = await collection.findOne({ email: username });

        if (user) {
            if (!user.likedRecipes) {
                user.likedRecipes = [];
            }
            // Check if the recipeId is in the likedRecipes array
            const index = user.likedRecipes.indexOf(recipeId);
            if (index !== -1) {
                // Remove the recipeId from the likedRecipes array
                user.likedRecipes.splice(index, 1);
                // Update the user's likedRecipes in the database
                await collection.updateOne({ email: username }, { $set: { likedRecipes: user.likedRecipes } });

                res.status(200).json({ message: 'Recipe removed from liked recipes.' });
            } else {
                res.status(400).json({ message: 'Recipe is not in liked recipes.' });
            }
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error removing liked recipe:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server on the specified port

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("PORT CONNECTED!");
})