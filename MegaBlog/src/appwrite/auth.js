import conf from '../conf/conf'
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appWriteUrl)
            .setProject(conf.appWriteProjectId)
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name)
            if (userAccount) {
                return this.login({ email, password })
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password)
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            throw error;
        }

        return null;
    }

    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            throw error;
        }
    }

    async recoverPassword(email) {
    try {
        return await this.account.createRecovery(
            email,
            `${window.location.origin}/reset-password`
        );
    } catch (error) {
        throw error;
    }
}

async resetPassword(userId, secret, newPassword, confirmPassword) {
    try {
        return await this.account.updateRecovery(
            userId,
            secret,
            newPassword,
            confirmPassword
        );
    } catch (error) {
        throw error;
    }
}

}

const authService = new AuthService();

export default authService