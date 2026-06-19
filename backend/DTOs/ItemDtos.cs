namespace backend.DTOs
{
    public record ItemCreateUpdateDto
    {
        public string ProdGroup { get; init; } = null!;
        public string PType { get; init; } = null!;
        public string ItemCode { get; init; } = null!;
        public string ItemDesc { get; init; } = null!;
        public string UM { get; init; } = null!;
        public int GSM { get; init; }
        public int Caliper { get; init; }
        public int PPR { get; init; }
        public int Cbnum { get; init; }
        public decimal Width { get; init; }
        public decimal Length { get; init; }
    }

    public record ItemResponseDto
    {
        public string? ProdGroup { get; init; }
        public string? PType { get; init; }
        public string ItemCode { get; init; } = null!;
        public string? ItemDesc { get; init; }
        public string? UM { get; init; }
        public DateTime? CreateDate { get; init; }
        public string? CreatedBy { get; init; }
        public int? GSM { get; init; }
        public int? Caliper { get; init; }
        public int? PPR { get; init; }
        public int? Cbnum { get; init; } 
        public decimal? Width { get; init; }
        public decimal? Length { get; init; }
    }
}