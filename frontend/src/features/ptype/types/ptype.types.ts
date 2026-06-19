export interface PtypeCreateUpdateDto {
  pType: string;
  ptypeDesc?: string;
  descLabel?: string;
}

export interface PtypeResponseDto {
  pType: string;
  ptypeDesc?: string;
  descLabel?: string;
  createDate?: string;
  createdBy?: string;
}