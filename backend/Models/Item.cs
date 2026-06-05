using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Items")]
    public class Item
    {
        [Key] // Placed here based on your schema marking (ü)
        [Column(TypeName = "nvarchar(20)")]
        [StringLength(20)]
        public string ProdGroup { get; set; } = null!;

        [Column("PType", TypeName = "nvarchar(7)")]
        [StringLength(7)]
        public string? PType { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        [StringLength(30)]
        public string? ItemCode { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        [StringLength(50)]
        public string? ItemDesc { get; set; }

        [Column(TypeName = "nvarchar(3)")]
        [StringLength(3)]
        public string? UM { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? CreateDate { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        [StringLength(20)]
        public string? CreatedBy { get; set; }

        public int? GSM { get; set; }
        public int? Caliper { get; set; }
        public int? PPR { get; set; }
        public int? Cbnum { get; set; }

        [Column(TypeName = "decimal(20,4)")]
        public decimal? Width { get; set; }

        [Column(TypeName = "decimal(20,4)")]
        public decimal? Length { get; set; }
    }
}