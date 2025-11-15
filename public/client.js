// Discord OAuth Portal - Client-side Application

class DiscordPortal {
    constructor() {
        this.config = window.DISCORD_CONFIG || {};
        this.accessToken = null;
        this.user = null;
        this.apiUrl = this.config.API_URL || 'http://localhost:3000/api';
        this.init();
    }

    init() {
        // Check if we're coming back from OAuth
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = fragment.get('access_token');

        if (accessToken) {
            this.accessToken = accessToken;
            localStorage.setItem('discord_token', accessToken);
            window.location.hash = ''; // Clean up URL
            this.loadDashboard();
        } else {
            // Check for stored token
            const storedToken = localStorage.getItem('discord_token');
            if (storedToken) {
                this.accessToken = storedToken;
                this.loadDashboard();
            } else {
                this.showLogin();
            }
        }

        this.attachEventListeners();
    }

    attachEventListeners() {
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const retryBtn = document.getElementById('retry-btn');
        const verifyBtn = document.getElementById('verify-btn');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.login());
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }

        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => this.joinServer());
        }
    }

    showLogin() {
        this.hideAllSections();
        document.getElementById('login-section').classList.remove('hidden');
    }

    showDashboard() {
        this.hideAllSections();
        document.getElementById('dashboard-section').classList.remove('hidden');
    }

    showError(message) {
        this.hideAllSections();
        document.getElementById('error-section').classList.remove('hidden');
        document.getElementById('error-message').textContent = message;
    }

    hideAllSections() {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });
    }

    login() {
        if (!this.config.CLIENT_ID || !this.config.REDIRECT_URI) {
            this.showError('Discord configuration is missing. Please check config.js file.');
            return;
        }

        const params = new URLSearchParams({
            client_id: this.config.CLIENT_ID,
            redirect_uri: this.config.REDIRECT_URI,
            response_type: 'token',
            scope: 'identify guilds guilds.join guilds.members.read'
        });

        window.location.href = `https://discord.com/api/oauth2/authorize?${params}`;
    }

    logout() {
        localStorage.removeItem('discord_token');
        this.accessToken = null;
        this.user = null;
        this.showLogin();
    }

    async loadDashboard() {
        try {
            this.showDashboard();
            
            // Fetch user info
            await this.fetchUserInfo();
            
            // Check server membership
            await this.checkServerMembership();
            
            // Load roles if member
            await this.loadUserRoles();
            await this.loadAvailableRoles();
        } catch (error) {
            console.error('Error loading dashboard:', error);
            if (error.message.includes('401')) {
                localStorage.removeItem('discord_token');
                this.showError('Your session has expired. Please login again.');
            } else {
                this.showError(`Failed to load dashboard: ${error.message}`);
            }
        }
    }

    async fetchUserInfo() {
        const response = await fetch('https://discord.com/api/v10/users/@me', {
            headers: {
                Authorization: `Bearer ${this.accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`${response.status}: Failed to fetch user info`);
        }

        this.user = await response.json();
        this.displayUserInfo();
    }

    displayUserInfo() {
        const avatarUrl = this.user.avatar
            ? `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png?size=256`
            : `https://cdn.discordapp.com/embed/avatars/${parseInt(this.user.discriminator) % 5}.png`;

        document.getElementById('user-avatar').src = avatarUrl;
        document.getElementById('user-name').textContent = this.user.username;
        document.getElementById('user-id').textContent = `ID: ${this.user.id}`;
    }

    async checkServerMembership() {
        const statusBox = document.getElementById('verification-status');
        const verifyBtn = document.getElementById('verify-btn');

        try {
            const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch guilds');
            }

            const guilds = await response.json();
            const isMember = guilds.some(guild => guild.id === this.config.GUILD_ID);

            if (isMember) {
                statusBox.className = 'status-box success';
                statusBox.innerHTML = '<p>✅ You are verified and a member of the server!</p>';
                verifyBtn.classList.add('hidden');
            } else {
                statusBox.className = 'status-box warning';
                statusBox.innerHTML = '<p>⚠️ You are not yet a member of the server. Click below to join!</p>';
                verifyBtn.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error checking membership:', error);
            statusBox.className = 'status-box error';
            statusBox.innerHTML = '<p>❌ Unable to verify server membership.</p>';
        }
    }

    async joinServer() {
        const statusBox = document.getElementById('verification-status');
        const verifyBtn = document.getElementById('verify-btn');

        statusBox.className = 'status-box';
        statusBox.innerHTML = '<p>⏳ Attempting to add you to the server...</p>';
        
        try {
            const response = await fetch(`${this.apiUrl}/user/${this.user.id}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accessToken: this.accessToken
                })
            });

            const data = await response.json();

            if (response.ok) {
                statusBox.className = 'status-box success';
                statusBox.innerHTML = '<p>✅ Successfully joined the server!</p>';
                verifyBtn.classList.add('hidden');
                // Reload roles
                await this.loadUserRoles();
            } else {
                throw new Error(data.message || 'Failed to join server');
            }
        } catch (error) {
            console.error('Error joining server:', error);
            statusBox.className = 'status-box error';
            statusBox.innerHTML = `<p>❌ Failed to join server: ${error.message}</p>`;
            
            if (this.config.INVITE_LINK) {
                statusBox.innerHTML += `<p><a href="${this.config.INVITE_LINK}" target="_blank" class="btn btn-primary" style="margin-top: 10px;">Use Invite Link Instead</a></p>`;
            }
        }
    }

    async loadUserRoles() {
        const container = document.getElementById('roles-container');
        
        if (!this.user || !this.user.id) {
            container.innerHTML = '<p class="info-text">User not loaded.</p>';
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/user/${this.user.id}/roles`);
            
            if (response.status === 404) {
                container.innerHTML = '<p class="info-text">You are not a member of the server yet.</p>';
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }

            const data = await response.json();
            const roles = data.roles || [];

            if (roles.length === 0) {
                container.innerHTML = `
                    <div class="role-item">
                        <span><span class="role-color" style="background: #5865F2;"></span><span class="role-name">@everyone</span></span>
                    </div>
                `;
            } else {
                container.innerHTML = '';
                roles.forEach(role => {
                    const roleDiv = document.createElement('div');
                    roleDiv.className = 'role-item';
                    roleDiv.innerHTML = `
                        <span>
                            <span class="role-color" style="background: ${role.color || '#99AAB5'};"></span>
                            <span class="role-name">${role.name}</span>
                        </span>
                    `;
                    container.appendChild(roleDiv);
                });
            }
        } catch (error) {
            console.error('Error loading user roles:', error);
            container.innerHTML = '<p class="info-text error">⚠️ Failed to load roles from server.</p>';
        }
    }

    async loadAvailableRoles() {
        const container = document.getElementById('available-roles-container');

        try {
            const response = await fetch(`${this.apiUrl}/roles`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch available roles');
            }

            const data = await response.json();
            const roles = data.roles || [];

            if (roles.length === 0) {
                container.innerHTML = '<p class="info-text">No self-assignable roles available.</p>';
                return;
            }

            // Get user's current roles
            const userRolesResponse = await fetch(`${this.apiUrl}/user/${this.user.id}/roles`);
            let userRoleIds = [];
            
            if (userRolesResponse.ok) {
                const userRolesData = await userRolesResponse.json();
                userRoleIds = (userRolesData.roles || []).map(r => r.id);
            }

            container.innerHTML = '';
            
            // Filter roles based on config if SELF_ASSIGNABLE_ROLES is defined
            const allowedRoleIds = this.config.SELF_ASSIGNABLE_ROLES?.map(r => r.id) || [];
            const displayRoles = allowedRoleIds.length > 0 
                ? roles.filter(role => allowedRoleIds.includes(role.id))
                : roles;

            if (displayRoles.length === 0) {
                container.innerHTML = '<p class="info-text">No self-assignable roles configured.</p>';
                return;
            }

            displayRoles.forEach(role => {
                const hasRole = userRoleIds.includes(role.id);
                const roleDiv = document.createElement('div');
                roleDiv.className = 'role-item';
                roleDiv.innerHTML = `
                    <span>
                        <span class="role-color" style="background: ${role.color || '#99AAB5'};"></span>
                        <span class="role-name">${role.name}</span>
                    </span>
                    <button class="btn btn-${hasRole ? 'secondary' : 'primary'} btn-sm" onclick="portal.toggleRole('${role.id}', ${hasRole})">
                        ${hasRole ? 'Remove' : 'Assign'}
                    </button>
                `;
                container.appendChild(roleDiv);
            });
        } catch (error) {
            console.error('Error loading available roles:', error);
            container.innerHTML = '<p class="info-text error">⚠️ Failed to load available roles from server.</p>';
        }
    }

    async toggleRole(roleId, hasRole) {
        try {
            const method = hasRole ? 'DELETE' : 'POST';
            const response = await fetch(`${this.apiUrl}/user/${this.user.id}/roles/${roleId}`, {
                method: method
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update role');
            }

            const result = await response.json();
            alert(result.message || (hasRole ? 'Role removed successfully!' : 'Role assigned successfully!'));
            
            // Reload roles
            await this.loadUserRoles();
            await this.loadAvailableRoles();
        } catch (error) {
            console.error('Error toggling role:', error);
            alert(`Failed to ${hasRole ? 'remove' : 'assign'} role: ${error.message}`);
        }
    }
}

// Initialize the portal when DOM is ready
let portal;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        portal = new DiscordPortal();
    });
} else {
    portal = new DiscordPortal();
}
