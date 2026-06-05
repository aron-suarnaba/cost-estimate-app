using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    [Table("PaperBoardPricing")]
    [PrimaryKey(nameof(ItemCode), nameof(Vendor), nameof(PType))] 
    public class PaperBoardPricing
    {
        [Column("Group", TypeName = "nvarchar(10)")]
        [StringLength(10)]
        public string? Group { get; set; }

        [Column("PType", TypeName = "nvarchar(7)")]
        [StringLength(7)]
        public string PType { get; set; } = null!;

        [Column(TypeName = "nvarchar(7)")]
        [StringLength(7)]
        public string Vendor { get; set; } = null!;

        [Column(TypeName = "nvarchar(30)")]
        [StringLength(30)]
        public string ItemCode { get; set; } = null!;

        [Column(TypeName = "nvarchar(3)")]
        [StringLength(3)]
        public string? Currcode { get; set; }

        [Column(TypeName = "decimal(20,8)")]
        public decimal? Price_MT { get; set; }

        [Column(TypeName = "decimal(20,8)")]
        public decimal? Price_Sheet { get; set; }

        [Column(TypeName = "decimal(20,8)")]
        public decimal? Price_Pound { get; set; }

        [Column(TypeName = "decimal(20,8)")]
        public decimal? Price_Bale { get; set; }

        // Mapped exactly as provided, though a decimal date is highly unusual.
        [Column(TypeName = "decimal(20,8)")]
        public decimal? EffectiveDate { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? CreateDate { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        [StringLength(20)]
        public string? CreatedBy { get; set; }
    }
}