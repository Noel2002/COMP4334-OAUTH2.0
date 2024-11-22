import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const headers = req.headers;
    if (!headers.authorization) {
        return res.status(401).json({ message: "Missing headers" });
    }
    const token = headers.authorization.split(" ")[1];
    const PUBLIC_KEY = process.env.PUBLIC_KEY;
    if (!PUBLIC_KEY) {
        return res.status(500).json({ message: "Missing public key" });
    }

    const payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
    const userId = payload.sub as string;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return res.status(403).json({ message: "Unauthorized: User not found" });
    }
    if (req.method === "GET") {
        const notes = await prisma.note.findMany({where: {userId}});
        return res.status(200).json(notes);
    } else if (req.method === "POST") {
        const note = await prisma.note.create({
        data: {
            ...req.body,
            userId:user.id
        },
        });
        return res.status(201).json(note);
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}