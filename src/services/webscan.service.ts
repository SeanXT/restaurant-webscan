import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import type { WebscanResult } from "../types/restaurant.js";

export class WebscanService {
  private client: MultiServerMCPClient;

  constructor() {
    // Disable SSL verification for the webscan server process
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    this.client = new MultiServerMCPClient({
      throwOnLoadError: true,
      prefixToolNameWithServerName: true,
      additionalToolNamePrefix: "webscan",
      useStandardContentBlocks: true,
      mcpServers: {
        webscan: {
          transport: "stdio",
          command: "node",
          args: [process.env.WEBSCAN_SERVER_PATH || "/path/to/mcp-server-webscan/build/index.js"],
          restart: {
            enabled: true,
            maxAttempts: 3,
            delayMs: 1000,
          },
        },
      },
    });
  }

  async initialize(): Promise<void> {
    // Client initialization is handled automatically
  }

  async scanWebsite(url: string): Promise<WebscanResult> {
    try {
      const tools = await this.client.getTools();
      const fetchTool = tools.find(tool => tool.name.includes('fetch-page'));
      
      if (!fetchTool) {
        throw new Error('Webscan fetch-page tool not found');
      }

      const result = await fetchTool.invoke({ url });
      
      return {
        content: typeof result === 'string' ? result : JSON.stringify(result),
        url,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new Error(`Failed to scan website: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async extractLinks(url: string): Promise<string[]> {
    try {
      const tools = await this.client.getTools();
      const extractTool = tools.find(tool => tool.name.includes('extract-links'));
      
      if (!extractTool) {
        throw new Error('Webscan extract-links tool not found');
      }

      const result = await extractTool.invoke({ url, limit: 20 });
      
      // Parse the result to extract URLs
      if (typeof result === 'string') {
        const links = result.match(/https?:\/\/[^\s"',;]+/g) || [];
        return links
          .map(link => link.replace(/[",;]+$/, '')) // Remove trailing punctuation
          .filter(link => this.isValidUrl(link)); // Validate URLs
      }
      
      return [];
    } catch (error) {
      console.warn(`Failed to extract links: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}