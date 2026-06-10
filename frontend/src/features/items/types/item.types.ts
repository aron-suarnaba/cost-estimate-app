// Matches C# ItemCreateUpdateDto
export interface ItemCreateUpdateDto {
  prodGroup: string;
  pType: string;
  itemCode: string;
  itemDesc: string;
  um: string;
  gsm: number;
  caliper: number;
  ppr: number;
  width: number;
  length: number;
}

// Matches C# ItemResponseDto
export interface ItemResponseDto {
  prodGroup?: string;
  pType?: string;
  itemCode: string;
  itemDesc?: string;
  um?: string;
  createDate?: string; // Dates are transferred as ISO strings
  createdBy?: string;
  gsm?: number;
  caliper?: number;
  ppr?: number;
  width?: number;
  length?: number;
}