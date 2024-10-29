// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "@/utils/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

type GetRespionseType = {
    id: string;
    username: string
}[]

type PostResponseType = {
    message: string
}


type ResponseType = GetRespionseType | PostResponseType;

const handleGet = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
}

const handlePost = async(req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    try {
        const user = await prisma.user.create({data: req.body});
        console.log({user});
        
        res.status(200).json({ message: "User created" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user" });
    }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
    if (req.method === "POST") {
        return handlePost(req, res);
    }
    else {
        return handleGet(req, res);
    }
}