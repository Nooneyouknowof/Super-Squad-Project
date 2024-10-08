// index.js
// Required modules
const express = require('express');
const path = require('path');
const fs = require('fs').promises;

// Initialize Express application
const app = express();

// Define paths
const clientPath = path.join(__dirname, '..', 'client/src');
const dataPath = path.join(__dirname, 'data', 'users.json');
const heroData = path.join(__dirname, 'data', 'superheros.json');
const serverPublic = path.join(__dirname, 'public');
// Middleware setup
app.use(express.static(clientPath)); // Serve static files from client directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Routes

// Home route
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: clientPath });
});

app.get('/users', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf8');

        const users = JSON.parse(data);
        if (!users) {
            throw new Error("Error no users available");
        }
        res.status(200).json(users);
    } catch (error) {
        console.error("Problem getting users" + error.message);
        res.status(500).json({ error: "Problem reading users" });
    }
});

// Form route
app.get('/form', (req, res) => {
    res.sendFile('pages/form.html', { root: serverPublic });
});

// Form submission route
app.post('/submit-form', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Read existing users from file
        let users = [];
        try {
            const data = await fs.readFile(dataPath, 'utf8');
            users = JSON.parse(data);
        } catch (error) {
            // If file doesn't exist or is empty, start with an empty array
            console.error('Error reading user data:', error);
            users = [];
        }

        // Find or create user
        let user = users.find(u => u.name === name && u.email === email);
        if (user) {
            user.messages.push(message);
        } else {
            user = { name, email, messages: [message] };
            users.push(user);
        }

        // Save updated users
        await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
        res.redirect('/form');
    } catch (error) {
        console.error('Error processing form:', error);
        res.status(500).send('An error occurred while processing your submission.');
    }
});

// Update user route (currently just logs and sends a response)
app.put('/update-user/:currentName/:currentEmail', async (req, res) => {
    try {
        const { currentName, currentEmail } = req.params;
        const { newName, newEmail } = req.body;
        console.log('Current user:', { currentName, currentEmail });
        console.log('New user data:', { newName, newEmail });
        const data = await fs.readFile(dataPath, 'utf8');
        if (data) {
            let users = JSON.parse(data);
            const userIndex = users.findIndex(user => user.name === currentName && user.email === currentEmail);
            console.log(userIndex);
            if (userIndex === -1) {
                return res.status(404).json({ message: "User not found" })
            }
            users[userIndex] = { ...users[userIndex], name: newName, email: newEmail };
            console.log(users);
            await fs.writeFile(dataPath, JSON.stringify(users, null, 2));

            res.status(200).json({ message: `You sent ${newName} and ${newEmail}` });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('An error occurred while updating the user.');
    }
});
// Super Hero Form Server Code
app.get("/hero-form", async (req, res) => {
    try {
        const data = await fs.readFile(heroData, 'utf8');
        res.status(200).send(data)
    } catch (error) {
        console.error(error);
        res.status(500).send(error.toString());
    }
});

app.post("/submit-hero", async (req, res) => {
    try {
        const { name, power, universe } = req.body;
        const data = await fs.readFile(heroData, 'utf8');
        users = JSON.parse(data);
        users.push({ name, power, universe });
        await fs.writeFile(heroData, JSON.stringify(users, null, 2));
        res.redirect("/form");
    } catch (error) {
        console.error(error);
        res.status(500).send(error.toString());
    }
});

app.put("/update-hero", async (req, res) => {
    try {
        const { old_name, old_power, old_universe, new_name, new_power, new_universe } = req.body;
        const data = await fs.readFile(heroData, 'utf8');
        let users = JSON.parse(data);
        const index = users.findIndex(user => user.name === old_name && user.power === old_power && user.universe === old_universe);
        users[index].name = new_name;
        users[index].power = new_power;
        users[index].universe = new_universe;
        console.log(index, users);
        await fs.writeFile(heroData, JSON.stringify(users, null, 2));
        res.status(200).send("Successful!");
    } catch (error) {
        console.error(error);
        res.status(500).send(error.toString());
    }
})

app.delete("/delete/:name/:power/:universe", async (req, res) => {
    const { name, power, universe } = req.params;
    console.log(req.params);
    const data = await fs.readFile(heroData, 'utf8');
    let users = JSON.parse(data);

    const index = users.findIndex(user => user.name === name && user.power === power && user.universe === universe);

    if (index !== -1) {
        users.splice(index, 1);
        try {
            await fs.writeFile(heroData, JSON.stringify(users, null, 2));
        } catch (error) {
            console.error('Failed to write to database');
        }
        return res.status(200).send(`Removed user ${name}`);
    } else {
        return res.status(404).send("User could not be found");
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});