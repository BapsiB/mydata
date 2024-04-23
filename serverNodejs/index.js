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
const fs = require('fs');
const os = require('os');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // For generating unique identifiers

const util = require('util');
const OpenAI = require('openai').default;


const outputLog = fs.createWriteStream('./outputLog.log');

const openaiApiKey = 'REMOVED_OPENAI_KEY';
const openai = new OpenAI({ apiKey: openaiApiKey });
const IS_LOCAL = true;
const rootUrl = IS_LOCAL ? '' : '/testApp';

// Replace mongoose and User model with MySQL connection setup
const dbConfig = IS_LOCAL ? {
  host: 'localhost',
  user: 'root',
  password: 'REMOVED',
  database: 'my_data_db'
} :
  {
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
app.set('view engine', 'ejs');
const viewspath = path.join(__dirname, 'views');
app.set('views', viewspath);
// app.use(express.static('public'));

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
  successRedirect: rootUrl + '/api',
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
    <form action="` + rootUrl + `/login" method="post">
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
    <form action="` + rootUrl + `/register" method="post">
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

// Global variable to hold the Assistant and Thread ID
let globalAssistant = null;

// app.post(rootUrl + '/hasFile', async (req, res) => {
//   if (req.isAuthenticated()) {

//   }
// }

app.post(rootUrl + '/addUserQuestion', async (req, res) => {
  if (req.isAuthenticated()) {
    const question = req.body.question;
    addQuestionToThread(req, res, question);
  }
})

app.post(rootUrl + '/api', async (req, res) => {
  console.log("/api");
  // res.json({ message: "ok" });
  // return;
  
  if (req.isAuthenticated()) {
    // User is authenticated, proceed with the API response
    const jsonData = req.body.jsonData;

    outputLog.write('\n' + util.format(jsonData) + '\n');
    
    // Check if the Assistant has been initialized; if not, initialize it
    if (!globalAssistant) {
      globalAssistant = await openai.beta.assistants.create({
        instructions: "You are a personal data analyst. The user will ask you questions from an app. This app is like a journal where the user write themselves a series of questions they reply everyday. The question will be about the data collected. Write and run code to answer the question if relevant, to extract relevant informations from the given data.",
        model: "gpt-4-turbo-preview",
        tools: [{"type": "code_interpreter"}]
      });
      console.log("Assistant ID: " + globalAssistant.id);
    }

    // Check if the Thread has been initialized; if not, initialize it
    if (!req.session.thread) {
      if (!jsonData.length) {
        res.send('Nodata');
        return;
      }

      const thread = await openai.beta.threads.create();
      console.log("create thread.")
      req.session.thread = thread.id;

      // Example usage
      const dataString = jsonData; // Replace with actual data string
      const userId = "exampleUser123"; // Replace with actual user/session ID
      uploadDataAsFile(dataString, userId)
        .then(file => {
          console.log("Upload successful:", file);
          req.session.file = file;
          res.json({ message: "ok" });
        })
        .catch(error => console.error("Upload failed:", error));
    }
  }
  else {
    console.log("Unauthorized");
    // User is not authenticated
    res.status(401).json({ message: "Unauthorized" });
  }
});

async function addQuestionToThread(req, res, question) {
      const message = await openai.beta.threads.messages.create(
      req.session.thread,
      {
        role: "user",
        content: question,
        file_ids: [req.session.file.id]
      }
      );
}
let idInterval = -1;
app.get('/stream', (req, res) => {
  console.log("!!! ask stream !!! \n");
  console.log(req);
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // var indexSend = 0;
  // if (idInterval > -1) {
  //   clearInterval(idInterval);
  // }
  // idInterval = setInterval(function () {
  //   const data = `data: ${JSON.stringify({ message: "<br><b>assistant > </b>" + indexSend })}\n\n`;
  //   res.write(data);
  //   process.stdout.write(data);
  //   indexSend++;
  //   if (indexSend > 5) {
  //     clearInterval(idInterval);
  //     res.end();
  //   }

  // }, 1000);

  // return;

  const run = openai.beta.threads.runs.stream(req.session.thread, {
    assistant_id: globalAssistant.id,
  })
  .on('textCreated', (text) => {
    res.write(`data: ${JSON.stringify({ message: "<br><b>assistant > </b>" })}\n\n`);
    process.stdout.write("\n<br><b>assistant > </b>");
  })
  .on('textDelta', (textDelta, snapshot) => {
    res.write(`data: ${JSON.stringify({ message: textDelta.value })}\n\n`);
    process.stdout.write(textDelta.value)
  })
  .on('end', () => {
    res.end();
  })

  console.log("run created");
  req.session.run = run;
    
  req.on('close', () => {
    console.log("try to close run.");
    // run.cancel(); // Assume there is a way to cancel the stream
    res.end();
  })
  .on('toolCallCreated', (toolCall) => process.stdout.write(`\nassistant > ${toolCall.type}\n\n`))
  .on('toolCallDelta', (toolCallDelta, snapshot) => {
    if (toolCallDelta.type === 'code_interpreter') {
      if (toolCallDelta.code_interpreter.input) {
        process.stdout.write(toolCallDelta.code_interpreter.input);
      }
      if (toolCallDelta.code_interpreter.outputs) {
        process.stdout.write("\noutput >\n");
        toolCallDelta.code_interpreter.outputs.forEach(output => {
          if (output.type === "logs") {
            process.stdout.write(`\n${output.logs}\n`);
          }
        });
      }
    }
  });
});

// Function to upload data as a file
async function uploadDataAsFile(dataString, userId) {
  // Generate a unique filename using the user's ID and a UUID
  const uniqueFilename = `upload_${userId}_${uuidv4()}.csv`;
  const tempFilePath = path.join(os.tmpdir(), uniqueFilename);

  try {
    // Write the data string to a temporary file
    fs.writeFileSync(tempFilePath, dataString);

    console.log("write file " + tempFilePath);

    // Upload the file
    const file = await openai.files.create({
      file: fs.createReadStream(tempFilePath),
      purpose: "assistants",
    });

    console.log(`File uploaded successfully: ${file.id}`);
    return file; // Or return some indication of success
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error; // Or handle the error appropriately
  } finally {
    // Cleanup: Delete the temporary file
    // fs.unlinkSync(tempFilePath);
  }
}

app.get(rootUrl + '/api', (req, res) => {
  res.render('api', {
        apiPath: rootUrl + '/api'
    });
});

app.get(rootUrl + '/logout', function(req, res){
  req.logout();
  res.redirect(rootUrl + '/');
});

app.get(rootUrl + '/', (req, res) => {
  res.send('Hello World!');
});

const server = http.createServer(app);

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


