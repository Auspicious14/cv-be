import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIEnhancementRequest {
  section: "experience" | "academic" | "skills" | "personal";
  content: string;
}

export class AIService {
  static async enhanceContent(request: AIEnhancementRequest): Promise<string> {
    const prompts = {
      experience:
        "Enhance this work experience description with action verbs and quantifiable achievements:",
      academic:
        "Improve this academic description to highlight key achievements and relevant coursework:",
      skills:
        "Optimize these skills to match current industry standards and highlight proficiency:",
      personal:
        "Enhance this personal statement to be more compelling and professional:",
    };

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a professional CV writing expert. Enhance the content while maintaining accuracy and professionalism.",
          },
          {
            role: "user",
            content: `${prompts[request.section]}\n\n${request.content}`,
          },
        ],
        model: "gpt-3.5-turbo",
      });

      return completion.choices[0].message.content || request.content;
    } catch (error) {
      console.error("AI enhancement error:", error);
      return request.content; // Return original content if enhancement fails
    }
  }

  static async suggestSkills(experience: string): Promise<string[]> {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a career advisor. Suggest relevant technical and soft skills based on the given experience.",
          },
          {
            role: "user",
            content: `Suggest relevant skills for this experience:\n\n${experience}`,
          },
        ],
        model: "gpt-3.5-turbo",
      });

      const suggestions =
        completion.choices[0].message.content
          ?.split("\n")
          .map((skill) => skill.replace(/^-\s*/, "").trim())
          .filter((skill) => skill.length > 0) || [];

      return suggestions;
    } catch (error) {
      console.error("Skill suggestion error:", error);
      return [];
    }
  }
}
