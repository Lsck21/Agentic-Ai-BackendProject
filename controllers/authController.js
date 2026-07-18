const supabase = require("../database/supabase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in Supabase
    const { data, error } = await supabase
        .from("users")
        .insert([
            {
                name,
                email,
                password: hashedPassword
            }
        ])
        .select();

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

    res.status(201).json({
        message: "User registered successfully",
        data
    });
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email);

        if (error) {
            return res.status(400).json({
                error: error.message
            });
        }

        if (data.length === 0) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const user = data[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        console.log("JWT Secret:", process.env.JWT_SECRET);

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};