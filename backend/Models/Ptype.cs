using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Ptype")]
    public class Ptype
    {
        [Key]
        [Column("PType", TypeName = "nvarchar(7)")]
        [StringLength(7)]
        public string PType { get; set; } = null!;

        [Column(TypeName = "nvarchar(40)")]
        [StringLength(40)]
        public string? PtypeDesc { get; set; }

        [Column(TypeName = "nvarchar(40)")]
        [StringLength(40)]
        public string? DescLabel { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? CreateDate { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        [StringLength(20)]
        public string? CreatedBy { get; set; }
    }
}