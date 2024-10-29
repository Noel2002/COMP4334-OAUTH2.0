import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST"){
    try {
        const { username, password, redirect_uri, scope, state, client_id } = req.body;

        const client = await prisma.client.findUnique({ where: { id: client_id } });;
        if (!client) {
            console.error("Invalid client");            
            return res.status(401).json({ message: "Invalid client" });
        }

        if(client.redirectUri !== redirect_uri) {
            console.error("Invalid redirect uri");
            return res.status(401).json({ message: "Invalid redirect uri" });
        }

        const user = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if (!user) {
            console.error("User cannot be found");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (user.password !== password) {
            console.error("Invalid passwrord");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const authCode = crypto.randomBytes(16).toString("hex");

        const session = await prisma.session.create({
            data: {
                authorizationCode: authCode,
                clientId: client_id,
                userId: user.id,
                scope,
                status: "UNUSED",
                state,
                expiresAt: new Date(Date.now() + 1000 * 60 * 5) // 5 minutes
            }
        });

        console.log({ session });
        
        return res.status(200).json({ authCode });
    } catch (error) {
        console.error(error);
        
        return res.status(500).json({ message: "Error while genereting auth code" });
    }
  }
}