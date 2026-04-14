import supabase from "../utils/supabase";

export class AuthService {

    async createAccount({ email, password, username }) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username }
                }
            })

            if (error) {
                return { success: false, message: error.message }
            }
            return { success: false, data }
        } catch (error) {
            return { success: false, message: "Unexpected error while login" }
        }
    }

    async login({ email, password }) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                return { success: false, message: error.message }
            }
            return { success: true, data: data }

        } catch (error) {
            return { success: false, message: "Unexpected error while login" }
        }
    }

    async getCurrentUser() {
        try {
            const { data, error } = await supabase.auth.getUser()

            if (error) {
                return null
            }
            return data

        } catch (error) {
            return null
        }
    }

    async getSession() {
        try {
            const { data, error } = await supabase.auth.getSession()

            if (error) {
                return null
            }

            return data
        } catch (error) {
            return null
        }
    }

    async logout() {
        try {
            const { error } = await supabase.auth.signOut()

            if (error) {
                return error.message
            }

        } catch (error) {
            return
        }
    }

    async recoverPassword(email) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            })

            if (error) {
                return false
            }

            return true
        } catch (error) {
            return false
        }
    }

    async resetPassword(newPassword) {
        try {
            const { data, error } = await supabase.auth.updateUser({ password: newPassword })

            if (error) {
                return { success: false, message: error.message }
            }

            return { success: true, data }

        } catch (error) {
            return { success: false, message: "Unexpected Error" }
        }
    }

    async verifyCodeForPasswordRecovery(token_hash) {
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                token_hash,
                type: "recovery"
            })

            if (error) {
                return { success: false, message: error.message }
            }

            return { success: true, data }
        } catch (error) {
            return { success: false, message: "Unexpected Error" }
        }
    }

}

const authService = new AuthService()
export default authService


