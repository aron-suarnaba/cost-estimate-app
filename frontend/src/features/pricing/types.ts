export interface PaperBoardPricingCreateUpdateDto {
  Group?: string;
  PType: string;
  Vendor: string;
  ItemCode: string;
  Currcode?: string;
  Price_MT?: number;
  Price_Sheet?: number;
  Price_Pound?: number;
  Price_Bale?: number;
  EffectiveDate?: string;
}

export interface PaperBoardPricingResponseDto {
  Group?: string;
  PType: string;
  Vendor: string;
  ItemCode: string;
  Currcode?: string;
  Price_MT?: number;
  Price_Sheet?: number;
  Price_Pound?: number;
  Price_Bale?: number;
  EffectiveDate?: string;
  CreateDate?: string;
  CreatedBy?: string;
}
