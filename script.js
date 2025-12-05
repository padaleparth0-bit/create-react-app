// Data
const categories = [
    { key: 'ppt', label: 'PPT Generation', icon: '📊' },
    { key: 'app', label: 'App Generation', icon: '💻' },
    { key: 'image', label: 'Image Creation', icon: '🎨' },
    { key: 'video', label: 'Video Making', icon: '🎬' },
    { key: 'photo', label: 'Photo Edit/Design', icon: '📷' },
    { key: 'study', label: 'Study AI', icon: '📚' },
];

const tools = {
    ppt: [
        { name: 'Gamma', url: 'https://gamma.app/', desc: 'AI-powered slide creator for stunning presentations. Transform your ideas into polished decks in seconds.' },
        { name: 'SlidesAI', url: 'https://slidesai.io/', desc: 'Transform text into professional presentations automatically. Perfect for quick turnarounds.' },
        { name: 'Tome', url: 'https://tome.app/', desc: 'AI storytelling for impactful presentations. Create narratives that captivate your audience.' },
        { name: 'Beautiful.ai', url: 'https://www.beautiful.ai/', desc: 'Smart templates that design themselves. Professional presentations made effortless.' },
        { name: 'Pitch', url: 'https://pitch.com/', desc: 'Collaborative presentation software with AI-powered design suggestions.' },
        { name: 'Canva Presentations', url: 'https://www.canva.com/presentations/', desc: 'Design stunning presentations with AI-powered tools and thousands of templates.' },
    ],
    app: [
        { name: 'Replit', url: 'https://replit.com/', desc: 'AI-powered coding environment for instant apps. Build, test, and deploy from your browser.' },
        { name: 'Cursor', url: 'https://cursor.sh/', desc: 'AI code editor that writes alongside you. The future of programming is here.' },
        { name: 'V0', url: 'https://v0.dev/', desc: 'Generate UI components with AI. From description to React code instantly.' },
        { name: 'Bolt', url: 'https://bolt.new/', desc: 'Build full-stack web apps with AI. Deploy production-ready applications fast.' },
        { name: 'GitHub Copilot', url: 'https://github.com/features/copilot', desc: 'Your AI pair programmer. Write code faster with intelligent suggestions.' },
        { name: 'Lovable', url: 'https://lovable.dev/', desc: 'Build software products with AI. From idea to deployed app in minutes.' },
    ],
    image: [
        { name: 'Midjourney', url: 'https://midjourney.com/', desc: 'Create stunning AI-generated artwork. The gold standard in AI image generation.' },
        { name: 'DALL-E 3', url: 'https://openai.com/dall-e-3', desc: "OpenAI's most advanced image generation. Incredibly accurate and creative." },
        { name: 'Leonardo AI', url: 'https://leonardo.ai/', desc: 'AI art generation with fine control. Train your own models for unique styles.' },
        { name: 'Stable Diffusion', url: 'https://stability.ai/', desc: 'Open-source image generation. Full control over your creative process.' },
        { name: 'Adobe Firefly', url: 'https://www.adobe.com/products/firefly.html', desc: 'Generative AI designed for creators. Safe for commercial use.' },
        { name: 'Ideogram', url: 'https://ideogram.ai/', desc: 'AI image generation with exceptional text rendering capabilities.' },
    ],
    video: [
        { name: 'Synthesia', url: 'https://www.synthesia.io/', desc: 'Create AI videos with digital avatars. Professional videos without cameras.' },
        { name: 'RunwayML', url: 'https://runwayml.com/', desc: 'AI-powered video editing and generation. Gen-2 creates videos from text.' },
        { name: 'Pika', url: 'https://pika.art/', desc: 'Transform ideas into videos instantly. Text-to-video made simple.' },
        { name: 'HeyGen', url: 'https://www.heygen.com/', desc: 'Create spokesperson videos with AI avatars. Perfect for marketing.' },
        { name: 'Luma AI', url: 'https://lumalabs.ai/', desc: 'Dream Machine for video generation. Realistic AI-generated videos.' },
        { name: 'Kling AI', url: 'https://klingai.com/', desc: 'Advanced video generation with impressive motion and physics.' },
    ],
    photo: [
        { name: 'Canva', url: 'https://www.canva.com/', desc: 'Magic AI tools for design and editing. Everything you need in one place.' },
        { name: 'PhotoRoom', url: 'https://www.photoroom.com/', desc: 'AI background removal and editing. Professional product photos instantly.' },
        { name: 'Clipdrop', url: 'https://clipdrop.co/', desc: 'AI-powered visual creation tools. Remove backgrounds, enhance, and more.' },
        { name: 'Remove.bg', url: 'https://www.remove.bg/', desc: 'Remove image backgrounds automatically. Fast and accurate every time.' },
        { name: 'Topaz Labs', url: 'https://www.topazlabs.com/', desc: 'AI photo enhancement and upscaling. Professional-grade quality.' },
        { name: 'Luminar Neo', url: 'https://skylum.com/luminar', desc: 'AI photo editor with powerful enhancement tools for photographers.' },
    ],
    study: [
        { name: 'Notion AI', url: 'https://www.notion.so/product/ai', desc: 'AI assistant for notes and productivity. Your second brain, supercharged.' },
        { name: 'Perplexity', url: 'https://www.perplexity.ai/', desc: 'AI-powered research assistant. Get answers with cited sources.' },
        { name: 'Claude', url: 'https://claude.ai/', desc: 'Advanced AI for learning and analysis. Thoughtful, nuanced responses.' },
        { name: 'ChatGPT', url: 'https://chat.openai.com/', desc: 'Versatile AI assistant for any learning task. From essays to coding.' },
        { name: 'Quillbot', url: 'https://quillbot.com/', desc: 'AI writing and paraphrasing tool. Improve your writing instantly.' },
        { name: 'Wolfram Alpha', url: 'https://www.wolframalpha.com/', desc: 'Computational knowledge engine. Solve math, science, and more.' },
    ],
};

// State
let currentCategory = 'ppt';

// DOM Elements
const categoriesContainer = document.getElementById('categories');
const toolsContainer = document.getElementById('tools');
const sectionTitle = document.getElementById('sectionTitle');

// Render Categories
function renderCategories() {
    categoriesContainer.innerHTML = categories.map(cat => `
        <button 
            class="category-btn ${cat.key === currentCategory ? 'active' : ''}" 
            onclick="selectCategory('${cat.key}')"
            aria-label="${cat.label}"
        >
            <span class="category-icon">${cat.icon}</span>
            <span>${cat.label}</span>
        </button>
    `).join('');
}

// Render Tools
function renderTools() {
    const currentTools = tools[currentCategory];
    const category = categories.find(c => c.key === currentCategory);
    
    // Update section title
    sectionTitle.textContent = `${category.icon} ${category.label} Extensions`;
    
    // Render tool cards with staggered animation
    toolsContainer.innerHTML = currentTools.map((tool, index) => `
        <article class="tool-card" style="animation: fadeInUp 0.5s ease ${index * 0.1}s both;">
            <h3 class="tool-name">${tool.name}</h3>
            <p class="tool-desc">${tool.desc}</p>
            <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="tool-link">
                Launch Extension
                <span class="tool-link-arrow">→</span>
            </a>
        </article>
    `).join('');
}

// Select Category
function selectCategory(key) {
    currentCategory = key;
    renderCategories();
    renderTools();
    
    // Smooth scroll to tools section on mobile
    if (window.innerWidth < 768) {
        sectionTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Add fadeInUp animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderTools();
});

// Make selectCategory available globally
window.selectCategory = selectCategory;