// Example structure for script.js

document.addEventListener('DOMContentLoaded', () => {
    const topicForm = document.getElementById('topicForm');
    const nameInput = document.getElementById('name');
    const topicDropdown = document.getElementById('topic');
    const messageDiv = document.getElementById('message');
    const responsesTableBody = document.querySelector('#responsesTable tbody');

    // --- CONFIGURATION ---
    // Define your initial list of topics. This could also be managed in your database.
    const ALL_POSSIBLE_TOPICS = ["Introduction to AI", "Web Development Basics", "Data Science Fundamentals", "Cloud Computing Overview", "Cybersecurity Essentials"];

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
            messageDiv.textContent = 'Could not load responses.';
            messageDiv.style.color = 'red';
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
