# Discord Server Portal

A client-side Discord OAuth verification portal that allows users to verify their Discord accounts and view server information.

## Features

- 🔐 Discord OAuth 2.0 authentication (client-side)
- ✅ Server membership verification
- 👤 User profile display
- 📋 Role display (with server-side limitations noted)
- 🎨 Modern, responsive UI
- 🚀 No server-side code required for basic functionality

## Setup Instructions

### 1. Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Navigate to the "OAuth2" section
4. Add your redirect URI (e.g., `http://localhost:8000/` or your domain)
5. Note down your **Client ID**

### 2. Configure the Portal

1. Copy `config.example.js` to `config.js`:
   ```bash
   cp config.example.js config.js
   ```

2. Edit `config.js` with your Discord application details:
   ```javascript
   window.DISCORD_CONFIG = {
       CLIENT_ID: 'your_client_id_here',
       REDIRECT_URI: 'http://localhost:8000/',
       GUILD_ID: 'your_server_id_here',
       INVITE_LINK: 'https://discord.gg/your_invite',
       SELF_ASSIGNABLE_ROLES: [...]
   };
   ```

3. Get your Guild (Server) ID:
   - Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode)
   - Right-click your server icon and select "Copy ID"

### 3. Run the Portal

Since this is a static site, you can use any web server. Here are some options:

**Option 1: Python**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option 2: Node.js (npx)**
```bash
npx http-server -p 8000
```

**Option 3: PHP**
```bash
php -S localhost:8000
```

Then open your browser and navigate to `http://localhost:8000`

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
3. **Roles**: View available roles (display only with client-side OAuth)

## Limitations (Client-Side OAuth)

Due to client-side OAuth limitations, the following features require server-side implementation:

- **Joining Server**: Cannot automatically add users to server (requires bot)
- **Role Assignment**: Cannot modify user roles (requires bot with Manage Roles permission)
- **Detailed Role Info**: Cannot fetch specific member roles (requires bot)

### Recommended Server-Side Enhancement

For full functionality, consider implementing a backend service with:
- Discord Bot with proper permissions
- REST API endpoints for role management
- Bot token stored securely server-side

## Security Notes

- Never commit `config.js` with real credentials to public repositories
- The `.gitignore` file is configured to exclude `config.js`
- Client IDs are safe to expose publicly (they're used in OAuth flow)
- Never expose your bot token or client secret in client-side code

## File Structure

```
├── index.html           # Main HTML page
├── styles.css          # Styling
├── app.js              # Application logic
├── config.example.js   # Configuration template
├── config.js           # Your configuration (gitignored)
└── README.md           # This file
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

**Issue**: Role assignment doesn't work
- Solution: This is expected! Client-side OAuth cannot modify roles. Implement a bot for this feature.

## Contributing

Feel free to submit issues or pull requests!

## License

MIT License - Feel free to use this for your Discord server!