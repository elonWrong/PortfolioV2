document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function showTyping() {
        // Create typing indicator if it doesn't exist
        let typingDiv = document.getElementById('typing-indicator');
        if (!typingDiv) {
            typingDiv = document.createElement('div');
            typingDiv.id = 'typing-indicator';
            typingDiv.className = 'typing-indicator active';
            typingDiv.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
            chatWindow.appendChild(typingDiv);
        }
        typingDiv.style.display = 'flex';
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function hideTyping() {
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) {
            typingDiv.style.display = 'none';
        }
    }

    function handleInput() {
        const text = userInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            userInput.value = '';

            showTyping();

            // Simulation of AI response
            setTimeout(() => {
                hideTyping();
                const responses = [
                    "That's a great question! I've worked on several LLM projects involving RAG and fine-tuning.",
                    "My tech stack includes Python, PyTorch, LangChain, and React for the frontend.",
                    "I'm passionate about making AI models more accessible and efficient.",
                    "I created this chatbot to demonstrate my ability to integrate AI into web interfaces."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, 'bot');
            }, 1500 + Math.random() * 1000); // Random delay for realism
        }
    }

    sendBtn.addEventListener('click', handleInput);


    // Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });
});
