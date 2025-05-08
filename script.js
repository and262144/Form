// script.js

document.addEventListener('DOMContentLoaded', () => {
    const topicForm = document.getElementById('topicForm');
    const nameInput = document.getElementById('name');
    const topicDropdown = document.getElementById('topic');
    const messageDiv = document.getElementById('message');
    const responsesTableBody = document.querySelector('#responsesTable tbody');

    // --- CONFIGURATION ---
    // Define your initial list of topics.
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

    async function fetchAndPopulateTopics() {
        try {
            const response = await fetch('/api/get-topics'); // Your Vercel serverless function
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const availableTopics = await response.json();

            topicDropdown.innerHTML = '<option value="">Select a topic</option>'; // Clear existing
            ALL_POSSIBLE_TOPICS.forEach(topic => {
                if (availableTopics.includes(topic)) {
                    const option = document.createElement('option');
                    option.value = topic;
                    option.textContent = topic;
                    topicDropdown.appendChild(option);
                } else {
                    // Optionally, show taken topics as disabled
                    const option = document.createElement('option');
                    option.value = topic;
                    option.textContent = `${topic} (Taken)`;
                    option.disabled = true;
                    topicDropdown.appendChild(option);
                }
            });
        } catch (error) {
            console.error('Error fetching topics:', error);
            topicDropdown.innerHTML = '<option value="">Error loading topics</option>';
            messageDiv.textContent = 'Could not load topics.';
            messageDiv.style.color = 'red';
        }
    }

    // ... rest of your script.js file (fetchAndDisplayResponses, form event listener, etc.)
    async function fetchAndDisplayResponses() {
        try {
            const response = await fetch('/api/get-responses'); // Your Vercel serverless function
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const responses = await response.json();

            responsesTableBody.innerHTML = ''; // Clear existing rows
            responses.forEach(res => {
                const row = responsesTableBody.insertRow();
                const cell1 = row.insertCell();
                const cell2 = row.insertCell();
                cell1.textContent = res.name;
                cell2.textContent = res.topic;
            });
        } catch (error) {
            console.error('Error fetching responses:', error);
            // Don't overwrite general messages here unless specific to this action
            // messageDiv.textContent = 'Could not load responses.';
            // messageDiv.style.color = 'red';
        }
    }

    topicForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        messageDiv.textContent = ''; // Clear previous messages

        const name = nameInput.value.trim();
        const topic = topicDropdown.value;

        if (!name || !topic) {
            messageDiv.textContent = 'Please enter your name and select a topic.';
            messageDiv.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('/api/submit-topic', { // Your Vercel serverless function
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, topic }),
            });

            const result = await response.json();

            if (response.ok) {
                messageDiv.textContent = result.message || 'Submission successful!';
                messageDiv.style.color = 'green';
                topicForm.reset();
                fetchAndPopulateTopics(); // Refresh topics
                fetchAndDisplayResponses(); // Refresh responses table
            } else {
                messageDiv.textContent = result.message || 'Submission failed. Topic might be taken.';
                messageDiv.style.color = 'red';
                fetchAndPopulateTopics(); // Refresh topics to show currently available ones
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            messageDiv.textContent = 'An error occurred during submission.';
            messageDiv.style.color = 'red';
        }
    });

    // Initial load
    fetchAndPopulateTopics();
    fetchAndDisplayResponses();
});