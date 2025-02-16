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
//testDB();

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

//exams page for showing the tests 
// Get all exams
app.get("/exams", async (req, res) => {
    try {
      const result = await pool.query("SELECT exam_name, date , creator FROM exam");
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
//to insert exams

app.post("/createexam", async (req, res) => {
    try {
      const { exam_name, exam_date, creator } = req.body;
      console.log(exam_date, exam_name, creator);
      
      if (!exam_name || !exam_date) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const client = await pool.connect();
  
      try {
        await client.query("BEGIN");
  
        // Insert into exam table
        await client.query(
          "INSERT INTO exam (exam_name, creator, date) VALUES ($1, $2, $3)",
          [exam_name, creator, exam_date]
        );
  
        // Format the exam table name to avoid SQL injection issues
        const examTable = exam_name;
  
        // Create the new exam table
        
        await client.query(`
            CREATE TABLE ${examTable} (
            regno VARCHAR(20) PRIMARY KEY,
            name VARCHAR(100),
            Eng_Math INT DEFAULT 0,
            Lin_Alg INT DEFAULT 0,
            Calculus INT DEFAULT 0,
            Prob_Stats INT DEFAULT 0,
            Dig_Logic INT DEFAULT 0,
            COA INT DEFAULT 0,
            PDS INT DEFAULT 0,
            Algo INT DEFAULT 0,
            TOC INT DEFAULT 0,
            Comp_Des INT DEFAULT 0,
            OS INT DEFAULT 0,
            DBMS INT DEFAULT 0,
            CN INT DEFAULT 0,
            maxobtained INT DEFAULT 0,
            maxmark INT DEFAULT 0
            )
        `);
  
        // Insert student records into the new exam table
        await client.query(`
          INSERT INTO ${examTable} (regno, name)
          SELECT regno, name FROM student
        `);
  
        await client.query("COMMIT");
  
        res.status(201).json({ message: "Exam Created Successfully with student records" });
  
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({ error: "Server error" });
      } finally {
        client.release();
      }
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  //for getting particular exam data

  app.get("/particular/:examTable", async (req, res) => {
    const { examTable } = req.params;
  
    if (!examTable) {
      return res.status(400).json({ error: "Exam table name is required" });
    }
  
    try {
      const result = await pool.query(`SELECT * FROM ${examTable}`);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "No data found for this exam" });
      }
  
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching exam data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  //for update marks

  app.put('/update-marks', async (req, res) => {
    try {
        const { examName, students } = req.body;
        console.log(examName, students);

        if (!examName || !students || !Array.isArray(students)) {
            return res.status(400).json({ message: "Invalid data provided" });
        }

            for (const student of students) {
                await pool.query(
                    `UPDATE ${examName} 
                     SET eng_math = $1, lin_alg = $2, calculus = $3, prob_stats = $4, 
                         dig_logic = $5, coa = $6, pds = $7, algo = $8, toc = $9, 
                         comp_des = $10, os = $11, dbms = $12, cn = $13, 
                         maxobtained = $14, maxmark = $15 
                     WHERE regno = $16`,
                    [
                      student.eng_math, student.lin_alg, student.calculus, 
                      student.prob_stats, student.dig_logic, student.coa, 
                      student.pds, student.algo, student.toc, 
                      student.comp_des, student.os, student.dbms, 
                      student.cn, student.maxobtained, student.maxmark, 
                      student.regno
                    ]
                  );
            }
                 
        return res.status(200).json({ message: "Marks updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update marks" });
    }
});
//for getting the student details
app.get("/students", async (req, res) => {
    try {
      const result = await pool.query("SELECT regno, name FROM student");
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });




// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
