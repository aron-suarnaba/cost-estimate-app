using System;

namespace backend.DTOs
{
    public record VendorsCreateUpdateDto
    {
        public string Vendnum { get; init; } = null!;
        public string? Group { get; init; }
        public string? Name { get; init; }
        public string? Currcode { get; init; }
    }

    public record VendorsResponseDto
    {
        public string Vendnum { get; init; } = null!;
        public string? Group { get; init; }
        public string? Name { get; init; }
        public string? Currcode { get; init; }
        public DateTime? CreateDate { get; init; }
        public string? CreatedBy { get; init; }
    }
}