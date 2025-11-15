// Discord Bot for Role Management
require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');

class DiscordBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers
            ]
        });

        this.guildId = process.env.GUILD_ID;
        this.ready = false;
        this.initializeBot();
    }

    initializeBot() {
        this.client.once('ready', () => {
            console.log(`✅ Bot logged in as ${this.client.user.tag}`);
            this.ready = true;
        });

        this.client.on('error', (error) => {
            console.error('Discord client error:', error);
        });

        // Login to Discord
        this.client.login(process.env.BOT_TOKEN).catch(error => {
            console.error('Failed to login bot:', error);
            process.exit(1);
        });
    }

    async getGuild() {
        if (!this.ready) {
            throw new Error('Bot is not ready yet');
        }
        return await this.client.guilds.fetch(this.guildId);
    }

    async getMember(userId) {
        const guild = await this.getGuild();
        try {
            return await guild.members.fetch(userId);
        } catch (error) {
            if (error.code === 10007) {
                return null; // Member not found
            }
            throw error;
        }
    }

    async getMemberRoles(userId) {
        const member = await this.getMember(userId);
        if (!member) {
            return null;
        }

        return member.roles.cache.map(role => ({
            id: role.id,
            name: role.name,
            color: role.hexColor,
            position: role.position
        })).filter(role => role.name !== '@everyone');
    }

    async assignRole(userId, roleId) {
        const member = await this.getMember(userId);
        if (!member) {
            throw new Error('User is not a member of the server');
        }

        const guild = await this.getGuild();
        const role = guild.roles.cache.get(roleId);
        
        if (!role) {
            throw new Error('Role not found');
        }

        await member.roles.add(role);
        return {
            success: true,
            message: `Role ${role.name} assigned successfully`
        };
    }

    async removeRole(userId, roleId) {
        const member = await this.getMember(userId);
        if (!member) {
            throw new Error('User is not a member of the server');
        }

        const guild = await this.getGuild();
        const role = guild.roles.cache.get(roleId);
        
        if (!role) {
            throw new Error('Role not found');
        }

        await member.roles.remove(role);
        return {
            success: true,
            message: `Role ${role.name} removed successfully`
        };
    }

    async getAvailableRoles() {
        const guild = await this.getGuild();
        const botMember = await guild.members.fetch(this.client.user.id);
        const botHighestRole = botMember.roles.highest;

        return guild.roles.cache
            .filter(role => {
                return role.name !== '@everyone' && 
                       role.position < botHighestRole.position &&
                       !role.managed;
            })
            .map(role => ({
                id: role.id,
                name: role.name,
                color: role.hexColor,
                position: role.position
            }))
            .sort((a, b) => b.position - a.position);
    }

    async addMemberToGuild(userId, accessToken) {
        const guild = await this.getGuild();
        
        try {
            const member = await guild.members.add(userId, {
                accessToken: accessToken
            });
            return {
                success: true,
                member: {
                    id: member.id,
                    username: member.user.username
                }
            };
        } catch (error) {
            if (error.code === 30001) {
                throw new Error('User is already a member of the server');
            }
            throw error;
        }
    }

    isReady() {
        return this.ready;
    }
}

module.exports = DiscordBot;
