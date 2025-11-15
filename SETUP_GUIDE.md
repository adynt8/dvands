# Discord Portal Setup Guide

This guide will walk you through setting up the Discord OAuth verification portal step by step.

## Prerequisites

- A Discord account
- A Discord server where you have admin permissions
- Basic knowledge of HTML/JavaScript (optional)
- A web server (instructions below) or static hosting service

## Step 1: Create a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click the **"New Application"** button in the top right
3. Give your application a name (e.g., "My Server Portal")
4. Click **"Create"**

## Step 2: Configure OAuth Settings

1. In your application, navigate to **"OAuth2"** in the left sidebar
2. Under **"OAuth2 URL Generator"** or **"Redirects"**, add your redirect URI:
   - For local testing: `http://localhost:8000/`
   - For production: `https://yourdomain.com/`
3. Click **"Save Changes"**
4. Copy your **Client ID** from the top of the OAuth2 page

## Step 3: Get Your Server (Guild) ID

1. Open Discord
2. Go to **User Settings** → **Advanced**
3. Enable **Developer Mode**
4. Right-click on your server icon
5. Click **"Copy ID"**
6. This is your Guild ID

## Step 4: Configure the Portal

1. In the portal files, copy `config.example.js` to `config.js`:
   ```bash
   cp config.example.js config.js
   ```

2. Open `config.js` in a text editor

3. Replace the placeholder values:
   ```javascript
   window.DISCORD_CONFIG = {
       CLIENT_ID: 'paste_your_client_id_here',
       REDIRECT_URI: 'http://localhost:8000/',  // or your domain
       GUILD_ID: 'paste_your_guild_id_here',
       INVITE_LINK: 'https://discord.gg/yourinvite',  // optional
       SELF_ASSIGNABLE_ROLES: [
           {
               id: 'role_id_1',
               name: 'Member',
               color: '#5865F2'
           }
       ]
   };
   ```

4. Save the file

## Step 5: Run the Portal Locally

Choose one of these methods to start a web server:

### Method 1: Python (Recommended)
```bash
# Navigate to the portal directory
cd /path/to/dvands

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Method 2: Node.js
```bash
# Install http-server globally (one time)
npm install -g http-server

# Run the server
http-server -p 8000
```

### Method 3: PHP
```bash
php -S localhost:8000
```

### Method 4: VS Code Live Server
1. Install the "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

## Step 6: Test the Portal

1. Open your browser
2. Navigate to `http://localhost:8000`
3. You should see the login page
4. Click **"Login with Discord"**
5. Authorize the application
6. You should be redirected back and see your dashboard

## Step 7: Deploy to Production

### Option A: GitHub Pages

1. Create a new repository or use existing
2. Push your portal files (make sure `config.js` is in `.gitignore`)
3. Go to repository **Settings** → **Pages**
4. Select your branch and root folder
5. Click **Save**
6. Your portal will be available at `https://yourusername.github.io/repository-name/`

**Important**: Update `REDIRECT_URI` in both:
- Your `config.js` file
- Discord Developer Portal OAuth settings

### Option B: Netlify

1. Go to [Netlify](https://www.netlify.com/)
2. Drag and drop your portal folder (or connect Git repo)
3. Your site will be deployed automatically
4. Update your `REDIRECT_URI` to the Netlify URL

### Option C: Vercel

1. Go to [Vercel](https://vercel.com/)
2. Import your repository
3. Deploy with default settings
4. Update your `REDIRECT_URI` to the Vercel URL

### Option D: Cloudflare Pages

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Connect your Git repository
3. Deploy with default settings
4. Update your `REDIRECT_URI` to the Cloudflare Pages URL

## Troubleshooting

### "Discord configuration is missing"
- Make sure you created `config.js` from `config.example.js`
- Check that `config.js` is in the same directory as `index.html`

### OAuth redirect not working
- Ensure `REDIRECT_URI` in `config.js` **exactly** matches the one in Discord Developer Portal
- Include the trailing slash if you used one in Discord settings
- Make sure the protocol (http/https) matches

### "Your session has expired"
- This is normal - OAuth tokens expire
- Simply click login again

### Can't join server or assign roles
- This is a client-side limitation
- These features require a Discord bot with server-side implementation
- The portal provides clear messaging about these limitations

### Localhost not working
- Make sure your web server is running
- Check that nothing else is using port 8000
- Try a different port: `python -m http.server 8080`

## Security Best Practices

1. **Never commit `config.js`** to public repositories
2. The `.gitignore` file should always exclude `config.js`
3. Client IDs are safe to expose (they're public in OAuth flow)
4. **Never** put bot tokens or client secrets in client-side code
5. Use HTTPS in production (most hosting services provide this automatically)

## Getting Role IDs (Optional)

If you want to configure `SELF_ASSIGNABLE_ROLES`:

1. In Discord, type `\@rolename` (replace with your role name)
2. Send the message
3. The role ID will appear in the format `<@&123456789>`
4. Copy the numbers (that's the role ID)

## Need Help?

- Check the main [README.md](README.md) for more information
- Review the Discord Developer Portal documentation
- Check your browser's console for errors (F12 → Console tab)

## Next Steps

Once your portal is working:
- Customize the styling in `styles.css`
- Modify the text in `index.html`
- Add your server's branding
- Share the portal link with your community!

For advanced features (role assignment, auto-join), consider implementing a Discord bot with server-side code.
