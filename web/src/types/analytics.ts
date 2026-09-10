export interface SummaryMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  avgRating: number;
  returnRate: number;
  retentionRate: number;
  deliveredCount: number;
  returnedCount: number;
  dateMin: string;
  dateMax: string;
  years: number[];
}

export interface MonthlyTrend {
  monthStr: string;
  year: number;
  month: number;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  avgRating: number;
  returns: number;
  returnRate: number;
  growth: number;
}

export interface YearlyTrend {
  year: number;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  avgRating: number;
  returns: number;
  returnRate: number;
}

export interface SubCategory {
  name: string;
  revenue: number;
  orders: number;
}

export interface CategoryMetric {
  category: string;
  revenue: number;
  orders: number;
  share: number;
  avgPrice: number;
  avgRating: number;
  returns: number;
  returnRate: number;
  subcategories: SubCategory[];
}

export interface TopLocation {
  location: string;
  revenue: number;
  orders: number;
}

export interface ZoneMetric {
  zone: string;
  revenue: number;
  orders: number;
  share: number;
  avgShippingFee: number;
  avgRating: number;
  returnRate: number;
  topLocations: TopLocation[];
  deliveryTypes: Record<string, number>;
}

export interface DeliveryTypeMetric {
  type: string;
  revenue: number;
  orders: number;
  share: number;
  avgRating: number;
  avgShippingFee: number;
  returnRate: number;
}

export interface ReturnReason {
  reason: string;
  count: number;
  percentage: number;
  lostRevenue: number;
}

export interface TopProduct {
  rank: number;
  product: string;
  category: string;
  revenue: number;
  unitsSold: number;
  orders: number;
  avgPrice: number;
  avgRating: number;
  returnRate: number;
}

export interface RfmSegment {
  segment: string;
  count: number;
  percentage: number;
  avgMonetary: number;
  avgRecencyDays: number;
  avgFrequency: number;
  description: string;
  strategy: string;
  color: string;
}

export interface Demographics {
  ageDistribution: { group: string; orders: number; revenue: number }[];
  genderDistribution: { gender: string; orders: number; revenue: number }[];
}

export interface SampleOrder {
  OrderID: number;
  OrderDate: string;
  CustomerID: number;
  "Customer Age": number;
  "Customer Gender": string;
  Location: string;
  Zone: string;
  "Delivery Type": string;
  "Product Category": string;
  SubCategory: string;
  Product: string;
  "Unit Price": number;
  "Shipping Fee": number;
  "Order Quantity": number;
  "Sale Price": number;
  Status: string;
  Reason: string;
  Rating: number;
  Revenue: number;
}

export interface SqlQuery {
  id: string;
  title: string;
  category: string;
  description: string;
  query: string;
  result: Record<string, any>[];
}

export interface DataDictionaryItem {
  column: string;
  type: string;
  description: string;
}

export interface ExecutiveInsight {
  category: string;
  title: string;
  finding: string;
  recommendation: string;
}

export interface AnalyticsPayload {
  summary: SummaryMetrics;
  monthlyTrends: MonthlyTrend[];
  yearlyTrends: YearlyTrend[];
  categoryMetrics: CategoryMetric[];
  zoneMetrics: ZoneMetric[];
  deliveryTypes: DeliveryTypeMetric[];
  returnReasons: ReturnReason[];
  topProducts: TopProduct[];
  rfmSegments: RfmSegment[];
  demographics: Demographics;
  sampleOrders: SampleOrder[];
  sqlQueries: SqlQuery[];
  dataDictionary: DataDictionaryItem[];
  executiveInsights: ExecutiveInsight[];
}
