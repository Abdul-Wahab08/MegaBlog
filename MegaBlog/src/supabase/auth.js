import supabase from "../utils/supabase";

export class AuthService {

    async createAccount({ email, password }) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) {
                console.error("Error occurs while creating user's account ", error)
                return null
            }

            console.log("SignUp Data: ", data)
            return data
        } catch (error) {
            console.error("Unexpected error:", error)
            return null
        }
    }

    async login({ email, password }) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                console.error("Error occurs while logging in user ", error)
                return
            }

            console.log("SignIn Data", data)
            return data

        } catch (error) {
            console.error("Unexpected error:", error)
        }
    }

    async getCurrentUser() {
        try {
            const { data, error } = await supabase.auth.getUser()

            if (error) {
                console.error("Error occurs while logging in user ", error)
                return null
            }
            console.log("getCurrentUser data: ", data)
            return data

        } catch (error) {
            console.error("Unexpected error:", error)
            return null
        }
    }

    async logout() {
        try {
            const { error } = await supabase.auth.signOut()

            if (error) {
                console.error("Error occurs during logout ", error)
                return
            }

        } catch (error) {
            console.error("Unexpected error:", error)
        }
    }

    async recoverPassword(email) {
        try {
            const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            })

            if (error) {
                console.error("Error occurs during password recovery ", error)
                return null
            }

            return data
        } catch (error) {
            console.error("Unexpected error:", error)
            return null
        }
    }

    async resetPassword({ newPassword }) {
        try {
            const { data, error } = await supabase.auth.updateUser({ password: newPassword })

            if (error) {
                console.error("Error occurs during logout ", error)
                return
            }

            console.log("ResetPassword Data: ", data)
            return data

        } catch (error) {
            console.error("Unexpected error:", error)
        }
    }

}

const authService = new AuthService()
export default authService


