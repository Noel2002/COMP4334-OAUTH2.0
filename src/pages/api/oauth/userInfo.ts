import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken'
import prisma from "@/utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Replace '*' with your domain if needed
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    if (req.method === 'OPTIONS') {
      res.status(200).end(); // Respond OK to the OPTIONS request
      return;
    }

    if (req.method === "GET") {
        const headers = req.headers;
        if (!headers.authorization) {
            return res.status(401).json({ message: "Missing headers" });
        }
        const token = headers.authorization.split(" ")[1];
        const PUBLIC_KEY = process.env.PUBLIC_KEY;
        if (!token || !PUBLIC_KEY) {
            return res.status(500).json({ message: "Missing public key" });
        }
        const payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });

        const user = await prisma.user.findUnique({where: {id: payload.sub as string}});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({username: user.username, photo: user.photo});

        return res.status(200).json(payload);

    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;