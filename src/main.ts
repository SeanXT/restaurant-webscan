#!/usr/bin/env node

import { config } from 'dotenv';
import { RestaurantService } from './services/restaurant.service.js';
import { isValidUrl, sanitizeUrl } from './utils/validation.js';
import { getConfidenceLabel } from './utils/confidence.js';

config();

async function main() {
  const url = process.argv[2];
  
  if (!url) {
    console.error('Usage: npm run dev <restaurant-url>');
    process.exit(1);
  }

  const sanitizedUrl = sanitizeUrl(url);
  
  if (!isValidUrl(sanitizedUrl)) {
    console.error('Invalid URL provided');
    process.exit(1);
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.error('GEMINI_API_KEY environment variable is required');
    process.exit(1);
  }

  const restaurantService = new RestaurantService(geminiApiKey);

  try {
    await restaurantService.initialize();
    console.log(`Analyzing restaurant: ${sanitizedUrl}\n`);
    
    const result = await restaurantService.analyzeRestaurant(sanitizedUrl);
    
    // Output results
    console.log('=== RESTAURANT ANALYSIS RESULTS ===\n');
    
    console.log(`Business Name: ${result.businessName}`);
    console.log(`  Confidence: ${result.confidence.businessName === 'N/A' ? 'N/A' : `${result.confidence.businessName}% (${getConfidenceLabel(result.confidence.businessName as number)})`}\n`);
    
    console.log(`URL: ${result.url}\n`);
    
    console.log(`Business Type: ${result.businessType}`);
    console.log(`  Confidence: ${result.confidence.businessType === 'N/A' ? 'N/A' : `${result.confidence.businessType}% (${getConfidenceLabel(result.confidence.businessType as number)})`}\n`);
    
    console.log(`Cuisine Type: ${result.cuisineType}`);
    console.log(`  Confidence: ${result.confidence.cuisineType === 'N/A' ? 'N/A' : `${result.confidence.cuisineType}% (${getConfidenceLabel(result.confidence.cuisineType as number)})`}\n`);
    
    console.log(`Food Concept: ${result.foodConcept}`);
    console.log(`  Confidence: ${result.confidence.foodConcept === 'N/A' ? 'N/A' : `${result.confidence.foodConcept}% (${getConfidenceLabel(result.confidence.foodConcept as number)})`}\n`);
    
    console.log(`Parent Company: ${result.parentCompany}`);
    console.log(`  Confidence: ${result.confidence.parentCompany === 'N/A' ? 'N/A' : `${result.confidence.parentCompany}% (${getConfidenceLabel(result.confidence.parentCompany as number)})`}\n`);
    
    console.log(`Parent Company Website: ${result.parentCompanyWebsite}`);
    console.log(`  Confidence: ${result.confidence.parentCompanyWebsite === 'N/A' ? 'N/A' : `${result.confidence.parentCompanyWebsite}% (${getConfidenceLabel(result.confidence.parentCompanyWebsite as number)})`}\n`);
    
    console.log(`Owner Name: ${result.ownerName}`);
    console.log(`  Confidence: ${result.confidence.ownerName === 'N/A' ? 'N/A' : `${result.confidence.ownerName}% (${getConfidenceLabel(result.confidence.ownerName as number)})`}\n`);
    
    console.log(`Chef Name: ${result.chefName}`);
    console.log(`  Confidence: ${result.confidence.chefName === 'N/A' ? 'N/A' : `${result.confidence.chefName}% (${getConfidenceLabel(result.confidence.chefName as number)})`}\n`);
    
    console.log(`Restaurant Address: ${result.restaurantAddress}`);
    console.log(`  Confidence: ${result.confidence.restaurantAddress === 'N/A' ? 'N/A' : `${result.confidence.restaurantAddress}% (${getConfidenceLabel(result.confidence.restaurantAddress as number)})`}\n`);
    
    console.log(`Summary: ${result.summary}\n`);
    
    console.log(`OVERALL CONFIDENCE: ${result.confidence.overall}% (${getConfidenceLabel(result.confidence.overall)})`);
    
  } catch (error) {
    console.error('Error analyzing restaurant:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  } finally {
    await restaurantService.close();
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\nGracefully shutting down...');
  process.exit(0);
});

main().catch(console.error);