import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
          // TODO: fetch user from DB and verify password
          // const user = await getUserByEmail(credentials.email)
          // const isValid = await bcrypt.compare(credentials.password, user.password)
          // if (!isValid) return null
          // return user
        if (!credentials?.email || !credentials?.password) {
          throw new Error("missing email password");
        }
        try {
            await connectDB()
            const user = await User.findOne({email: credentials.email})

            if(!user){
                throw new Error("")
            }

            const isValid = await bcrypt.compare(credentials.password, user.password )
            if(!isValid){
                throw new Error("password doesn't match")
            }
            return {
                id: user._id.toString(),
                email: user.email
            }

        }catch(error){
            console.error("auth error",error)
            throw error 
        }

      },
    }),
  ],
  callbacks: {
    async jwt({token, user}){
      if(user){
        token.id = user.id
      }
      return token;
    },
    async session({ session, user, token }){
      if(session.user){
       session.user.id = token.id as string
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30*24*60*60
  },
  secret: process.env.NEXTAUTH_SECRET,

};