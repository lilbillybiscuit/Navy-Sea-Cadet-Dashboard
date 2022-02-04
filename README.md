# Navy-Sea-Cadet-Dashboard

**Setting up the dev environment**
1. Install Node.js 16.x for your operation system (make sure it also includes npm)
2. Clone this repository with
    `git clone https://github.com/CHSCodeForChange/Navy-Sea-Cadet-Dashboard.git`
3. Go to the folder and run `npm install` to install dependencies
4. Create a file named `config.json`, inside it fill out the following information, it is gitignored, so it won't push into GitHub:
```
{
    "database": {
        "host": "localhost",
        "user": "username",
        "password": "password",
        "database": "database name"
    },
    "masterkey": 32 character string for password
}
```
5. Run `npm start`. The server will automatically refresh as you make changes.
6. Access the server at http://localhost:8000 in any browser
7. Stop the server with CTRL+C