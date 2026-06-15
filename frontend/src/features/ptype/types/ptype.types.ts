export interface PtypeCreateUpdateDto {
  PType: string;
  PtypeDesc?: string;
  DescLabel?: string;
}

export interface PtypeResponseDto {
  PType: string;
  PtypeDesc?: string;
  DescLabel?: string;
  CreateDate?: string;
  CreatedBy?: string;
}
