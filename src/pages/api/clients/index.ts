import prisma from "@/utils/prisma";
import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { name, redirect_uri } = req.body;
        if (!name || !redirect_uri) {
            return res.status(400).json({ error: "Invalid request parameters" });
        }

        const secret = crypto.randomBytes(16).toString("hex");
        const client = await prisma.client.create({
            data: {
                name,
                secret,
                redirectUri: redirect_uri
            }
        });
        return res.status(201).json(client);
    }
    else {
        const clients = await prisma.client.findMany();
        return res.status(200).json(clients);
    }

}