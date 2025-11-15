# Discord Server Portal

A client-side Discord OAuth verification portal that allows users to verify their Discord accounts and view server information.

## Features

- 🔐 Discord OAuth 2.0 authentication
- ✅ Server membership verification
- 👤 User profile display
- 🤖 **Discord Bot integration for role management**
- 📋 Real-time role display and assignment
- ➕ Auto-join server functionality
- 🎨 Modern, responsive UI
- 🚀 Backend server with Express and Discord.js

## Quick Start

### Prerequisites

- Node.js (version 16.9.0 or higher)
- npm (comes with Node.js)
- Discord account with admin permissions on your server

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dvands.git
   cd dvands
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your Discord application and bot (see detailed guides below)

4. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your bot token and guild ID
   ```

5. Configure the portal:
   ```bash
   cp config.example.js config.js
   # Edit config.js with your Discord application details
   ```

6. Start the server:
   ```bash
   npm start
   ```

7. Open your browser and navigate to `http://localhost:3000`

## Detailed Setup Instructions

### 1. Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Navigate to the "OAuth2" section
4. Add your redirect URI (e.g., `http://localhost:3000/` for local development)
5. Note down your **Client ID**

### 2. Set Up the Discord Bot

**For complete bot setup instructions, see [BOT_SETUP.md](BOT_SETUP.md)**

Quick steps:
1. In your Discord application, go to the "Bot" section
2. Click "Add Bot"
3. Enable "Server Members Intent"
4. Copy your bot token
5. Invite the bot to your server with "Manage Roles" permission

### 3. Configure the Portal

1. Copy `config.example.js` to `config.js`:
   ```bash
   cp config.example.js config.js
   ```

2. Edit `config.js` with your Discord application details:
   ```javascript
   window.DISCORD_CONFIG = {
       CLIENT_ID: 'your_client_id_here',
       REDIRECT_URI: 'http://localhost:3000/',
       GUILD_ID: 'your_server_id_here',
       INVITE_LINK: 'https://discord.gg/your_invite',
       API_URL: 'http://localhost:3000/api',
       SELF_ASSIGNABLE_ROLES: [...]
   };
   ```

3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your bot token:
   ```env
   BOT_TOKEN=your_bot_token_here
   GUILD_ID=your_guild_id_here
   PORT=3000
   ```

5. Get your Guild (Server) ID:
   - Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode)
   - Right-click your server icon and select "Copy ID"

### 3. Run the Portal

Start the Node.js server with the integrated bot:

```bash
npm start
```

The server will:
- Start the Express backend on port 3000 (or your configured PORT)
- Connect the Discord bot
- Serve the static frontend files
- Provide API endpoints for role management

Then open your browser and navigate to `http://localhost:3000`

**Note:** The old static-only hosting methods (Python, PHP) will only show the frontend without bot functionality.

### 4. Deploy to Production

You can deploy this to any static hosting service:

- **GitHub Pages**: Push to a repository and enable GitHub Pages
- **Netlify**: Drag and drop the folder or connect your repository
- **Vercel**: Import your repository
- **Cloudflare Pages**: Connect your repository

**Important**: Don't forget to update the `REDIRECT_URI` in your Discord application settings and `config.js` to match your production URL!

## Usage

1. **Login**: Click "Login with Discord" to authenticate
2. **Verification**: Check your server membership status
3. **Join Server**: Automatically join the server with one click (via bot)
4. **View Roles**: See your current roles in the server
5. **Manage Roles**: Assign or remove self-assignable roles
6. **Logout**: Clear your session when done

## Features in Detail

### ✅ Full Role Management

With the integrated Discord bot, the portal now provides:

- **Real-time Role Display**: See your actual roles from the server
- **Role Assignment**: Assign yourself allowed roles with one click
- **Role Removal**: Remove roles you no longer want
- **Auto-Join**: Join the server directly through the portal
- **Member Verification**: Automatic verification when you join

### 🔐 Secure Backend

- Bot token stored securely in environment variables
- API endpoints protected and validated
- CORS enabled for secure cross-origin requests
- No sensitive data exposed to the client

## Security Notes

- Never commit `config.js` with real credentials to public repositories
- The `.gitignore` file is configured to exclude `config.js`
- Client IDs are safe to expose publicly (they're used in OAuth flow)
- Never expose your bot token or client secret in client-side code

## File Structure

```
├── index.html           # Main HTML page
├── styles.css          # Styling
├── client.js           # Frontend application logic
├── server.js           # Backend Express server
├── bot.js              # Discord bot implementation
├── config.example.js   # Frontend configuration template
├── config.js           # Your frontend configuration (gitignored)
├── .env.example        # Backend environment template
├── .env                # Your backend configuration (gitignored)
├── package.json        # Node.js dependencies
├── README.md           # This file
└── BOT_SETUP.md        # Detailed bot setup guide
```

## OAuth Scopes Used

- `identify`: Read user profile information
- `guilds`: Read user's guild memberships
- `guilds.join`: Allow bot to add user to guild (requires bot)
- `guilds.members.read`: Read guild member information (limited without bot)

## Troubleshooting

**Issue**: "Discord configuration is missing"
- Solution: Make sure you've created `config.js` from `config.example.js`

**Issue**: OAuth redirect not working
- Solution: Ensure `REDIRECT_URI` in `config.js` matches exactly with Discord app settings

**Issue**: "Your session has expired"
- Solution: Click login again to re-authenticate

**Issue**: "Bot is not ready yet"
- Solution: Wait a few seconds for the bot to connect, check your `.env` file has correct BOT_TOKEN

**Issue**: Role assignment fails
- Solution: Ensure the bot's role is higher than the roles it's trying to manage in Discord's role hierarchy

**Issue**: Cannot connect to API
- Solution: Make sure the server is running (`npm start`) and `API_URL` in `config.js` is correct

For more troubleshooting, see [BOT_SETUP.md](BOT_SETUP.md)

## Contributing

Feel free to submit issues or pull requests!

## License

MIT License - Feel free to use this for your Discord server!