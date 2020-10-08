const express = require('express');
const router = express.Router();
const pool = require('../db');

// router.get('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'Handling GET requests to /users'
//     });
// });

router.get("/", async (req, res) => {
    try {
        const allUsers = await pool.query(
            "SELECT * FROM users"
        );
        res.status(200).json(allUsers.rows);
    } catch (error) {
        console.log(error.message);
    }
});

router.get("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const user = await pool.query("SELECT * FROM users WHERE user_id = $1",
        [id]);
        res.status(200).json(user.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
});

router.post("/", async (req, res) => {
    try {
        const { username } = req.body;
        const newUser = await pool.query(
            "INSERT INTO users (username) VALUES ($1) RETURNING *",
            [username]
        );
        res.status(201).json(newUser.rows[0])
    } catch (error) {
        console.log(error.message);
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {username} = req.body;

        const updateUser = await pool.query('UPDATE users SET username = $1 WHERE user_id = $2',
        [username,id]);

        res.status(200).json("User Updated Succefully!");
    } catch (error) {
        console.log(error.message);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params;

        const deleteUser = await pool.query('DELETE FROM users WHERE user_id = $1' ,
        [id]);

        res.status(200).json("User Deleted Succefully!");
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;