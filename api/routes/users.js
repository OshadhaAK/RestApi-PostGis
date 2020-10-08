const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log({username, email, password})
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        let errors = [];
        const checkemail = await pool.query(
            "SELECT * FROM users where email = $1",
            [email],
            (err, results) => {
                if(err){
                    throw err;
                }
                console.log(results.rows);

                if(results.rows.length > 0){
                    errors.push({ message: "Email already Exist!"});
                    res.status(500).json({ message: "Email already exists!"});
                }
                else{
                    const newUser = pool.query(
                        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
                        [username, email, hashedPassword]
                    );
                    res.status(201).json({message:"User added Succefully!"});
                }
            }
        );

        
    } catch (error) {
        console.log(error.message);
    }
});

router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log({email, password});
        const authenticateUser = await pool.query(
            "SELECT * FROM users where email = $1",
            [email],
            (err, results) => {
                if(err){
                    throw err;
                }
                console.log(results.rows);

                if(results.rows.length > 0){
                    const user = results.rows[0];
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err){
                            throw err
                        }
                        if(isMatch){
                            const token = jwt.sign({
                                email: user.email,
                                userName: user.username
                            }, 
                            process.env.JWT_KEY,
                            {
                                expiresIn: "1h"
                            });
                            res.status(200).json({
                                message: "success",
                                // userCredentials: user,
                                token: token
                            });
                        }
                        else{
                            res.status(500).json({
                                message: "Password is invalid!",
                                token: null
                            });
                        }
                    });
                    
                }
                else{
                    res.status(500).json({
                        message: "Email is not registered!",
                        token: null
                    });
                    
                }
            });       
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;