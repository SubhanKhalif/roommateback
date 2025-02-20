import Post from "../models/Post.js";

export const createPost = async (req, res) => {
    const { title, location, rent, description } = req.body; // Include title
  
    const post = await Post.create({
      user: req.user._id,
      title, // Include title
      location,
      rent,
      description,
    });
  
    res.status(201).json(post);
  };
  
  export const searchPosts = async (req, res) => {
    try {
      const { location } = req.query;
  
      if (!location) {
        return res.status(400).json({ message: "Location is required" });
      }
  
      const posts = await Post.find({ location: { $regex: location, $options: "i" } }); // Case-insensitive search
      res.json(posts);
    } catch (error) {
      console.error("Error searching posts:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  export const getUserPosts = async (req, res) => {
    try {
      const userId = req.user._id; // <-- Get user ID from auth middleware
      const posts = await Post.find({ user: userId }).populate("user", "name email location");
      res.json(posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ message: "Server error" });
    }
  };  
  

export const getPosts = async (req, res) => {
  const posts = await Post.find().populate("user", "name email location");
  res.json(posts);
};

// Get all posts
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("user", "name username profilePicture");
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update a post
export const updatePost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error updating post:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
