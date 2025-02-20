import User from "../models/User.js"; // Use import instead of require

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Promote a user to admin
export const makeAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isAdmin = true;
        await user.save();
        res.status(200).json({ message: "User promoted to admin" });
    } catch (error) {
        console.error("Error promoting user:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
