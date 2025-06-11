export interface RestaurantData {
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
}

export interface RestaurantDataWithConfidence extends RestaurantData {
  confidence: {
    businessName: number | 'N/A';
    businessType: number | 'N/A';
    cuisineType: number | 'N/A';
    foodConcept: number | 'N/A';
    parentCompany: number | 'N/A';
    parentCompanyWebsite: number | 'N/A';
    ownerName: number | 'N/A';
    chefName: number | 'N/A';
    restaurantAddress: number | 'N/A';
    summary: number | 'N/A';
    overall: number;
  };
}

export interface WebscanResult {
  content: string;
  url: string;
  timestamp: Date;
}