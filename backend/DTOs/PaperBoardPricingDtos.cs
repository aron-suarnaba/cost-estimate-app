using System;

namespace backend.DTOs
{
    public record PaperBoardPricingCreateUpdateDto
    {
        public string? Group { get; init; }
        public string PType { get; init; } = null!;
        public string Vendor { get; init; } = null!;
        public string ItemCode { get; init; } = null!;
        public string? Currcode { get; init; }
        public decimal? Price_MT { get; init; }
        public decimal? Price_Sheet { get; init; }
        public decimal? Price_Pound { get; init; }
        public decimal? Price_Bale { get; init; }
        public DateTime? EffectiveDate { get; init; }
    }

    public record PaperBoardPricingResponseDto
    {
        public string? Group { get; init; }
        public string PType { get; init; } = null!;
        public string Vendor { get; init; } = null!;
        public string ItemCode { get; init; } = null!;
        public string? Currcode { get; init; }
        public decimal? Price_MT { get; init; }
        public decimal? Price_Sheet { get; init; }
        public decimal? Price_Pound { get; init; }
        public decimal? Price_Bale { get; init; }
        public DateTime? EffectiveDate { get; init; }
        public DateTime? CreateDate { get; init; }
        public string? CreatedBy { get; init; }
    }
}