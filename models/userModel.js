const { db } = require("../config/db.js");
const bcrypt = require("bcrypt");

module.exports = {
    // Create a new user
    createUser: async (password, email, role = "user") => {
        const trx = await db.transaction();
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const [user] = await trx("user").insert(
                {
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    role,
                },
                ["user_id", "email", "role"]
            );
            await trx.commit();
            return user;
        } catch (error) {
            await trx.rollback();
            throw new Error(`Error creating user: ${error.message}`);
        }
    },

    // Retrieve a user by email
    getUserByEmail: async (email) => {
        try {
            const [user] = await db("user")
                .select("user_id", "email", "password", "role")
                .where({ email: email.toLowerCase() });
            if(!user){
                throw new Error("User not found or returned")
            }
            return user;
        } catch (error) {
            throw new Error(`Error retrieving user by email: ${error.message}`);
        }
    },

    // Retrieve a user by user_id
    getUserById: async (user_id) => {
        try {
            const [user] = await db("user")
                .select("user_id", "email", "role")
                .where({ user_id });
            if(!user){
                throw new Error("User not found or returned");
            }
            return user;
        } catch (error) {
            throw new Error(`Error retrieving user by ID: ${error.message}`);
        }
    },

    // Retrieve all users
    getAllUsers: async () => {
        try {
            return await db("user").select("user_id", "email", "role");
        } catch (error) {
            throw new Error(`Error retrieving all users: ${error.message}`);
        }
    },

    // Update user (optionally update password)
    updateUser: async (user_id, email, password) => {
        try {
            const updateFields = { email: email.toLowerCase() };
            
            if (password) {
                updateFields.password = await bcrypt.hash(password, 10);
            }

            const [updatedUser] = await db("user")
                .where({ user_id })
                .update(updateFields, ["user_id", "email", "role"]);

            if(!updatedUser) {
                throw new Error("Error, updated user not returned");
            }
            return updatedUser;
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    },

    // Delete a user
    deleteUser: async (user_id) => {
        try {
            const deleted = await db("user").where({ user_id }).del().returning(["user_id", "email"]);
            return deleted;
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    },
};
