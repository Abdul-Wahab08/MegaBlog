import supabase from "../utils/supabase";

export class AuthService {

    async createAccount({ email, password, username }) {
        try {
            console.log(username)
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username }
                }
            })
            console.log("SignUp Data: ", data, error)

            if (error) {
                console.error("Error occurs while creating user's account ", error)
                return null
            }

            // const { data: saveUsernameData, error: saveUsernameError } = await supabase
            // .from("accounts")
            // .update({username})
            // .eq("id", data.user.id)

            //   if(saveUsernameError){
            //     console.error("Error occurs while creating user's account ", saveUsernameError)
            //     return null 
            // }

            // console.log("UsernameSavingData: ", saveUsernameData)      

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
                console.log(error)
                return error
            }

            console.log("SignIn Data", data)
            return data

        } catch (error) {
            console.error("Unexpected error:", error)
            return null
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

    async getSession() {
        try {
            const { data, error } = await supabase.auth.getSession()

            if (error) {
                console.error("Error occurs while fetching sessions ", error)
                return null
            }

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
            return
        }
    }

    async recoverPassword(email) {
        try {
            const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            })

            if (error) {
                console.error("Error occurs during password recovery ", error)
                return false
            }

            return true
        } catch (error) {
            console.error("Unexpected error:", error)
            return false
        }
    }

    async resetPassword(newPassword) {
        try {
            const { data, error } = await supabase.auth.updateUser({ password: newPassword })

            if (error) {
                console.error("Error occurs during password reset: ", error)
                return null
            }

            console.log("ResetPassword Data: ", data)
            return data

        } catch (error) {
            console.error("Unexpected error:", error)
            return null
        }
    }

    async verifyCodeForPasswordRecovery(token_hash){
        try {
          const {data, error} = await supabase.auth.verifyOtp({
            token_hash,
            type: "recovery"
          })  

           if (error) {
                console.error("Error occurs during verification of Code for password recovery: ", error)
                return null
            }

            return data
        } catch (error) {
            console.error("Unexpected error:", error)
            return null
        }
    }

}

const authService = new AuthService()
export default authService


