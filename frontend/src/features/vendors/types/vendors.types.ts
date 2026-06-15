export interface VendorsCreateUpdateDto {
  Vendnum: string;
  Group?: string;
  Name?: string;
  Currcode?: string;
}

export interface VendorsResponseDto {
  Vendnum: string;
  Group?: string;
  Name?: string;
  Currcode?: string;
  CreateDate?: string;
  CreatedBy?: string;
}
