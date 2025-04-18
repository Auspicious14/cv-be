import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIEnhancementRequest {
  section: "experience" | "academic" | "skills" | "personal" | "certificate";
  content: string;
  context?: string;
}

export class EnhancedAIService {
  static async enhanceContent(request: AIEnhancementRequest): Promise<{
    enhanced: string;
    suggestions: string[];
    error: any;
  }> {
    const prompts = {
      experience: `Enhance this work experience description to be more impactful:
        - Use strong action verbs
        - Add quantifiable achievements
        - Highlight relevant skills
        - Ensure industry-standard formatting
        Original content: ${request.content}`,
      academic: `Optimize this academic description to stand out:
        - Highlight key achievements
        - Emphasize relevant coursework
        - Include academic projects if applicable
        - Add GPA if above 3.5
        Original content: ${request.content}`,
      skills: `Enhance these skills to match current industry standards:
        - Suggest modern equivalent technologies
        - Add proficiency levels
        - Group by categories
        - Remove outdated skills
        Original content: ${request.content}`,
      personal: `Create a compelling personal statement that:
        - Highlights unique value proposition
        - Aligns with career goals
        - Shows personality while maintaining professionalism
        - Includes relevant keywords
        Original content: ${request.content}`,
      certificate: `Optimize this certification description:
        - Emphasize relevance to target role
        - Include version/level if applicable
        - Add impact on professional growth
        Original content: ${request.content}`,
    };

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are an expert CV consultant with deep knowledge of industry standards and modern recruitment practices. Provide both enhanced content and specific improvement suggestions.",
          },
          {
            role: "user",
            content: prompts[request.section],
          },
        ],
        model: "gpt-3.5-turbo",
      });

      const response = completion.choices[0].message.content || "";
      const [enhanced, ...suggestions] = response.split("\n").filter(Boolean);

      return {
        enhanced: enhanced || request.content,
        suggestions: suggestions
          .map((s) => s.replace(/^- /, ""))
          .filter(Boolean),
        error: null,
      };
    } catch (error) {
      console.error("AI enhancement error:", error);
      return { enhanced: request.content, suggestions: [], error };
    }
  }

  static async suggestSkills(experience: string): Promise<{
    technical: string[];
    soft: string[];
    trending: string[];
  }> {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a career advisor with expertise in current job market trends. Categorize and suggest relevant skills based on the experience.",
          },
          {
            role: "user",
            content: `Based on this experience, suggest:
              1. Technical skills that match the role
              2. Soft skills demonstrated
              3. Trending skills in this field
              
              Experience: ${experience}`,
          },
        ],
        model: "gpt-3.5-turbo",
      });

      const response = completion.choices[0].message.content || "";
      const sections = response.split("\n\n");

      return {
        technical: this.parseSkillSection(sections[0]),
        soft: this.parseSkillSection(sections[1]),
        trending: this.parseSkillSection(sections[2]),
      };
    } catch (error) {
      console.error("Skill suggestion error:", error);
      return { technical: [], soft: [], trending: [] };
    }
  }

  static async analyzeCV(cv: any): Promise<{
    score: number;
    improvements: string[];
    strengths: string[];
  }> {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are an AI CV analyzer. Evaluate the CV and provide a comprehensive analysis.",
          },
          {
            role: "user",
            content: `Analyze this CV and provide:
              1. Overall score (0-100)
              2. Areas for improvement
              3. Current strengths
              
              CV Content: ${JSON.stringify(cv)}`,
          },
        ],
        model: "gpt-3.5-turbo",
      });

      const response = completion.choices[0].message.content || "";
      const [scoreStr, ...sections] = response.split("\n\n");
      const score = parseInt(scoreStr.match(/\d+/)?.[0] || "0");

      return {
        score,
        improvements: this.parseSection(sections[0]),
        strengths: this.parseSection(sections[1]),
      };
    } catch (error) {
      console.error("CV analysis error:", error);
      return { score: 0, improvements: [], strengths: [] };
    }
  }

  private static parseSkillSection(section: string): string[] {
    return section
      .split("\n")
      .map((skill) => skill.replace(/^-\s*/, "").trim())
      .filter(Boolean);
  }

  private static parseSection(section: string): string[] {
    return section
      .split("\n")
      .map((item) => item.replace(/^-\s*/, "").trim())
      .filter(Boolean);
  }
}
