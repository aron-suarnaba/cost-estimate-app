using System;

namespace backend.DTOs
{
    public record PtypeCreateUpdateDto
    {
        public string PType { get; init; } = null!;
        public string? PtypeDesc { get; init; }
        public string? DescLabel { get; init; }
    }

    public record PtypeResponseDto
    {
        public string PType { get; init; } = null!;
        public string? PtypeDesc { get; init; }
        public string? DescLabel { get; init; }
        public DateTime? CreateDate { get; init; }
        public string? CreatedBy { get; init; }
    }
}