"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { categories } from "@/lib/data";

const generateMassiveContent = (categoryName: string, index: number) => {
  let html = "";
  
  html += "<h2>Introduction to " + categoryName + "</h2>";
  html += "<p>Welcome to our comprehensive deep dive into the world of <strong>" + categoryName + "</strong>. In this extensive guide, we will explore everything you need to know, from foundational concepts to advanced strategies that are reshaping the industry today. Our expert analysis covers the complete spectrum of technologies, ensuring you stay ahead of the curve.</p>";
  
  html += "<h2>Problem Statement: Addressing Modern Challenges</h2>";
  html += "<p>Traditional methodologies often fall short when dealing with the rapid scale required in " + categoryName + ". When a workflow encounters an unexpected variable, rigid systems break. This is why adopting a flexible, robust architecture is no longer optional—it is a mandatory requirement for survival in the digital age. This guide addresses the brittle automation problem that plagues enterprise software.</p>";

  html += "<h2>Complete Explanation of the Architecture</h2>";
  html += "<p>A true enterprise-grade system in " + categoryName + " consists of several core components:</p>";
  html += "<ul>";
  html += "<li><strong>Infrastructure Engine:</strong> The core processing unit that analyzes and decides on a sequence of actions.</li>";
  html += "<li><strong>Data Persistence:</strong> Long-term memory utilizing advanced Vector Databases to recall past states seamlessly.</li>";
  html += "<li><strong>Integration Layers:</strong> Plugins and APIs that allow the system to call external functions dynamically.</li>";
  html += "<li><strong>Action Loops:</strong> Iterative processes where the system observes results and self-corrects.</li>";
  html += "</ul>";

  let currentWords = 150;
  let sectionCounter = 1;
  const targetWords = 4000;

  while (currentWords < targetWords) {
    html += "<h2>Core Principle #" + sectionCounter + ": Mastering " + categoryName + "</h2>";
    
    html += "<p>One of the most important aspects to consider is the underlying strategy. When implementing solutions in <strong>" + categoryName + "</strong>, efficiency and scalability should be at the forefront of your planning. Industry leaders consistently highlight the importance of robust infrastructure and clean design. A well-architected system minimizes technical debt while maximizing throughput.</p>";
    currentWords += 45;

    if (sectionCounter % 3 === 0) {
      html += "<h3>Key Benefits and Strategies</h3>";
      html += "<ul>";
      html += "<li><strong>Scalability:</strong> Ensuring your systems can handle increased load seamlessly without manual intervention.</li>";
      html += "<li><strong>Security:</strong> Protecting data against evolving threats using modern cryptographic standards.</li>";
      html += "<li><strong>Performance:</strong> Optimizing delivery pathways for the best possible end-user experience.</li>";
      html += "<li><strong>Maintainability:</strong> Writing clean, documented, and reusable code that future teams can understand.</li>";
      html += "</ul>";
      currentWords += 35;
    }

    html += "<p>Furthermore, testing and validation play a critical role. You cannot simply deploy a solution without rigorous QA processes. Automated testing, continuous integration, and continuous deployment (CI/CD) pipelines are standard practices that significantly reduce the margin of error and speed up the delivery cycle. This ensures high availability and fault tolerance.</p>";
    currentWords += 45;

    if (sectionCounter % 4 === 0) {
      html += "<h3>Real-world Examples & Industry Use Cases</h3>";
      html += "<p>Despite the advancements, professionals often face challenges such as technical debt, scaling issues, and integration complexities. The key to overcoming these hurdles lies in proper architectural planning and choosing the right tech stack from day one.</p>";
      html += "<ol>";
      html += "<li>Identify bottlenecks early through profiling, logging, and continuous monitoring.</li>";
      html += "<li>Refactor legacy code iteratively rather than attempting dangerous, full-scale rewrites.</li>";
      html += "<li>Invest heavily in training, certification, and upskilling your engineering team.</li>";
      html += "</ol>";
      currentWords += 45;
    }
    
    html += "<p>In modern tech environments, adopting an agile methodology allows teams to pivot quickly in response to market demands. Cross-functional teams that communicate effectively are proven to deliver higher quality products. It is not just about writing code or creating marketing campaigns; it is about delivering tangible value to the end-user. As systems grow in complexity, the need for abstraction and modularity becomes apparent. Microservices architectures, containerization with Docker, and orchestration with Kubernetes have revolutionized how we build and deploy applications.</p>";
    currentWords += 85;

    html += "<p>Moreover, the advent of AI and machine learning is transforming every sector. From predictive analytics to intelligent automation, integrating AI into your workflow can provide a significant competitive advantage. However, this also brings challenges related to data privacy, model bias, and computational costs. Striking the right balance between innovation and responsibility is the defining challenge of our era. Governance and compliance must be prioritized alongside feature development.</p>";
    currentWords += 70;

    sectionCounter++;
  }

  html += "<h2>Advanced Implementation Strategy</h2>";
  html += "<p>When deploying these systems in production, consider implementing a human-in-the-loop (HITL) architecture. This ensures that any high-risk actions, such as mass data migrations or executing critical database writes, require human approval before proceeding. Furthermore, observability is crucial. Use tools like Prometheus and Grafana to trace the exact thoughts, calls, and outputs of your systems. Without tracing, debugging a recursive loop is nearly impossible.</p>";

  html += "<h2>Frequently Asked Questions (FAQs)</h2>";
  html += "<h3>What is the biggest challenge in " + categoryName + "?</h3>";
  html += "<p>The primary challenge is managing complexity while ensuring security and high performance. As systems scale, maintaining a clear architecture becomes exponentially more difficult.</p>";
  
  html += "<h3>Is this technology future-proof?</h3>";
  html += "<p>While no technology is entirely future-proof, adhering to open standards and modular design principles significantly extends the lifespan of your architecture.</p>";

  html += "<h2>Expert Conclusion</h2>";
  html += "<p>The transition toward advanced, automated systems marks the beginning of true digital transformation. By mastering the core principles outlined in this guide, developers can build systems that don't just execute logic, but actually drive business value. Start small, implement strict guardrails, and gradually increase the autonomy of your systems as you build trust in their capabilities.</p>";
  
  return html;
};

export default function MassSeederPage() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const totalArticles = categories.length * 5;

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  const generateArticles = async () => {
    if (!confirm("This will generate 40 massive AdSense-ready articles and insert them into Firebase. Proceed?")) return;
    
    setLoading(true);
    setProgress(0);
    setLogs([]);
    
    let count = 0;

    try {
      addLog("Starting Mass Generation...");
      
      for (const category of categories) {
        addLog("Processing category: " + category.name);
        
        for (let i = 1; i <= 5; i++) {
          const title = "The Complete Guide to " + category.name + ": Part " + i + " (2026 Edition)";
          const slug = category.slug + "-complete-guide-part-" + i + "-" + Date.now();
          const excerpt = "Discover everything you need to know about " + category.name + " in this massive, comprehensive 4,000-word guide designed for absolute mastery.";
          const content = generateMassiveContent(category.name, i);
          
          const newArticle = {
            // Standard Fields
            title,
            slug,
            excerpt,
            content,
            category: category.name,
            categorySlug: category.slug,
            
            // Advanced SEO & Content Fields
            metaTitle: category.name + " Guide 2026: The Ultimate Resource",
            metaDescription: "Master " + category.name + " with this massive 4,000-word guide. Learn the architecture, use cases, and how to build scalable systems.",
            focusKeyword: category.name,
            secondaryKeywords: [category.name + " Tutorial", "Advanced " + category.name, "Tech Guides"],
            
            // Structure & Media
            toc: [
              { title: "Introduction", anchor: "#introduction" },
              { title: "Problem Statement", anchor: "#problem-statement" },
              { title: "Architecture", anchor: "#architecture" }
            ],
            featuredImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
            featuredImagePrompt: "A futuristic representation of " + category.name + ", highly detailed, cyberpunk aesthetic.",
            alt: "Visual representation of " + category.name + " architecture",
            tags: ["Technology", "Guide", category.name],
            
            // Engagement Metrics & Metadata
            author: "Senior Tech Writer",
            authorImage: "https://i.pravatar.cc/150?img=11",
            status: "published",
            published: true,
            featured: i === 1,
            views: Math.floor(Math.random() * 5000) + 1000,
            likes: Math.floor(Math.random() * 500) + 50,
            shares: Math.floor(Math.random() * 200) + 10,
            bookmarks: Math.floor(Math.random() * 100) + 5,
            commentsCount: Math.floor(Math.random() * 50),
            readingTime: 25,
            wordCount: 4150,
            
            // Quality Scores
            seoScore: 98,
            readabilityScore: 95,
            
            // Schema & External Links
            faq: [
              { question: "What is " + category.name + "?", answer: "A critical sector in modern technology and software architecture." }
            ],
            references: ["https://developer.mozilla.org", "https://github.com"],
            relatedArticles: [],
            
            // Timestamps
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            publishedAt: serverTimestamp(),
            searchKeywords: [category.name.toLowerCase(), "tutorial", "guide", "2026"],
            language: "en"
          };

          await addDoc(collection(db, "articles"), newArticle);
          count++;
          setProgress(Math.round((count / totalArticles) * 100));
          addLog("✅ Generated article " + i + "/5 for " + category.name);
        }
      }
      
      addLog("🎉 Mass Seeding complete! All 40 articles added successfully.");
    } catch (error: any) {
      addLog("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Mass Database Seeder</h1>
      <p className="mb-8 text-gray-600">
        This tool will generate 40 highly structured, AdSense-friendly articles (approx 4,000 words each). 
        It will add 5 articles to every category in your Firebase database.
      </p>

      <button
        onClick={generateArticles}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md disabled:opacity-50 transition-all"
      >
        {loading ? "Generating 40 Articles..." : "Start Mass Seeding (40 Articles)"}
      </button>

      {loading && (
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div className="bg-green-600 h-4 rounded-full transition-all duration-300" style={{ width: progress + "%" }}></div>
          </div>
          <p className="text-sm font-medium text-gray-700">{progress}% Complete ({Math.round((progress / 100) * totalArticles)} / {totalArticles} articles)</p>
        </div>
      )}

      <div className="mt-8 bg-gray-900 text-gray-100 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
        {logs.length === 0 ? (
          <span className="text-gray-500">Waiting to start...</span>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="mb-1">{log}</div>
          ))
        )}
      </div>
    </div>
  );
}
