import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const notes = await prisma.note.findMany();
        return res.status(200).json(notes);
    } else if (req.method === "POST") {
        const note = await prisma.note.create({
        data: {
            ...req.body,
        },
        });
        return res.status(201).json(note);
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}