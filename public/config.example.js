// Discord OAuth Configuration
// Copy this file to 'config.js' and fill in your Discord application details

window.DISCORD_CONFIG = {
    // Your Discord Application Client ID
    // Get this from: https://discord.com/developers/applications
    CLIENT_ID: '1438380414837198980',
    
    // The redirect URI configured in your Discord application
    // This should match the URL where you're hosting this portal
    // Example: 'https://yourdomain.com/' or 'http://localhost:8000/'
    REDIRECT_URI: 'https://halcyon.ronanhayes.net',
    
    // Your Discord Server (Guild) ID
    // Enable Developer Mode in Discord, right-click your server, and click "Copy ID"
    GUILD_ID: '1389170659053277205',
    
    // Optional: Discord server invite link (for manual joining)
    INVITE_LINK: 'https://discord.gg/RB2UZeK9SX',
    
    // Backend API URL (for bot integration)
    // For local development: 'http://localhost:3000/api'
    // For production: 'https://your-backend-url.com/api'
    API_URL: 'https://halcyon.ronanhayes.net/api',
    
    // Optional: List of self-assignable roles
    // Note: Actual role assignment requires a bot with server-side implementation
    // This is for display purposes to show what roles would be available
    SELF_ASSIGNABLE_ROLES: [
        {
            id: 'ROLE_ID_1',
            name: 'Member',
            color: '#5865F2'
        },
        {
            id: 'ROLE_ID_2',
            name: 'Verified',
            color: '#43B581'
        }
        // Add more roles as needed
    ]
};
