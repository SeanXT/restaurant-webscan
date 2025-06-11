import { GoogleGenerativeAI } from "@google/generative-ai";
import type { RestaurantDataWithConfidence, WebscanResult } from "../types/restaurant.js";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  }

  async analyzeRestaurantData(webscanData: WebscanResult): Promise<RestaurantDataWithConfidence> {
    const prompt = this.buildAnalysisPrompt(webscanData);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseGeminiResponse(text, webscanData.url);
    } catch (error) {
      throw new Error(`Gemini analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildAnalysisPrompt(webscanData: WebscanResult): string {
    return `
You are an expert at analyzing restaurant websites and extracting key business information. 
Analyze the following website content and extract restaurant information with confidence scores.

Website URL: ${webscanData.url}
Website Content:
${webscanData.content}

Extract the following information and provide a confidence score (0-100) for each field:

1. Business name
2. Business type (should be "Restaurant" if this is a restaurant)
3. Cuisine type (e.g., Italian, Chinese, Mexican, etc.)
4. Food concept - Create a thoughtful description that captures the restaurant's culinary approach and dining experience. Use descriptive but accessible language. Examples:
   - "Traditional Italian techniques with contemporary touches, focusing on heritage recipes and quality ingredients"
   - "Fresh coastal cuisine featuring locally-sourced seafood with Mediterranean influences and approachable presentation"
   - "Family-style comfort food using authentic recipes and local ingredients in a warm, welcoming atmosphere"
5. Parent company (if any)
6. Parent company website (if any)
7. Owner name (if mentioned)
8. Chef name (if mentioned)
9. Restaurant address (full address if available)

Respond in the following JSON format:
{
  "businessName": "extracted name or 'not found by webscan'",
  "businessType": "Restaurant or other type or 'not found by webscan'",
  "cuisineType": "cuisine type or 'not found by webscan'",
  "foodConcept": "thoughtful concept description or 'not found by webscan'",
  "parentCompany": "parent company or 'not found by webscan'",
  "parentCompanyWebsite": "parent website or 'not found by webscan'",
  "ownerName": "owner name or 'not found by webscan'",
  "chefName": "chef name or 'not found by webscan'",
  "restaurantAddress": "full address or 'not found by webscan'",
  "confidence": {
    "businessName": 0-100,
    "businessType": 0-100,
    "cuisineType": 0-100,
    "foodConcept": 0-100,
    "parentCompany": 0-100,
    "parentCompanyWebsite": 0-100,
    "ownerName": 0-100,
    "chefName": 0-100,
    "restaurantAddress": 0-100
  }
}

Rules:
- If information is not found in the website content, use "not found by webscan"
- For food concept: Use clear, descriptive language that captures the restaurant's style and approach. Focus on culinary identity without overly poetic flourishes
- Confidence scores should reflect how certain you are about the extracted information
- Base confidence on clarity of information, context, and how explicitly stated it is
- Do not make up or infer information that isn't clearly present in the content
`;
  }

  private parseGeminiResponse(responseText: string, url: string): RestaurantDataWithConfidence {
    try {
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Gemini response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Process confidence scores and handle "not found by webscan" cases
      const processedConfidence = { ...parsed.confidence };
      const validConfidenceValues: number[] = [];
      
      // Check each field and set confidence to "N/A" if not found by webscan
      const fields = ['businessName', 'businessType', 'cuisineType', 'foodConcept', 
                     'parentCompany', 'parentCompanyWebsite', 'ownerName', 'chefName', 'restaurantAddress'];
      
      fields.forEach(field => {
        if (parsed[field] === 'not found by webscan') {
          processedConfidence[field] = 'N/A';
        } else {
          validConfidenceValues.push(processedConfidence[field]);
        }
      });

      // Calculate overall confidence only from found fields
      const overallConfidence = validConfidenceValues.length > 0 
        ? Math.round(validConfidenceValues.reduce((sum, val) => sum + val, 0) / validConfidenceValues.length)
        : 0;

      // Generate summary
      const summary = this.generateSummary(parsed, url);

      return {
        businessName: parsed.businessName || 'not found by webscan',
        url: url,
        businessType: parsed.businessType || 'not found by webscan',
        cuisineType: parsed.cuisineType || 'not found by webscan',
        foodConcept: parsed.foodConcept || 'not found by webscan',
        parentCompany: parsed.parentCompany || 'not found by webscan',
        parentCompanyWebsite: parsed.parentCompanyWebsite || 'not found by webscan',
        ownerName: parsed.ownerName || 'not found by webscan',
        chefName: parsed.chefName || 'not found by webscan',
        restaurantAddress: parsed.restaurantAddress || 'not found by webscan',
        summary,
        confidence: {
          ...processedConfidence,
          overall: overallConfidence,
        },
      };
    } catch (error) {
      throw new Error(`Failed to parse Gemini response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateSummary(data: any, url: string): string {
    const foundFields = Object.entries(data)
      .filter(([key, value]) => key !== 'confidence' && value !== 'not found by webscan')
      .map(([key, value]) => `${key}: ${value}`);

    if (foundFields.length === 0) {
      return 'No restaurant information found by webscan';
    }

    return `Restaurant analysis for ${url}: ${foundFields.join(', ')}`;
  }
}