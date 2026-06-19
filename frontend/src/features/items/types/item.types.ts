export interface ItemCreateUpdateDto {
  prodGroup: string;
  pType: string;
  itemCode: string;
  itemDesc: string;
  um: string;
  gsm: number;
  caliper: number;
  ppr: number;
  cbnum: number;
  width: number;
  length: number;
}

export interface ItemResponseDto {
  prodGroup?: string;
  pType?: string;
  itemCode: string;
  itemDesc?: string;
  um?: string;
  createDate?: string;
  createdBy?: string;
  gsm?: number;
  caliper?: number;
  ppr?: number;
  cbnum?: number;
  width?: number;
  length?: number;
}