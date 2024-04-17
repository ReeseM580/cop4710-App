import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/utils/supabase/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const searchTerm: string | string[] | undefined = req.query.searchTerm;
    const supabase = createClient();

    if (!searchTerm || typeof searchTerm !== 'string') {
        res.status(400).json({ error: 'Search term must be provided and be a string' });
        return;
    }

    const { data, error } = await supabase
        .from('users') 
        .select('*')
        .ilike('display_name', `%${searchTerm}%`);

    if (error) {
        console.error('Error searching for users:', error.message);
        res.status(500).json({ error: 'Failed to fetch users' });
    } else {
        res.status(200).json(data);
    }
}
