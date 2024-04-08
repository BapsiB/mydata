const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// Assuming you have a User model (define according to your DB schema)
const User = require('./models/User');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const axios = require('axios');

const OpenAI = require('openai').default;
const openaiApiKey = 'REMOVED_OPENAI_KEY';
const openai = new OpenAI({ apiKey: openaiApiKey });

// MongoDB connection string
const mongoDB = 'mongodb://localhost/userDB';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log("Connected successfully to MongoDB");
});

const app = express();
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(flash());

// Define the local strategy for Passport
passport.use(new LocalStrategy(
  async function(username, password, done) {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    } catch (err) {
      return done(err);
    }
  }
));

// Serialize and deserialize user instances to and from the session.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // Replace this with your DB user retrieval
  const user = { id: 1, username: 'test', password: 'password' }; // example user
  done(null, user);
});

// Routes
app.post('/login', passport.authenticate('local', {
  successRedirect: '/success',
  failureRedirect:'/failure',
  failureFlash: true,
}));

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username is already taken.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send("Error registering new user.");
  }
});

app.get('/success', (req, res) => {
  console.log("login success");
  res.send(`success`);
});

app.get('/test', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('is Authenticated');
  }
  else {
    res.send('not Authenticated');
  }
});

app.get('/failure', (req, res) => {
  res.send(`failure`);
});

app.get('/login', (req, res) => {
  const messages = req.flash('error');
  res.send(`
    <h2>Login</h2>
    ${messages.length ? `<p style="color: red;">${messages}</p>` : ''}
    <form action="/login" method="post">
      <div>
        <label>Username:</label>
        <input type="text" name="username" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" required />
      </div>
      <div>
        <input type="submit" value="Log In"/>
      </div>
    </form>
  `);
});

app.get('/signup', (req, res) => {
  res.send(`
    <h2>Sign Up</h2>
    <form action="/register" method="post">
      <div>
        <label>Username:</label>
        <input type="text" name="username" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" required />
      </div>
      <div>
        <input type="submit" value="Sign Up"/>
      </div>
    </form>
  `);
});

app.post('/api', async (req, res) => {
  if (req.isAuthenticated()) {
    // User is authenticated, proceed with the API response
    const question = req.body.question;


    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a helpful assistant." }, {"role": "user", "content": question}],
        model: "gpt-3.5-turbo",
      });

      res.json({ message: completion.choices[0].message.content });
      console.log(completion.choices[0].message.content);


    // axios.post('https://api.openai.com/v1/engines/davinci/completions', {
    //   prompt: question,
    //   max_tokens: 50
    // }, {
    //   headers: {
    //     'Authorization': `Bearer ${openaiApiKey}`
    //   }
    // })
    // .then(response => {
    //   res.json({ message: "response: " + response.data.choices[0].text });
    //   console.log(response.data.choices[0].text);
    // })
    // .catch(error => {
    //   res.json({ message: "error: " + error });
    //   console.error(error)
    // });


    
  } else {
    // User is not authenticated
    res.status(401).json({ message: "Unauthorized" });
  }
});


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
