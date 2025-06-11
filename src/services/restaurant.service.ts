import type { RestaurantDataWithConfidence } from "../types/restaurant.js";
import { WebscanService } from "./webscan.service.js";
import { GeminiService } from "./gemini.service.js";

export class RestaurantService {
  private webscanService: WebscanService;
  private geminiService: GeminiService;

  constructor(geminiApiKey: string) {
    this.webscanService = new WebscanService();
    this.geminiService = new GeminiService(geminiApiKey);
  }

  async initialize(): Promise<void> {
    await this.webscanService.initialize();
  }

  async analyzeRestaurant(url: string): Promise<RestaurantDataWithConfidence> {
    try {
      // Step 1: Scan the website
      console.log(`Scanning website: ${url}`);
      const webscanResult = await this.webscanService.scanWebsite(url);

      // Step 2: Try to get additional pages if main page doesn't have enough info
      const additionalContent = await this.gatherAdditionalContent(url);
      if (additionalContent) {
        webscanResult.content += '\n\nAdditional Content:\n' + additionalContent;
      }

      // Step 3: Analyze with Gemini
      console.log('Analyzing content with Gemini...');
      const analysis = await this.geminiService.analyzeRestaurantData(webscanResult);

      return analysis;
    } catch (error) {
      throw new Error(`Restaurant analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async gatherAdditionalContent(url: string): Promise<string> {
    try {
      // Extract links and look for common restaurant info pages
      const links = await this.webscanService.extractLinks(url);
      const relevantLinks = links
        .filter(link => /about|menu|contact|location|story|chef|owner/i.test(link))
        .slice(0, 3); // Limit to 3 additional pages

      console.log(`Found ${relevantLinks.length} relevant additional pages to scan`);

      let additionalContent = '';
      for (const link of relevantLinks) {
        try {
          console.log(`Scanning additional page: ${link}`);
          const result = await this.webscanService.scanWebsite(link);
          additionalContent += `\n--- Content from ${link} ---\n${result.content}\n`;
        } catch (error) {
          console.warn(`Failed to scan additional page ${link}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return additionalContent;
    } catch (error) {
      console.warn(`Failed to gather additional content: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return '';
    }
  }

  async close(): Promise<void> {
    await this.webscanService.close();
  }
}