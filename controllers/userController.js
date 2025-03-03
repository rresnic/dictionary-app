const usersModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
    registerUser: async (req, res) => {
        const { password, email } = req.body;
        try {
            const user = await usersModel.createUser(password, email);
            res.status(201).json({
                message: "User registered successfully",
                user,
            });
        } catch (error) {
            console.log(error);
            if (error.code === "23505") {
                res.status(500).json({
                    message: "Email already exists",
                });
            } else {
                res.status(500).json({
                    message: "Internal Server Error",
                });
            }
        }
    },

    registerAdmin: async (req, res) => {
        const { password, email } = req.body;
        try {
            const user = await usersModel.createUser(password, email, "admin");
            res.status(201).json({
                message: "Admin registered successfully",
                user,
            });
        } catch (error) {
            console.log(error);
            if (error.code === "23505") {
                res.status(500).json({
                    message: "Email already exists",
                });
            } else {
                res.status(500).json({
                    message: "Internal Server Error",
                });
            }
        }
    },

    loginUser: async (req, res) => {
        const { password, email } = req.body;
        try {
            const user = await usersModel.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: "Wrong password" });
            }

            const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

            const accessToken = jwt.sign(
                { userid: user.user_id, email: user.email, role: user.role },
                ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            const refreshToken = jwt.sign(
                { userid: user.user_id },
                REFRESH_TOKEN_SECRET,
                { expiresIn: "7d" }
            );

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 15 * 60 * 1000,
                secure: true,
                sameSite: "None",
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: "None",
            });

            res.status(200).json({
                message: "Login successful",
                user: { userid: user.user_id, email: user.email, role: user.role },
                accessToken,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error",
            });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await usersModel.getUsers();
            res.status(200).json(users);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error",
            });
        }
    },

    logoutUser: async (req, res) => {
        res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "None" });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "None" });
        res.sendStatus(200);
    },

    verifyAuth: (req, res) => {
        const { userid, email, role } = req.user;
        const { ACCESS_TOKEN_SECRET } = process.env;
        const newAccessToken = jwt.sign(
            { userid, email, role },
            ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 15 * 60 * 1000,
            sameSite: "None",
        });

        res.json({
            message: "Token refreshed",
            user: { userid, email, role },
            accessToken: newAccessToken,
        });
    },

    updateUser: async (req, res) => {
        const { user_id } = req.params;
        const { email, password } = req.body;

        try {
            let hashedPassword = null;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            }

            const updatedUser = await usersModel.updateUser(user_id, email, hashedPassword);
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({
                message: "User updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    deleteUser: async (req, res) => {
        const { user_id } = req.params;
        try {
            const deleted = await usersModel.deleteUser(user_id);
            if (!deleted) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ message: "User deleted successfully", deleted });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
};
