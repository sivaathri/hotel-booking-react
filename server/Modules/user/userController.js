const User = require('./userModel');

exports.register = async (req, res) => {
  try {
    const { username, email, password, mobile } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const userId = await User.create({ username, email, password, mobile });
    res.status(201).json({ message: 'User created successfully', userId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updated = await User.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords (in a real app, you should use bcrypt or similar)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: 'Login successful', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have middleware that adds user to req
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user data without sensitive information
    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    
    // Remove any sensitive fields that shouldn't be updated directly
    delete updates.password;
    delete updates.email;
    
    const updated = await User.update(userId, updates);
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
}; 