
export interface PerfumeRecommendation {
  name: string;
  brand: string;
  scentProfile: string[];
  story: string;
  imageUrl: string;
}

export interface RecommendationResponse {
  recommendations: PerfumeRecommendation[];
}
