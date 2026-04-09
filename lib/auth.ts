import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle OAuth sign-ins
      if (account?.provider === "google") {
        try {
          await connectDB();
          console.log("Google sign-in attempt for:", user.email);
          
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser && user.email) {
            // Create new user for OAuth
            console.log("Creating new Google user:", user.email);
            const newUser = await User.create({
              email: user.email,
              provider: account.provider,
            });
            console.log("New user created:", newUser._id, newUser.email);
          } else if (existingUser) {
            // Update provider info for existing user
            console.log("Updating existing user:", existingUser._id);
            existingUser.provider = account.provider;
            await existingUser.save();
          }
          return true;
        } catch (error) {
          console.error("OAuth sign-in error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({token, user, account}){
      if(user){
        token.id = user.id
      }
      // For Google OAuth, fetch user from DB to get the MongoDB _id
      if(account?.provider === "google" && !token.id && token.email){
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email });
          if(dbUser){
            token.id = dbUser._id.toString();
          }
        } catch (error) {
          console.error("JWT callback error:", error);
        }
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