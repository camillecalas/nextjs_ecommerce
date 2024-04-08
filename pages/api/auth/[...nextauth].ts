import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import GoogleProvider from "next-auth/providers/google"
import Stripe from "stripe"

const prisma = new PrismaClient()

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  //ONLY IF USER DOESNT EXIST
  events:{
	createUser: async({user}) => {
		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
			apiVersion:'2022-11-15'
		})
		//Create a stripe user
		if (user.name && user.email) {

			const costumer = await stripe.customers.create({
				email: user.email,
				name: user.name,
			})
			//Update prisma with stripe customer id
			await prisma.user.update({
				where: {id: user.id},
				data: {stripeCustomerId: costumer.id}
			})
		}
	}
  }
}

export default NextAuth(authOptions)
// Export authOptions for use in other modules
export { authOptions }
