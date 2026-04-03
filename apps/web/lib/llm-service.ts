// LLM Service for Community Chat - Generates human-like responses
// This simulates a backend LLM service for community chat

export interface LLMMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  senderName?: string;
  senderAvatar?: string;
  communityId?: string;
  timestamp?: string;
}

export interface CommunityContext {
  id: string;
  name: string;
  category: "travel" | "food" | "tech" | "dance" | "music" | "general";
  description: string;
  memberCount: number;
  activeMembers: number;
  recentTopics: string[];
  popularHashtags: string[];
}

// Community member personas for realistic responses
const COMMUNITY_PERSONAS: Record<string, Array<{
  id: string;
  name: string;
  avatar: string;
  role: string;
  personality: string;
  expertise: string[];
  speakingStyle: string;
  commonPhrases: string[];
}>> = {
  travel: [
    {
      id: "arjun_travel",
      name: "Arjun Mehta",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      role: "backpacker",
      personality: "Adventurous, helpful, loves offbeat destinations",
      expertise: ["budget travel", "solo trips", "hidden gems", "trekking"],
      speakingStyle: "Enthusiastic, shares personal anecdotes, uses emojis",
      commonPhrases: ["Oh man, you have to try", "Pro tip:", "I was just there last month!", "The locals are amazing"]
    },
    {
      id: "priya_travel",
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      role: "photographer",
      personality: "Artistic, detail-oriented, loves sunrise spots",
      expertise: ["landscape photography", "camera gear", "best photo spots", "editing"],
      speakingStyle: "Thoughtful, descriptive, gives specific locations",
      commonPhrases: ["Golden hour there is magical", "Bring a wide lens", "The light at 5 AM is perfect", "Check out this spot"]
    },
    {
      id: "vikram_travel",
      name: "Vikram Reddy",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      role: "guide",
      personality: "Knowledgeable, friendly, local expert",
      expertise: ["local culture", "food spots", "history", "homestays"],
      speakingStyle: "Warm, informative, recommends authentic experiences",
      commonPhrases: ["As a local, I recommend", "The best time to visit is", "Don't miss the", "Hidden gem alert!"]
    }
  ],
  food: [
    {
      id: "karthik_food",
      name: "Karthik Iyer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      role: "home_chef",
      personality: "Passionate about traditional recipes, secret family techniques",
      expertise: ["South Indian cuisine", "biryani", "pickles", "spice blends"],
      speakingStyle: "Warm, shares stories about family recipes, detailed cooking tips",
      commonPhrases: ["My grandmother's secret", "The key is patience", "Slow cook for 3 hours", "Use fresh spices only"]
    },
    {
      id: "neha_food",
      name: "Neha Kumar",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      role: "street_food_hunter",
      personality: "Enthusiastic, knows every hidden stall, budget-friendly",
      expertise: ["street food", "food walks", "budget eats", "food safety"],
      speakingStyle: "Energetic, gives specific locations, budget tips",
      commonPhrases: ["Best chaat for ₹30!", "Go to the stall near", "Locals swear by this place", "Hidden gem!"]
    },
    {
      id: "divya_food",
      name: "Divya Nair",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      role: "food_critic",
      personality: "Analytical, compares restaurants, knows chefs",
      expertise: ["fine dining", "restaurant reviews", "food plating", "wine pairing"],
      speakingStyle: "Sophisticated, gives ratings, references famous chefs",
      commonPhrases: ["The presentation was", "Chef's special is", "I'd rate it", "Compared to"]
    }
  ],
  tech: [
    {
      id: "rohan_tech",
      name: "Rohan Gupta",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      role: "fullstack_dev",
      personality: "Helpful, shares code snippets, loves new tech",
      expertise: ["React", "Node.js", "TypeScript", "AWS"],
      speakingStyle: "Technical but friendly, shares links, uses dev slang",
      commonPhrases: ["Have you tried", "Here's a code snippet", "npm install this", "Check the docs"]
    },
    {
      id: "sanya_tech",
      name: "Sanya Patel",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      role: "backend_engineer",
      personality: "Systematic, performance-focused, mentor",
      expertise: ["System Design", "Go", "PostgreSQL", "Kubernetes"],
      speakingStyle: "Clear, structured, gives best practices",
      commonPhrases: ["For scalability, consider", "Best practice is to", "I'd recommend", "The bottleneck is"]
    },
    {
      id: "aditya_tech",
      name: "Aditya Joshi",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      role: "tech_founder",
      personality: "Entrepreneurial, networking-focused, hiring",
      expertise: ["Startups", "Fundraising", "Team Building", "Product"],
      speakingStyle: "Motivational, shares opportunities, connects people",
      commonPhrases: ["We're hiring!", "Connect with me on LinkedIn", "Great opportunity", "Let's collaborate"]
    }
  ],
  dance: [
    {
      id: "ananya_dance",
      name: "Ananya Singh",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      role: "kathak_dancer",
      personality: "Graceful, traditional, patient teacher",
      expertise: ["Kathak", "Classical", "Footwork", "Expression"],
      speakingStyle: "Elegant, encouraging, explains techniques",
      commonPhrases: ["Focus on your footwork", "The mudra should be", "Practice with tala", "Beautiful expression!"]
    },
    {
      id: "raj_dance",
      name: "Raj Malhotra",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      role: "bhangra_instructor",
      personality: "Energetic, fun, high-energy",
      expertise: ["Bhangra", "Folk", "Group choreography", "Fitness"],
      speakingStyle: "Excited, uses Punjabi phrases, motivational",
      commonPhrases: ["Chak de phatte!", "Energy high!", "Balle balle!", "Let's practice dhol beats"]
    }
  ],
  music: [
    {
      id: "vikram_music",
      name: "Vikram Reddy",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      role: "music_producer",
      personality: "Creative, tech-savvy, experimental",
      expertise: ["Music Production", "FL Studio", "Mixing", "Bollywood remixes"],
      speakingStyle: "Creative, technical about sound, shares tracks",
      commonPhrases: ["Check out my new mix", "The EQ needs work", "Try this VST plugin", "Sick beat!"]
    },
    {
      id: "meera_music",
      name: "Meera Krishnan",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      role: "classical_singer",
      personality: "Traditional, knowledgeable about raagas",
      expertise: ["Carnatic", "Hindustani", "Voice training", "Raaga theory"],
      speakingStyle: "Scholarly, references classical masters, teaches",
      commonPhrases: ["This raaga is best at", "Practice sa re ga ma", "Listen to MS Subbulakshmi", "Focus on breath control"]
    }
  ],
  general: [
    {
      id: "amit_general",
      name: "Amit Shah",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      role: "community_member",
      personality: "Friendly, helpful, always engaging",
      expertise: ["General knowledge", "Networking", "Events"],
      speakingStyle: "Casual, welcoming, asks questions",
      commonPhrases: ["Welcome to the community!", "Great question!", "I'd love to know more", "Thanks for sharing!"]
    },
    {
      id: "sneha_general",
      name: "Sneha Verma",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      role: "community_member",
      personality: "Supportive, positive, encouraging",
      expertise: ["Community building", "Events", "Moderation"],
      speakingStyle: "Warm, inclusive, celebrates others",
      commonPhrases: ["Amazing post!", "So inspiring!", "Love this energy", "You're doing great!"]
    }
  ]
};

// Response templates by category
const RESPONSE_TEMPLATES: Record<string, string[]> = {
  travel: [
    "Oh wow, {topic}! I was just there last month. The {location} is absolutely breathtaking during {season}. Have you checked out {recommendation}?",
    "For {topic}, I'd recommend visiting between {time}. The weather is perfect and you'll avoid the crowds. Pro tip: {tip}!",
    "If you're into {topic}, you HAVE to try {activity}. I did it last year and it was life-changing! {personal_note}",
    "Hey! For {topic}, check out {location}. It's a hidden gem that most tourists miss. {detail}",
    "Planning {topic} too? I'm going next month! Let's exchange tips. My must-do list includes: {recommendations}"
  ],
  food: [
    "That {dish} looks incredible! I use {ingredient} in my recipe - makes all the difference. {cooking_tip}",
    "For authentic {dish}, you should visit {place} in {location}. Been going there for 10 years! {personal_story}",
    "Here's my secret recipe for {dish}: {recipe_steps}. The key is {secret_ingredient}!",
    "{enthusiasm}! I'm craving {dish} now. Have you tried the version at {restaurant}? Best in {city}!",
    "Pro tip for {dish}: Always {technique}. My grandmother taught me this and it makes it 10x better!"
  ],
  tech: [
    "For {topic}, I'd recommend using {technology}. We've been using it at work and it's been a game-changer. {technical_detail}",
    "I faced the same issue with {topic}! Try this: {solution}. Here's a code snippet: {code_snippet}",
    "Great question about {topic}! The best practice is to {best_practice}. Also consider {alternative}.",
    "We're actually hiring for {topic} roles at our startup! DM me if you're interested. {job_details}",
    "Have you checked out {resource} for learning {topic}? It's the best resource I've found. {personal_experience}"
  ],
  dance: [
    "Your {dance_style} form is improving so well! Focus on {technique} and you'll nail it. {encouragement}",
    "For {dance_style}, practice {exercise} daily. It really helped me when I was learning. {personal_tip}",
    "Have you considered learning {related_style}? It complements {dance_style} beautifully! {benefit}",
    "There's a {event_type} happening in {location} next month. Perfect for showcasing {dance_style}! {details}",
    "The {dance_element} in your performance was stunning! How long have you been training? {compliment}"
  ],
  music: [
    "That {music_element} is fire! What plugins are you using for {production_technique}?",
    "For {music_genre}, try listening to {artist}. They've influenced my style a lot. {recommendation}",
    "Your {instrument} skills are impressive! Have you tried {technique}? It adds amazing texture.",
    "I'm working on a {music_project} too! Would love to collaborate on something. {proposal}",
    "Check out this {music_resource} for learning {music_theory}. It's what I used when starting out!"
  ],
  general: [
    "That's such an interesting perspective on {topic}! I hadn't thought about it that way. {engagement_question}",
    "Thanks for sharing this about {topic}! The community really benefits from insights like yours. {appreciation}",
    "I completely agree with your point about {topic}. Have you also considered {alternative_view}?",
    "Welcome to the discussion on {topic}! Would love to hear more about your experience with it. {welcoming}",
    "This is exactly why I love this community - such meaningful conversations about {topic}! {enthusiasm}"
  ]
};

// Contextual fill-ins
const FILL_INS: Record<string, Record<string, string[]>> = {
  travel: {
    location: ["Munnar tea estates", "Alleppey backwaters", "Hampi ruins", "Gokarna beaches", "Spiti Valley"],
    season: ["monsoon season", "October-February", "spring", "post-monsoon"],
    recommendation: ["the secret sunrise point", "local homestay", "hidden waterfall trek", "village homestay"],
    activity: ["houseboat stay", "trekking", "village homestay", "road trip"],
    personal_note: ["Made some amazing friends there!", "The food was incredible!", "Can't wait to go back!"],
    time: ["October to March", "just after monsoon", "winter months"],
    tip: ["Book homestays directly for better rates", "rent a bike for flexibility", "carry cash for remote areas"],
    detail: ["The locals are so welcoming!", "Best views at sunrise!", "Secret spot most tourists miss!"],
    recommendations: ["sunrise at the peak, local tea tasting, village walk"]
  },
  food: {
    dish: ["biryani", "dosa", "chole bhature", "butter chicken", "dhokla", "pani puri"],
    ingredient: ["homemade garam masala", "fresh curry leaves", "Kashmiri chili", " homemade ghee"],
    cooking_tip: ["Slow cook on dum for 2 hours", "Ferment batter overnight", "Use a heavy bottom pan"],
    place: ["Paranthe Wali Gali", "Andhra Bhavan", "Karim's", "Saravana Bhavan"],
    location: ["Chandni Chowk", "Khan Market", "Matunga", "Jayanagar"],
    personal_story: ["My grandfather used to take me there!", "Discovered it during college days!", "Family tradition for 20 years!"],
    recipe_steps: ["1. Marinate overnight 2. Slow cook 3. Add fried onions", "1. Soak dal 2. Grind coarse 3. Steam perfectly"],
    secret_ingredient: ["saffron infused milk", "homemade spice blend", "ghee at the end", "kewra water"],
    enthusiasm: ["OMG now I'm hungry", "This looks SO good", "My mouth is watering"],
    restaurant: ["the stall at corner", "that famous dhaba", "aunty's kitchen"],
    city: ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Kolkata"],
    technique: ["toast spices before grinding", "use cold water for kneading", "rest the dough for 30 mins"]
  },
  tech: {
    technology: ["Next.js 15", "React Query", "TypeScript", "PostgreSQL", "Redis"],
    technical_detail: ["Improved our load times by 40%", "Handles 10K concurrent users easily", "Type safety is a game changer"],
    solution: ["using React.memo for optimization", "adding proper indexes", "implementing connection pooling"],
    code_snippet: ["const query = useQuery({ key: ['data'], queryFn: fetchData })", "await prisma.user.findMany({ include: { posts: true }}"],
    best_practice: ["use proper error handling", "implement retry logic", "add proper logging"],
    alternative: ["tRPC for type-safe APIs", "Zustand for state management", "Vercel for deployment"],
    job_details: ["Remote friendly, great package", "Early stage equity included", "Mentorship from ex-FAANG engineers"],
    resource: ["Udemy course by Stephen Grider", "official documentation", "YouTube channel Fireship"],
    personal_experience: ["Helped me get my first dev job", "Best $20 I ever spent", "Learned more than my degree!"]
  }
};

export class CommunityLLMService {
  private communityContexts: Map<string, CommunityContext> = new Map();
  private conversationHistory: Map<string, LLMMessage[]> = new Map();

  constructor() {
    this.initializeCommunities();
  }

  private initializeCommunities() {
    const communities: CommunityContext[] = [
      {
        id: "travel-india",
        name: "Travel India",
        category: "travel",
        description: "Discover hidden gems across India",
        memberCount: 45600,
        activeMembers: 342,
        recentTopics: ["Kerala monsoon", "Spiti Valley", "Budget travel"],
        popularHashtags: ["#BackpackingIndia", "#SoloTravel", "#HiddenGems"]
      },
      {
        id: "foodie-delhi",
        name: "Delhi Foodies",
        category: "food",
        description: "Street food to fine dining",
        memberCount: 56700,
        activeMembers: 523,
        recentTopics: ["Best biryani", "Street food safety", "Home recipes"],
        popularHashtags: ["#DelhiFood", "#StreetFood", "#HomeCooking"]
      },
      {
        id: "code-mumbai",
        name: "Code Mumbai",
        category: "tech",
        description: "Mumbai's developer community",
        memberCount: 12300,
        activeMembers: 156,
        recentTopics: ["Next.js", "System Design", "Job openings"],
        popularHashtags: ["#React", "#TechJobs", "#StartupIndia"]
      }
    ];

    communities.forEach(c => this.communityContexts.set(c.id, c));
  }

  getCommunityContext(communityId: string): CommunityContext | undefined {
    return this.communityContexts.get(communityId);
  }

  private getCategoryFromCommunity(communityId: string): string {
    const context = this.communityContexts.get(communityId);
    return context?.category || "general";
  }

  private selectRandomPersona(communityId: string): typeof COMMUNITY_PERSONAS["general"][0] {
    const category = this.getCategoryFromCommunity(communityId);
    const personas = COMMUNITY_PERSONAS[category] || COMMUNITY_PERSONAS["general"];
    return personas[Math.floor(Math.random() * personas.length)];
  }

  private generateResponseText(
    userMessage: string, 
    communityId: string, 
    persona: typeof COMMUNITY_PERSONAS["general"][0]
  ): string {
    const category = this.getCategoryFromCommunity(communityId);
    const templates = RESPONSE_TEMPLATES[category] || RESPONSE_TEMPLATES["general"];
    const fillIns = FILL_INS[category] || {};
    
    // Select template
    let template = templates[Math.floor(Math.random() * templates.length)];
    
    // Fill in the template
    Object.keys(fillIns).forEach(key => {
      if (template.includes(`{${key}}`)) {
        const options = fillIns[key];
        const value = options[Math.floor(Math.random() * options.length)];
        template = template.replace(new RegExp(`{${key}}`, 'g'), value);
      }
    });
    
    // Replace topic with extracted topic or random
    template = template.replace(/{topic}/g, this.extractTopic(userMessage) || "this");
    
    // Add personal touch based on persona
    if (Math.random() > 0.5) {
      const phrase = persona.commonPhrases[Math.floor(Math.random() * persona.commonPhrases.length)];
      template = `${phrase} ${template}`;
    }
    
    return template;
  }

  private extractTopic(message: string): string | null {
    const keywords = message.toLowerCase().split(/\s+/);
    const commonTopics = ["trip", "travel", "food", "recipe", "code", "bug", "error", "dance", "music", "photo"];
    const found = keywords.find(k => commonTopics.includes(k));
    return found || null;
  }

  async generateResponse(
    userMessage: string, 
    communityId: string,
    shouldIncludePhoto: boolean = false
  ): Promise<{ message: LLMMessage; photoUrl?: string }> {
    // Simulate network delay (200-800ms)
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 600));
    
    const persona = this.selectRandomPersona(communityId);
    const responseText = this.generateResponseText(userMessage, communityId, persona);
    
    const message: LLMMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: "assistant",
      content: responseText,
      senderName: persona.name,
      senderAvatar: persona.avatar,
      communityId,
      timestamp: new Date().toISOString()
    };

    // Store in history
    const history = this.conversationHistory.get(communityId) || [];
    history.push(message);
    this.conversationHistory.set(communityId, history);

    // Get community photos
    let photoUrl: string | undefined;
    if (shouldIncludePhoto) {
      const communityPhotos: Record<string, string[]> = {
        travel: [
          "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400",
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400",
        ],
        food: [
          "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
          "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
        ],
        tech: [
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
        ]
      };
      
      const category = this.getCategoryFromCommunity(communityId);
      const photos = communityPhotos[category] || communityPhotos["travel"];
      photoUrl = photos[Math.floor(Math.random() * photos.length)];
    }

    return { message, photoUrl };
  }

  // Get typing indicator delay (simulates human typing speed)
  getTypingDelay(messageLength: number): number {
    // Average typing speed: 40-60 WPM = ~200-300ms per word
    const words = messageLength / 5;
    const delayPerWord = 200 + Math.random() * 100;
    return Math.min(words * delayPerWord, 3000); // Cap at 3 seconds
  }
}

// Export singleton instance
export const llmService = new CommunityLLMService();
