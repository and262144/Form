// api/get-topics.js
import { kv } from '@vercel/kv';

// This should match the list in your frontend or be the single source of truth
const ALL_POSSIBLE_TOPICS = [
    "Pollination adaptations",
    "Seed dispersal mechanisms and significance of dispersal",
    "Outbreeding devices in flowering plants and its significance",
    "Polycystic ovarian syndrome",
    "Reproductive health/ Sexually Transmitted Diseases",
    "Deviations from Mendelian Genetics",
    "Genetic Disorders",
    "Mendelian disorders",
    "Chromosomal disorders",
    "Cystic fibrosis",
    "Colourblindness",
    "Haemophilia",
    "Sickle cell anaemia",
    "Thalassemia",
    "Congenital defects- causes and possible remedies",
    "Operon concept",
    "Human Genome Project",
    "DNA Fingerprinting and its applications",
    "Evolution",
    "Malaria: Treatment and prevention",
    "Cancer (can take specific Cancer)",
    "AIDS",
    "CoVID 19",
    "Immunity",
    "Allergies",
    "Auto- immune diseases ( Rheumatoid Arthritis)",
    "Drugs and their significance",
    "Drugs and their abuse",
    "Alcohol abuse",
    "Microbes in human welfare",
    "Tools of biotechnology",
    "Antibiotic resistance",
    "Global warming: How is it related to the outburst of new viral infections such as SARS, MERS, Ebola etc",
    "Applications of biotechnology",
    "Gene editing and its applications",
    "CRISPR Cas 9",
    "RNA interference",
    "Gene therapy",
    "Transgenic animals",
    "Medicinal drugs that are banned across the world",
    "Ethical issues in DNA fingerprinting and biotechnology",
    "Responses of living organisms to abiotic factors in environment.",
    "Adaptations in living organisms",
    "Population interactions",
    "Ecological successions- their significance in evolution",
    "Ecosystem services: How much do we care?",
    "Biodiversity and conservation practices in Indian culture",
    "Habitat destruction and biodiversity loss",
    "Biodiversity and in situ and ex situ conservation",
    "Pollution control: How it happened during CoVid 19?",
    "Biomagnification",
    "Bioinformatics",
    "RNA interference: How is it useful in developing vaccines?",
    "Medicinal plants in our surroundings",
    "Soil less culture techniques and their applications"
];


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