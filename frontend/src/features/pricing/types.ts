export interface PaperBoardPricingCreateUpdateDto {
  group?: string;
  pType: string;
  vendor: string;
  itemCode: string;
  currcode?: string;
  price_MT?: number;
  price_Sheet?: number;
  price_Pound?: number;
  price_Bale?: number;
  effectiveDate?: string;
}

export interface PaperBoardPricingResponseDto {
  group?: string;
  pType: string;
  vendor: string;
  itemCode: string;
  currcode?: string;
  price_MT?: number;
  price_Sheet?: number;
  price_Pound?: number;
  price_Bale?: number;
  effectiveDate?: string;
  createDate?: string;
  createdBy?: string;
}