# Deployment Guide

This guide covers deploying the Discord Portal with bot integration to production environments.

## Prerequisites

- Node.js 16.9.0 or higher
- npm or yarn
- Discord bot configured (see [BOT_SETUP.md](BOT_SETUP.md))
- A hosting platform account

## Environment Variables

Your production environment must have these environment variables set:

```env
BOT_TOKEN=your_production_bot_token
GUILD_ID=your_guild_id
PORT=3000
NODE_ENV=production
```

⚠️ **Security**: Never commit these values. Use your hosting platform's environment variable settings.

## Deployment Options

### Option 1: Heroku

1. **Install Heroku CLI** and login:
   ```bash
   heroku login
   ```

2. **Create a new Heroku app**:
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables**:
   ```bash
   heroku config:set BOT_TOKEN=your_bot_token
   heroku config:set GUILD_ID=your_guild_id
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

5. **Scale the dyno**:
   ```bash
   heroku ps:scale web=1
   ```

6. **Update Discord OAuth redirect URI** to `https://your-app-name.herokuapp.com/`

### Option 2: Railway

1. **Create a new project** at [Railway](https://railway.app/)

2. **Connect your GitHub repository**

3. **Add environment variables** in the Railway dashboard:
   - `BOT_TOKEN`
   - `GUILD_ID`
   - `NODE_ENV=production`

4. **Deploy** - Railway auto-deploys on git push

5. **Update Discord OAuth redirect URI** to your Railway URL

### Option 3: DigitalOcean App Platform

1. **Create a new app** in [DigitalOcean](https://cloud.digitalocean.com/)

2. **Connect your repository**

3. **Configure the app**:
   - Build Command: `npm install`
   - Run Command: `npm start`
   - HTTP Port: `3000`

4. **Add environment variables** in the app settings

5. **Deploy** and note your app URL

6. **Update Discord OAuth redirect URI**

### Option 4: AWS (EC2)

1. **Launch an EC2 instance** (Ubuntu recommended)

2. **SSH into your instance** and install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone your repository**:
   ```bash
   git clone https://github.com/yourusername/dvands.git
   cd dvands
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Create .env file**:
   ```bash
   nano .env
   # Add your environment variables
   ```

6. **Install PM2** for process management:
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name discord-portal
   pm2 startup
   pm2 save
   ```

7. **Configure nginx** as reverse proxy (optional but recommended)

### Option 5: Google Cloud Run

1. **Create a Dockerfile** in your project root:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and deploy**:
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT-ID/discord-portal
   gcloud run deploy discord-portal \
     --image gcr.io/PROJECT-ID/discord-portal \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars BOT_TOKEN=xxx,GUILD_ID=xxx
   ```

3. **Update Discord OAuth redirect URI** to your Cloud Run URL

## Frontend Configuration

After deploying, you need to configure the frontend:

1. **Create production config**:
   ```bash
   cp public/config.example.js public/config.js
   ```

2. **Edit `public/config.js`**:
   ```javascript
   window.DISCORD_CONFIG = {
       CLIENT_ID: 'your_client_id',
       REDIRECT_URI: 'https://your-production-url.com/',
       GUILD_ID: 'your_guild_id',
       INVITE_LINK: 'https://discord.gg/your_invite',
       API_URL: 'https://your-production-url.com/api',
       SELF_ASSIGNABLE_ROLES: [...]
   };
   ```

3. **Commit and deploy** the config (or set it up via your platform's file editor)

## Discord Application Updates

1. **Update OAuth2 Redirect URIs**:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Navigate to OAuth2 settings
   - Add your production URL: `https://your-production-url.com/`

2. **Verify bot permissions**:
   - Ensure bot has "Manage Roles" permission
   - Check bot role is positioned correctly in role hierarchy

## Post-Deployment Checklist

- [ ] Environment variables are set correctly
- [ ] Bot token is valid and not expired
- [ ] Discord OAuth redirect URI matches production URL
- [ ] Frontend config.js is configured with production values
- [ ] Bot is online in your Discord server
- [ ] Bot role has "Manage Roles" permission
- [ ] Bot role is higher than roles it will manage
- [ ] HTTPS is enabled (required for production OAuth)
- [ ] CORS is configured correctly
- [ ] Test login flow works
- [ ] Test role assignment works
- [ ] Test role removal works
- [ ] Monitor logs for errors

## Monitoring

### Health Check

Your deployment should monitor the `/api/health` endpoint:

```bash
curl https://your-production-url.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "botReady": true
}
```

### Common Issues

**Bot shows as offline**:
- Check BOT_TOKEN is correct
- Verify bot is invited to your server
- Check server logs for connection errors

**OAuth redirect fails**:
- Verify REDIRECT_URI in config.js matches Discord settings exactly
- Ensure HTTPS is used in production
- Check for typos in the URL

**Role assignment fails**:
- Verify bot has "Manage Roles" permission
- Check bot role is higher than target roles
- Ensure Server Members Intent is enabled

**502/504 Gateway Errors**:
- Check server is running: `curl localhost:3000/api/health`
- Verify PORT environment variable matches your platform
- Check server logs for startup errors

## Scaling Considerations

For high-traffic deployments:

1. **Rate Limiting**: Add express-rate-limit to prevent abuse
2. **Load Balancing**: Use multiple instances behind a load balancer
3. **Caching**: Cache role data to reduce Discord API calls
4. **Database**: Consider adding Redis for session management
5. **Monitoring**: Set up application monitoring (e.g., New Relic, Datadog)

## Security Best Practices

1. **Use HTTPS**: Always use HTTPS in production
2. **Environment Variables**: Never commit secrets to git
3. **Token Rotation**: Regularly rotate your bot token
4. **Access Control**: Limit who can access your hosting platform
5. **Logging**: Monitor and log all API requests
6. **Updates**: Keep dependencies updated regularly
7. **Backups**: Backup your configuration and environment variables

## Updating Your Deployment

To update your production deployment:

1. **Test locally first**:
   ```bash
   npm install
   npm start
   # Test thoroughly
   ```

2. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

3. **Platform-specific deployment**:
   - Most platforms auto-deploy on git push
   - Some may require manual trigger

4. **Verify the update**:
   - Check health endpoint
   - Test key functionality
   - Monitor logs for errors

## Rollback Procedure

If something goes wrong:

1. **Heroku**:
   ```bash
   heroku releases
   heroku rollback v123
   ```

2. **Railway/DigitalOcean**: Use the platform UI to redeploy previous version

3. **Manual deployments**: 
   ```bash
   git revert HEAD
   git push
   ```

## Cost Estimates

Approximate monthly costs for various platforms:

- **Heroku**: Free tier available, $7/month for Hobby tier
- **Railway**: $5-10/month for starter projects
- **DigitalOcean**: $5-12/month for basic droplet/app
- **AWS EC2**: $3-10/month for t2.micro instance
- **Google Cloud Run**: Pay per use, typically $1-5/month for low traffic

## Support

For deployment issues:

1. Check [README.md](README.md) for general setup
2. Review [BOT_SETUP.md](BOT_SETUP.md) for bot configuration
3. Check your hosting platform's documentation
4. Review server logs for error messages
5. Open an issue on GitHub with logs and error details

## Maintenance

Regular maintenance tasks:

- **Weekly**: Check bot is online and responsive
- **Monthly**: Review logs for errors or unusual activity
- **Quarterly**: Update dependencies (`npm update`)
- **Yearly**: Rotate bot token and review permissions

Good luck with your deployment! 🚀
