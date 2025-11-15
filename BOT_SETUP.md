# Discord Bot Setup Guide

This guide will help you set up the Discord bot required for role management functionality.

## Prerequisites

- Node.js (version 16.9.0 or higher)
- npm (comes with Node.js)
- A Discord account with admin permissions on your server
- Discord Application with OAuth2 configured (from main setup)

## Step 1: Create the Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your existing application (or create a new one)
3. Navigate to the **"Bot"** section in the left sidebar
4. Click **"Add Bot"** (if not already created)
5. Click **"Yes, do it!"** to confirm

## Step 2: Configure Bot Settings

1. Under the bot settings, you can customize:
   - **Username**: The name that will appear in your server
   - **Icon**: Upload an avatar for your bot
   
2. Scroll down to **"Privileged Gateway Intents"** and enable:
   - ✅ **Server Members Intent** (required to manage member roles)
   
3. Click **"Save Changes"**

## Step 3: Get Your Bot Token

1. Under the bot settings, find the **"Token"** section
2. Click **"Reset Token"** (or "Copy" if it's your first time)
3. Click **"Yes, do it!"** to confirm
4. **Copy the token immediately** - you won't be able to see it again!
5. ⚠️ **IMPORTANT**: Keep this token secret! Never share it or commit it to version control.

## Step 4: Invite Bot to Your Server

1. Navigate to **"OAuth2"** → **"URL Generator"** in the left sidebar
2. Under **"Scopes"**, select:
   - ✅ `bot`
   
3. Under **"Bot Permissions"**, select:
   - ✅ `Manage Roles` (required to assign/remove roles)
   - ✅ `View Channels` (required to see server structure)
   - ✅ `Send Messages` (optional, for future features)
   
4. Copy the generated URL at the bottom
5. Open the URL in your browser
6. Select your server from the dropdown
7. Click **"Authorize"**
8. Complete the CAPTCHA if prompted

## Step 5: Configure Environment Variables

1. In the project directory, copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` in a text editor and fill in your values:
   ```env
   # Your bot token from Step 3
   BOT_TOKEN=your_bot_token_here
   
   # Your server (guild) ID - same as in config.js
   GUILD_ID=your_guild_id_here
   
   # Server port (optional, defaults to 3000)
   PORT=3000
   ```

3. Save the file

## Step 6: Install Dependencies

Run the following command in the project directory:

```bash
npm install
```

This will install:
- `discord.js` - Discord API library
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

## Step 7: Start the Server

Run one of the following commands:

```bash
# Standard start
npm start

# Development mode (same as start in this case)
npm run dev
```

You should see:
```
✅ Bot logged in as YourBotName#1234
🚀 Server running on http://localhost:3000
📡 API available at http://localhost:3000/api
```

## Step 8: Configure Role Hierarchy

For the bot to assign roles, it must be positioned higher in the role hierarchy than the roles it manages.

1. In Discord, go to **Server Settings** → **Roles**
2. Drag your bot's role **above** all roles you want it to manage
3. Make sure the bot role has **"Manage Roles"** permission enabled

## Step 9: Update Frontend Configuration

1. If you haven't already, copy `config.example.js` to `config.js`:
   ```bash
   cp config.example.js config.js
   ```

2. Update the `API_URL` in `config.js`:
   ```javascript
   API_URL: 'http://localhost:3000/api',  // For local development
   ```

3. For production deployment, update this to your backend server URL

## Step 10: Test the Bot

1. Open your browser and navigate to `http://localhost:3000`
2. Click **"Login with Discord"**
3. Authorize the application
4. Try assigning/removing roles from the dashboard

## API Endpoints

The bot server provides the following endpoints:

- `GET /api/health` - Check bot status
- `GET /api/user/:userId/roles` - Get user's roles
- `GET /api/roles` - Get all available roles
- `POST /api/user/:userId/roles/:roleId` - Assign role to user
- `DELETE /api/user/:userId/roles/:roleId` - Remove role from user
- `POST /api/user/:userId/join` - Add user to server

## Troubleshooting

### "Bot is not ready yet"
- Wait a few seconds for the bot to connect to Discord
- Check your bot token is correct in `.env`
- Ensure you have a stable internet connection

### "Missing Access" or "Missing Permissions"
- Verify the bot has "Manage Roles" permission
- Check the bot's role is higher than roles it's trying to manage
- Ensure Server Members Intent is enabled

### "Failed to fetch roles"
- Check the bot is online (green status in Discord)
- Verify the GUILD_ID matches your server
- Check server is running on the correct port

### "User is not a member of the server"
- Make sure the user has joined the server
- The OAuth flow requires `guilds.join` scope

### Bot appears offline
- Check BOT_TOKEN is correct in `.env`
- Verify there are no typos or extra spaces
- Try regenerating the bot token

## Security Best Practices

1. **Never commit `.env` file** - It's in `.gitignore` for a reason
2. **Rotate tokens regularly** - If you suspect a token is compromised, regenerate it immediately
3. **Use environment variables** - Never hardcode tokens in source code
4. **Restrict bot permissions** - Only grant necessary permissions
5. **Use HTTPS in production** - Protect data in transit

## Production Deployment

For production deployment, consider:

1. **Host your backend** on a service like:
   - Heroku
   - Railway
   - DigitalOcean
   - AWS
   - Google Cloud

2. **Set environment variables** on your hosting platform
3. **Use HTTPS** for your API endpoint
4. **Update `API_URL`** in your frontend config
5. **Enable proper CORS** settings for your domain
6. **Monitor bot uptime** and set up alerts
7. **Implement rate limiting** to prevent abuse

## Need Help?

- Check the [Discord.js Documentation](https://discord.js.org/)
- Visit the [Discord Developer Documentation](https://discord.com/developers/docs)
- Review the main [README.md](README.md) for general setup
- Check server logs for error messages

## Advanced Configuration

### Custom Role Filters

To limit which roles can be self-assigned, configure `SELF_ASSIGNABLE_ROLES` in `config.js`:

```javascript
SELF_ASSIGNABLE_ROLES: [
    {
        id: 'role_id_here',
        name: 'Member',
        color: '#5865F2'
    }
]
```

Only roles listed here will be shown in the "Available Roles" section.

### Rate Limiting

For production, consider adding rate limiting to prevent abuse:

```bash
npm install express-rate-limit
```

Then add to `server.js`:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Updating the Bot

To update dependencies:

```bash
npm update
```

To update to latest versions:

```bash
npm install discord.js@latest express@latest
```

Always test updates in development before deploying to production!
