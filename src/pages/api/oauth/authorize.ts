import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { client_id, redirect_uri, response_type, scope, state, code_challenge } = req.query;

        // Validate the request parameters
        if (!client_id || !redirect_uri || !response_type || !scope || !state) {
            return res.status(400).json({ error: 'Invalid request parameters' });
        }

    return res.status(302).redirect(`/login?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}&state=${state}&code_challenge=${code_challenge}`);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}