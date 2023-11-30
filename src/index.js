const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), './config/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), './config/client_secret.json');



// Dummy user database
const users = [
  {
    id: 1,
    username: 'alice',
    password: 'password1'
  },
  {
    id: 2,
    username: 'bob',
    password: 'password2'
  }
];

// Middleware to verify JWT token in request headers
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('Unauthorized');
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).send('Forbidden');
    }
    req.user = user;
    next();
  });
};

// Generate OAuth2 token for a given user
const generateToken = (user) => {
  const payload = {
    sub: user.id,
    username: user.username
  };
  return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
};

  

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
export async function authorize(app) {
  console.log("authorize");
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  if(app) app.set('auth_client', client);
  return client;
}




export default async function init(auth){
  let app = require('express').Router();
  app.get('/auth/admin', async(req, res)=>res.json(authorize(req.app).catch(console.log)));
  app.get('/auth/test', async(req, res)=>res.json(req.app.get('auth_client')))
  //app.get('/', async (req, res, next)=>{req.auth=auth; next()});
  //app.get('/auth/callback', (req, res)=>res.redirect('http://localhost:3002/youtubes'));
  app.use(bodyParser.json());

  // Login endpoint to generate OAuth2 token
  app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).send('Invalid username or password');
    }

    const token = generateToken(user);
    res.send({ token });
  });

  // Example protected endpoint that requires authentication
  app.get('/auth/protected', verifyToken, (req, res) => {
    res.send(`Hello, ${req.user.username}!`);
  });

  return app;
}







