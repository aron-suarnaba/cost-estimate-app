using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Vendors")]
    public class Vendors
    {
        [Key]
        [Column(TypeName = "nvarchar(10)")]
        [StringLength(10)]
        public string Vendnum { get; set; } = null!;

        [Column("Group", TypeName = "nvarchar(10)")]
        [StringLength(10)]
        public string? Group { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        [StringLength(50)]
        public string? Name { get; set; }

        [Column(TypeName = "nvarchar(3)")]
        [StringLength(3)]
        public string? Currcode { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? CreateDate { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        [StringLength(20)]
        public string? CreatedBy { get; set; }
    }
}