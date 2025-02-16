const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors());

// PostgreSQL connection setup
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "ScoreVengers",
    password: "#arcade#",
    port: 2005,
});

// Function to test database connection
async function testDB() {
    try {
        const temp = await pool.query("SELECT * FROM student");
        console.log(temp.rows); // Log the fetched data
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

// Call the test function
testDB();

app.get("/", (req, res) => {
    res.status(200).json("Server is active");
});

app.post("/login", async (req, res) => {
    const { email, password, role } = req.body;

    try {
        let tableName;

        // Validate role
        if (role === "admin") {
            tableName = "admin";
        } else if (role === "student") {
            tableName = "student";
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }
        console.log(email, password, role);

        // Query the respective table for the email
        const query = await pool.query(`SELECT * FROM ${tableName} WHERE email = $1`, [email]);

        if (query.rows.length > 0) {
            const user = query.rows[0];

            // Check if the password matches
            if (user.password === password) {
                return res.status(201).json({ 
                    message: `Login successful as ${role}`, 
                    role, 
                    name: user.name // Sending name to frontend
                });
            } else {
                return res.status(401).json({ message: "Incorrect password" });
            }
        }

        return res.status(404).json({ message: "Email not found" });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
