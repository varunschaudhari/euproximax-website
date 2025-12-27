/**
 * Professional AI Response Generator
 * Simulates intelligent responses based on user input
 */

interface ResponsePattern {
  keywords: string[]
  responses: string[]
  followUp: string[]
}

const responsePatterns: ResponsePattern[] = [
  {
    keywords: ['project', 'projects', 'planning', 'plan'],
    responses: [
      "I'd be happy to help you with project planning. Effective project management requires clear objectives, defined timelines, and proper resource allocation.",
      "Project planning is crucial for success. Let me help you think through the key aspects of your project.",
      "Great! Projects benefit from structured approaches. I can help you break down the planning process.",
    ],
    followUp: [
      "What specific challenges are you facing with your current project?",
      "What are the main goals you want to achieve with this project?",
      "Can you tell me more about the timeline and resources available?",
    ],
  },
  {
    keywords: ['team', 'teams', 'collaboration', 'work together'],
    responses: [
      "Team dynamics play a crucial role in organizational success. Effective collaboration requires clear communication and shared goals.",
      "Building strong teams is essential. Let's explore how to enhance your team's performance.",
      "Team management is a key leadership skill. I can help you think through team-related challenges.",
    ],
    followUp: [
      "What specific team challenges are you experiencing?",
      "How would you describe the current team dynamics?",
      "What improvements would you like to see in team collaboration?",
    ],
  },
  {
    keywords: ['growth', 'grow', 'expansion', 'scale', 'scaling'],
    responses: [
      "Business growth requires strategic planning and careful execution. Let's discuss your growth objectives.",
      "Scaling a business is exciting but comes with unique challenges. I can help you think through the key considerations.",
      "Growth strategies vary depending on your industry and current position. Let's explore what might work best for you.",
    ],
    followUp: [
      "What areas of your business are you looking to grow?",
      "What growth opportunities have you identified?",
      "What challenges do you anticipate with scaling?",
    ],
  },
  {
    keywords: ['problem', 'issue', 'challenge', 'difficulty', 'struggle'],
    responses: [
      "I understand you're facing some challenges. Let's work through this systematically to find solutions.",
      "Every challenge presents an opportunity for growth. I'm here to help you think through this.",
      "Problem-solving is a key professional skill. Let's break down the situation together.",
    ],
    followUp: [
      "Can you provide more details about the specific problem you're facing?",
      "What have you tried so far to address this challenge?",
      "What would an ideal solution look like for you?",
    ],
  },
  {
    keywords: ['strategy', 'strategic', 'plan', 'roadmap'],
    responses: [
      "Strategic thinking is essential for long-term success. Let's discuss your strategic objectives.",
      "A well-defined strategy provides direction and focus. I can help you think through strategic planning.",
      "Strategic planning helps align resources with goals. Let's explore your strategic priorities.",
    ],
    followUp: [
      "What are your primary strategic goals?",
      "What time horizon are you considering for your strategy?",
      "What factors are most important in your strategic decision-making?",
    ],
  },
  {
    keywords: ['decision', 'decide', 'choice', 'choose'],
    responses: [
      "Decision-making is a critical leadership skill. Let's work through your decision systematically.",
      "Making informed decisions requires gathering the right information and considering various perspectives.",
      "I can help you think through the decision-making process and evaluate your options.",
    ],
    followUp: [
      "What decision are you trying to make?",
      "What factors are you considering in this decision?",
      "What are the potential outcomes you're weighing?",
    ],
  },
]

const defaultResponses = [
  "That's an interesting point. Let me help you think through this.",
  "I appreciate you sharing that. Let's explore this further.",
  "Thank you for that information. I'd like to understand more.",
  "That's a valuable perspective. Let's dive deeper into this topic.",
]

const defaultFollowUps = [
  "Can you tell me more about that?",
  "What specific aspects would you like to explore further?",
  "How does this relate to your overall goals?",
  "What would be most helpful for you right now?",
]

/**
 * Generate a professional AI response based on user input
 */
export const generateAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase()

  // Find matching pattern
  for (const pattern of responsePatterns) {
    const hasKeyword = pattern.keywords.some((keyword) =>
      lowerMessage.includes(keyword)
    )

    if (hasKeyword) {
      const response =
        pattern.responses[
          Math.floor(Math.random() * pattern.responses.length)
        ]
      const followUp =
        pattern.followUp[
          Math.floor(Math.random() * pattern.followUp.length)
        ]
      return `${response}\n\n${followUp}`
    }
  }

  // Default response if no pattern matches
  const response =
    defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  const followUp =
    defaultFollowUps[Math.floor(Math.random() * defaultFollowUps.length)]
  return `${response}\n\n${followUp}`
}

/**
 * Get welcome message
 */
export const getWelcomeMessage = (): string => {
  return "Hello! I'm **Nexa**, your professional assistant. How can I assist you today?"
}

