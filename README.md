# Restaurant Webscan MCP Analyzer

A professional restaurant analysis tool that combines advanced MCP webscan tools with Google Gemini AI to provide comprehensive business intelligence. Extract restaurant website data and analyze it using state-of-the-art AI for detailed business insights and confidence scoring.

## ✨ Features

- **🕷️ MCP Webscan Integration**: Uses Model Context Protocol webscan tools for reliable data extraction
- **🧠 Google Gemini AI Integration**: Real AI-powered analysis with Gemini Flash 2.0 for intelligent content processing
- **📊 Comprehensive Analytics**: Business details, cuisine analysis, ownership information, and strategic insights
- **🎯 Multi-Page Discovery**: Intelligent crawling of relevant pages (about, contact, menu) for complete data collection
- **🔍 Confidence Scoring**: Individual and overall confidence metrics for every extracted data point
- **📱 No Fallback Data**: Returns only information discovered through webscan - no placeholder or assumed data
- **💾 Professional Output**: Structured analysis with confidence ratings and detailed summaries

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Google Gemini API key ([Get one free here](https://aistudio.google.com/app/apikey))
- MCP Webscan Server (built from source)

### Installation

```bash
# Clone the webscan server first
git clone https://github.com/bsmi021/mcp-server-webscan.git
cd mcp-server-webscan
npm install
npm run build

# Clone this repository
git clone <your-repo-url>
cd restaurant-webscan

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your configuration
```

### Configuration

Create your `.env` file:

```bash
# Required: Gemini AI Integration
GEMINI_API_KEY=your_gemini_api_key_here

# Required: Path to built webscan server
WEBSCAN_SERVER_PATH=/absolute/path/to/mcp-server-webscan/build/index.js

# Debug (optional)
DEBUG=restaurant-webscan:*
```

### Usage

```bash
# Analyze any restaurant website
npm run dev https://restaurant-website.com

# Examples
npm run dev https://labellamanagua.ca
npm run dev https://yuzusushi.ca
npm run dev https://olivegarden.com

# Build for production
npm run build
npm start https://restaurant-website.com
```

## 📊 What You Get

### Comprehensive Analysis Output

- **Business Intelligence**: Name, type, address, ownership details with confidence scores
- **Culinary Analysis**: Cuisine type and thoughtful food concept descriptions
- **Corporate Structure**: Parent company information and websites when available
- **Content Strategy**: Multi-page analysis of about, contact, and menu pages
- **Confidence Metrics**: Individual field confidence plus overall analysis reliability score
- **Data Integrity**: Only webscan-discovered information - no assumed or placeholder data

### Output Formats

- **📄 Structured Console Output**: Clean, formatted analysis with confidence indicators
- **🎯 Confidence Labels**: Very High (90%+), High (75%+), Medium (60%+), Low (40%+), Very Low (<40%)
- **📈 Multi-Source Analysis**: Combines homepage with relevant subpages for complete picture
- **🔍 Detailed Summaries**: Comprehensive analysis based on discovered content

## 🛠️ Technical Architecture

### Core Components

- **`webscan.service.ts`**: MCP webscan server integration with link extraction and page scanning
- **`gemini.service.ts`**: Google Gemini Flash 2.0 AI analysis with confidence scoring
- **`restaurant.service.ts`**: Orchestration and multi-page content aggregation
- **`main.ts`**: CLI interface and result presentation
- **`types/restaurant.ts`**: TypeScript definitions for data structures and confidence metrics

### API Integration

- **MCP Webscan Tools**: Reliable website content extraction using Model Context Protocol
- **Google Gemini 2.0 Flash**: State-of-the-art AI analysis for intelligent data extraction
- **Multi-Page Processing**: Automatic discovery and analysis of relevant restaurant pages
- **Error Handling**: Graceful degradation with detailed error reporting and confidence adjustments

## 🔧 Advanced Features

### Multi-Page Analysis

```typescript
// Automatically discovers and analyzes:
- About pages (/about, /story, /chef)
- Contact pages (/contact, /location)
- Menu pages (/menu)
// Limited to 3 additional pages for performance
```

### Confidence Scoring System

- **Individual Field Scoring**: Each data point gets its own confidence rating
- **Overall Analysis Score**: Weighted average of all field confidences
- **Transparency**: Clear indication when data is "not found by webscan"
- **No Assumptions**: System never fills in assumed or placeholder information

### URL Validation & Cleaning

- Intelligent URL sanitization and validation
- Automatic HTTPS protocol addition when missing
- Malformed URL filtering and error handling
- Support for complex restaurant website structures

## 📁 Output Examples

### Console Output
```
=== RESTAURANT ANALYSIS RESULTS ===

Business Name: RESTAURANT LUCIE
  Confidence: 100% (Very High)

URL: https://restaurantlucie.com

Business Type: Restaurant
  Confidence: 100% (Very High)

Cuisine Type: French
  Confidence: 95% (Very High)

Food Concept: Elegant French cuisine with a contemporary twist, offering a refined dining experience in downtown Toronto. Menus blend French sophistication with modern creativity.
  Confidence: 95% (Very High)

Parent Company: not found by webscan
  Confidence: N/A

Parent Company Website: not found by webscan
  Confidence: N/A

Owner Name: Yannick Bigourdan
  Confidence: 95% (Very High)

Chef Name: Arnaud Bloquel
  Confidence: 95% (Very High)

Restaurant Address: 100 Yonge Street
Toronto, ON
  Confidence: 100% (Very High)

Summary: Restaurant analysis for https://restaurantlucie.com: businessName: RESTAURANT LUCIE, businessType: Restaurant, cuisineType: French, foodConcept: Elegant French cuisine with a contemporary twist, offering a refined dining experience in downtown Toronto. Menus blend French sophistication with modern creativity., ownerName: Yannick Bigourdan, chefName: Arnaud Bloquel, restaurantAddress: 100 Yonge Street
Toronto, ON

OVERALL CONFIDENCE: 97% (Very High)

```

### Data Structure
```typescript
interface RestaurantDataWithConfidence {
  businessName: string;
  url: string;
  businessType: string;
  cuisineType: string;
  foodConcept: string;
  parentCompany: string;
  parentCompanyWebsite: string;
  ownerName: string;
  chefName: string;
  restaurantAddress: string;
  summary: string;
  confidence: {
    businessName: number;
    businessType: number;
    cuisineType: number;
    foodConcept: number;
    parentCompany: number;
    parentCompanyWebsite: number;
    ownerName: number;
    chefName: number;
    restaurantAddress: number;
    summary: number;
    overall: number;
  };
}
```

## 🚨 Important Notes

### System Requirements

- **MCP Server**: Requires manually built webscan server from GitHub repository
- **Path Configuration**: Absolute paths required for webscan server in environment variables
- **Node.js Version**: Requires Node.js 18+ for proper ES module support
- **Memory Usage**: Analysis of large restaurant websites may require increased Node.js heap size

### Reliability & Performance

- **Success Rate**: 90%+ for properly configured systems with valid restaurant websites
- **Analysis Quality**: Professional-grade insights powered by Google Gemini Flash 2.0
- **Speed**: Typically 15-45 seconds per restaurant analysis depending on website complexity
- **Multi-Page Limit**: Maximum 3 additional pages analyzed to prevent excessive processing time

## 🔍 Troubleshooting

### Common Issues

**"Failed to connect to stdio server 'webscan'"**: Check webscan server path in `.env`
```bash
WEBSCAN_SERVER_PATH=/absolute/path/to/mcp-server-webscan/build/index.js
```

**"Gemini API Error"**: Verify your API key configuration
```bash
GEMINI_API_KEY=your_actual_key_here
```

**"Received tool input did not match expected schema"**: URL validation issue - check for malformed links
**"tsx not recognized"**: Use `npx tsx` or install tsx globally with `npm install -g tsx`

### Debug Mode

```bash
DEBUG=restaurant-webscan:* npm run dev https://restaurant-website.com
```

### Path Issues on Windows

Use forward slashes or double backslashes:
```bash
# Correct
WEBSCAN_SERVER_PATH=C:/Users/Sean/mcp-server-webscan/build/index.js
# Or
WEBSCAN_SERVER_PATH=C:\\Users\\Sean\\mcp-server-webscan\\build\\index.js
```

---

**⚡ Powered by Google Gemini AI | 🕷️ MCP Webscan Tools | 📊 Business Intelligence**

*Built for business analysis and research purposes. Respects website robots.txt and implements reasonable rate limiting.*"# restaurant-webscan" 
