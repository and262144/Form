// api/get-topics.js
import { kv } from '@vercel/kv';

// This should match the list in your frontend or be the single source of truth
const ALL_POSSIBLE_TOPICS = ["Introduction to AI", "Web Development Basics", "Data Science Fundamentals", "Cloud Computing Overview", "Cybersecurity Essentials"];


export default async function handler(request, response) {
    if (request.method !== 'GET') {
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Ensure 'all_topics' is initialized in your KV store if you manage it there.
        // For this example, we use the hardcoded list and check against selected_topics.
        // const allTopicsList = await kv.get('all_topics') || ALL_POSSIBLE_TOPICS; // If you store all_topics in KV

        const selectedTopics = await kv.smembers('selected_topics');
        const availableTopics = ALL_POSSIBLE_TOPICS.filter(topic => !selectedTopics.includes(topic));

        return response.status(200).json(availableTopics);
    } catch (error) {
        console.error('Error fetching topics:', error);
        return response.status(500).json({ message: 'Error fetching topics', error: error.message });
    }
}
