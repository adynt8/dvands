// Backend Server for Discord Portal
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const DiscordBot = require('./bot');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize bot
const bot = new DiscordBot();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory only (prevents exposure of sensitive files)
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        botReady: bot.isReady()
    });
});

// Get member roles
app.get('/api/user/:userId/roles', async (req, res) => {
    try {
        const { userId } = req.params;
        const roles = await bot.getMemberRoles(userId);
        
        if (roles === null) {
            return res.status(404).json({
                error: 'User is not a member of the server'
            });
        }

        res.json({ roles });
    } catch (error) {
        console.error('Error fetching user roles:', error);
        res.status(500).json({
            error: 'Failed to fetch user roles',
            message: error.message
        });
    }
});

// Get available roles
app.get('/api/roles', async (req, res) => {
    try {
        const roles = await bot.getAvailableRoles();
        res.json({ roles });
    } catch (error) {
        console.error('Error fetching available roles:', error);
        res.status(500).json({
            error: 'Failed to fetch available roles',
            message: error.message
        });
    }
});

// Assign role to user
app.post('/api/user/:userId/roles/:roleId', async (req, res) => {
    try {
        const { userId, roleId } = req.params;
        const result = await bot.assignRole(userId, roleId);
        res.json(result);
    } catch (error) {
        console.error('Error assigning role:', error);
        res.status(500).json({
            error: 'Failed to assign role',
            message: error.message
        });
    }
});

// Remove role from user
app.delete('/api/user/:userId/roles/:roleId', async (req, res) => {
    try {
        const { userId, roleId } = req.params;
        const result = await bot.removeRole(userId, roleId);
        res.json(result);
    } catch (error) {
        console.error('Error removing role:', error);
        res.status(500).json({
            error: 'Failed to remove role',
            message: error.message
        });
    }
});

// Add user to guild
app.post('/api/user/:userId/join', async (req, res) => {
    try {
        const { userId } = req.params;
        const { accessToken } = req.body;

        if (!accessToken) {
            return res.status(400).json({
                error: 'Access token is required'
            });
        }

        const result = await bot.addMemberToGuild(userId, accessToken);
        res.json(result);
    } catch (error) {
        console.error('Error adding user to guild:', error);
        res.status(500).json({
            error: 'Failed to add user to guild',
            message: error.message
        });
    }
});

// Wait for bot to be ready before starting server
const startServer = () => {
    if (bot.isReady()) {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📡 API available at http://localhost:${PORT}/api`);
        });
    } else {
        console.log('⏳ Waiting for bot to be ready...');
        setTimeout(startServer, 1000);
    }
};

startServer();
