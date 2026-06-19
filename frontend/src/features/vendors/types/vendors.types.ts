export interface VendorsCreateUpdateDto {
  Vendnum: string;
  Group?: string;
  Name?: string;
  Currcode?: string;
}
export interface VendorsResponseDto {
  vendnum: string;
  group?: string;
  name?: string;
  currcode?: string;
  createDate?: string;
  createdBy?: string;
}