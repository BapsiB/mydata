const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// Assuming you have a User model (define according to your DB schema)
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise'); // Import mysql2/promise for async/await usage
const flash = require('connect-flash');
const axios = require('axios');
const http = require('http');

const OpenAI = require('openai').default;
const openaiApiKey = 'REMOVED_OPENAI_KEY';
const openai = new OpenAI({ apiKey: openaiApiKey });
const rootUrl = '/testApp'

// Replace mongoose and User model with MySQL connection setup
const dbConfig = {
  host: 'localhost',
  user: 'lebaptis_my_data',
  password: 'REMOVED',
  database: 'lebaptis_my_data'
};

const app = express();
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({ secret: 'REMOVED', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(flash());

// Adapted LocalStrategy to use mysql2
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    
    if (rows.length === 0) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    
    const user = rows[0];
    
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect password.' });
    }
  } catch (err) {
    return done(err);
  }
}));


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
app.post(rootUrl + '/login', passport.authenticate('local', {
  successRedirect: rootUrl + '/success',
  failureRedirect:rootUrl + '/failure',
  failureFlash: true,
}));

app.post(rootUrl + '/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const connection = await mysql.createConnection(dbConfig);
    // Check if username already exists
    const [users] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (users.length > 0) {
      res.status(400).send('Username is already taken.');
      return;
    }

    // Insert new user
    await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

    res.redirect(rootUrl + '/login'); // Redirect to login page after successful registration
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send("Error registering new user.");
  }
});

app.get(rootUrl + '/success', (req, res) => {
  console.log("login success");
  res.send(`success`);
});

app.get(rootUrl + '/test', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('is Authenticated');
  }
  else {
    res.send('not Authenticated');
  }
});

app.get(rootUrl + '/failure', (req, res) => {
  res.send(`failure`);
});

app.get(rootUrl + '/login', (req, res) => {
  const messages = req.flash('error');
  res.send(`
    <h2>Login</h2>
    ${messages.length ? `<p style="color: red;">${messages}</p>` : ''}
    <form action="/testApp/login" method="post">
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

app.get(rootUrl + '/signup', (req, res) => {
  res.send(`
    <h2>Sign Up</h2>
    <form action="/testApp/register" method="post">
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

app.post(rootUrl + '/api', async (req, res) => {
  if (req.isAuthenticated()) {
    // User is authenticated, proceed with the API response
    const question = req.body.question;
    const jsonData = req.body.jsonData;

    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a helpful data analysist assistant. i will send you data that are from a number journal. a question will follow. the response should be based only on the correlation and analysis of the data, not on any pre-knowledge. v stands for value. here comes the data:" }, {"role": "system", "content": jsonData}, {"role": "user", "content": "based on the data you just received, help me with : " + question}],
        model: "gpt-4",
        temperature: 0.3, // Lower for more deterministic outputs
        max_tokens: 200, // Adjust based on the expected length of the reply
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["\n"],
      });

      res.json({ message: completion.choices[0].message.content });
      console.log(completion.choices[0].message.content);
    
  } else {
    // User is not authenticated
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.get(rootUrl + '/logout', function(req, res){
  req.logout();
  res.redirect(rootUrl + '/');
});

app.get(rootUrl + '/', (req, res) => {
  res.send('Hello World!');
});

const server = http.createServer(app);

server.listen();
