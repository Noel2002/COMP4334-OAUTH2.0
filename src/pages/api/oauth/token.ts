import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken'
import { error } from "console";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { client_id, redirect_uri, scope, state, client_secret, code } = req.body;

    // Validate the request parameters
    if (!client_id || !redirect_uri || !scope || !state || !client_secret || !code) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Find and validate client
    const client = await prisma.client.findUnique({
        where: {id: client_id}
    });

    if (!client) {
        return res.status(401).json({ message: "Invalid client" });
    }

    if (client.secret !== client_secret) {
        return res.status(401).json({ message: "Invalid client secret" });
    }

    // Find and validate session
    const session = await prisma.session.findFirst({where: {authorizationCode: code}});
    if (!session) {
        return res.status(401).json({ message: "Invalid code" });
    }

    if (session.clientId !== client_id) {
        return res.status(401).json({ message: "Invalid client" });
    }

    if (session.status !== "UNUSED") {
        return res.status(401).json({ message: "Invalid code" });
    }

    if (session.expiresAt < new Date()) {
        return res.status(401).json({ message: "Code expired" });
    }

    // Update session status
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = await prisma.session.update({
        where: {id: session.id},
        data: {
            status: "USED"
        }
    });

    // Generate access token

    const private_key = process.env.PRIVATE_KEY;
    if(!private_key) {
        error("Private key not found");
        return res.status(500).json({message: "Internal server error"});
    }
    const accessToken = jwt.sign({userId: session.userId}, private_key, {expiresIn: '1d', algorithm: 'RS256'});

    return res.status(200).json({
        access_token: accessToken,
        token_type: "Bearer",
        expires_in: 86400,
        scope
    });

  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}