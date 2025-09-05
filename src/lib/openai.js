const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key not found. AI recommendations will not be available.')
}

class OpenAIService {
  constructor() {
    this.apiKey = OPENAI_API_KEY
    this.baseURL = 'https://api.openai.com/v1'
  }

  async generateRecommendations(userWorkouts, personalRecords, preferences = {}) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const prompt = this.buildRecommendationPrompt(userWorkouts, personalRecords, preferences)
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are FitFlow AI, an expert fitness coach and personal trainer. Provide personalized, actionable workout recommendations based on user data. Always prioritize safety and progressive overload principles.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const recommendations = this.parseRecommendations(data.choices[0].message.content)
      
      return { success: true, recommendations }
    } catch (error) {
      console.error('Error generating AI recommendations:', error)
      return { success: false, error: error.message }
    }
  }

  buildRecommendationPrompt(workouts, personalRecords, preferences) {
    const recentWorkouts = workouts.slice(0, 5) // Last 5 workouts
    const workoutSummary = recentWorkouts.map(workout => {
      const exerciseList = workout.exercises?.map(ex => 
        `${ex.exercise_name}: ${ex.sets} sets × ${ex.reps?.[0] || 'N/A'} reps @ ${ex.weight?.[0] || 'N/A'} lbs`
      ).join(', ') || 'No exercises logged'
      
      return `Workout on ${new Date(workout.start_time).toLocaleDateString()}: ${exerciseList}`
    }).join('\n')

    const prSummary = personalRecords.slice(0, 10).map(pr => 
      `${pr.exercise_name}: ${pr.weight} lbs × ${pr.reps} reps (${new Date(pr.date_achieved).toLocaleDateString()})`
    ).join('\n')

    return `
Analyze this user's fitness data and provide 3-5 personalized recommendations:

RECENT WORKOUTS:
${workoutSummary || 'No recent workouts'}

PERSONAL RECORDS:
${prSummary || 'No personal records yet'}

USER PREFERENCES:
- Weight unit: ${preferences.weight_unit || 'lbs'}
- Experience level: Intermediate (assumed)

Please provide recommendations in the following categories:
1. STRENGTH - Suggestions for improving strength and progressive overload
2. RECOVERY - Rest, recovery, and injury prevention advice
3. VARIETY - New exercises or workout variations to try
4. FORM - Technique improvements based on common patterns
5. NUTRITION - Basic nutrition tips to support their training

Format each recommendation with:
- Category (STRENGTH/RECOVERY/VARIETY/FORM/NUTRITION)
- Priority (HIGH/MEDIUM/LOW)
- Title (brief, actionable)
- Description (2-3 sentences with specific advice)

Keep recommendations practical, safe, and based on the actual workout data provided.
    `.trim()
  }

  parseRecommendations(content) {
    const recommendations = []
    const lines = content.split('\n').filter(line => line.trim())
    
    let currentRec = null
    
    for (const line of lines) {
      // Look for category indicators
      const categoryMatch = line.match(/^(STRENGTH|RECOVERY|VARIETY|FORM|NUTRITION)/i)
      if (categoryMatch) {
        if (currentRec) {
          recommendations.push(currentRec)
        }
        
        currentRec = {
          type: categoryMatch[1].toLowerCase(),
          priority: 'medium', // default
          title: '',
          description: ''
        }
        
        // Extract title from the same line
        const titleMatch = line.match(/^[A-Z]+[:\-\s]*(.+)/)
        if (titleMatch) {
          currentRec.title = titleMatch[1].trim()
        }
      } else if (currentRec) {
        // Look for priority indicators
        const priorityMatch = line.match(/(HIGH|MEDIUM|LOW)/i)
        if (priorityMatch) {
          currentRec.priority = priorityMatch[1].toLowerCase()
        }
        
        // Add to description if it's not a header
        if (line.trim() && !line.match(/^(Priority|Title|Description):/i)) {
          currentRec.description += (currentRec.description ? ' ' : '') + line.trim()
        }
      }
    }
    
    // Add the last recommendation
    if (currentRec) {
      recommendations.push(currentRec)
    }
    
    // Fallback parsing if structured parsing fails
    if (recommendations.length === 0) {
      return this.fallbackParseRecommendations(content)
    }
    
    return recommendations.slice(0, 5) // Limit to 5 recommendations
  }

  fallbackParseRecommendations(content) {
    // Simple fallback: split content into chunks and create basic recommendations
    const chunks = content.split('\n\n').filter(chunk => chunk.trim())
    const types = ['strength', 'recovery', 'variety', 'form', 'nutrition']
    
    return chunks.slice(0, 5).map((chunk, index) => ({
      type: types[index] || 'strength',
      priority: 'medium',
      title: `Recommendation ${index + 1}`,
      description: chunk.trim().substring(0, 200) + (chunk.length > 200 ? '...' : '')
    }))
  }

  async generateWorkoutPlan(userGoals, availableTime, equipment = []) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const prompt = `
Create a personalized workout plan based on:
- Goals: ${userGoals}
- Available time: ${availableTime} minutes per session
- Equipment: ${equipment.length ? equipment.join(', ') : 'Basic gym equipment'}

Provide a structured workout with:
1. Warm-up (5-10 minutes)
2. Main exercises (3-5 exercises with sets/reps)
3. Cool-down (5 minutes)

Format as JSON with exercise names, sets, reps, and brief instructions.
      `.trim()

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional fitness trainer. Create safe, effective workout plans.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, plan: data.choices[0].message.content }
    } catch (error) {
      console.error('Error generating workout plan:', error)
      return { success: false, error: error.message }
    }
  }
}

export const openaiService = new OpenAIService()
export default openaiService
