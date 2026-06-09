using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class CostEstimateDbContext : DbContext
    {
        public CostEstimateDbContext(DbContextOptions<CostEstimateDbContext> options)
            : base(options)
        {
        }

        public DbSet<Item> Items { get; set; }
        public DbSet<PaperBoardPricing> PaperBoardPricing { get; set; }
        public DbSet<Ptype> Ptype { get; set; }
        public DbSet<Vendors> Vendors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Item>().HasKey(i => i.ItemCode);
            modelBuilder.Entity<Ptype>().HasKey(p => p.PType);
            modelBuilder.Entity<Vendors>().HasKey(v => v.Vendnum);
            modelBuilder.Entity<PaperBoardPricing>().HasKey(p => new { p.PType, p.Vendor, p.ItemCode });

            var seedDate = new DateTime(2024, 5, 29);
            var sysUser = "SystemSeed";

            // 1. Seed PType
            modelBuilder.Entity<Ptype>().HasData(
                new Ptype { PType = "BP", PtypeDesc = "Book Paper", DescLabel = "Book Paper", CreateDate = seedDate, CreatedBy = sysUser },
                new Ptype { PType = "CB", PtypeDesc = "Carrier Board", DescLabel = "CB", CreateDate = seedDate, CreatedBy = sysUser },
                new Ptype { PType = "CC", PtypeDesc = "CC Greyblack", DescLabel = "CC Greyblack", CreateDate = seedDate, CreatedBy = sysUser },
                new Ptype { PType = "C1S", PtypeDesc = "C1S", DescLabel = "C1S", CreateDate = seedDate, CreatedBy = sysUser },
                new Ptype { PType = "C2S", PtypeDesc = "C2S", DescLabel = "C2S", CreateDate = seedDate, CreatedBy = sysUser },
                new Ptype { PType = "FC", PtypeDesc = "Foldcote", DescLabel = "Foldcote", CreateDate = seedDate, CreatedBy = sysUser }
            );

            // 2. Seed Vendors
            modelBuilder.Entity<Vendors>().HasData(
                new Vendors { Vendnum = "IGHAPCL", Group = "IMPORTED", Name = "HANSOL PAPER CO. LTD.", Currcode = "USD", CreateDate = seedDate, CreatedBy = sysUser },
                new Vendors { Vendnum = "IGSEPCL", Group = "IMPORTED", Name = "STORA ENSO (GUANGXI) PACKAGING", Currcode = "USD", CreateDate = seedDate, CreatedBy = sysUser },
                new Vendors { Vendnum = "IGOFSNL", Group = "IMPORTED", Name = "OJI FIBRE SOLUTIONS (NZ) LIMITED", Currcode = "USD", CreateDate = seedDate, CreatedBy = sysUser },
                new Vendors { Vendnum = "IGSPHK2", Group = "IMPORTED", Name = "SAPPI PAPIER HOLDING GmBh", Currcode = "USD", CreateDate = seedDate, CreatedBy = sysUser },
                // CHANGED: "UNASSIGNED" shortened to "UNASGND" (7 characters) to fit tight column constraints
                new Vendors { Vendnum = "UNASGND", Group = "NONE", Name = "Pending Vendor Assignment", Currcode = "PHP", CreateDate = seedDate, CreatedBy = sysUser }
            );

            // 3. Seed Items
            modelBuilder.Entity<Item>().HasData(
                new Item { ProdGroup = "PAPER", PType = "CC", ItemCode = "CCG0250R", ItemDesc = "CC Greyblack 250 GSM", UM = "RL", GSM = 250, CreateDate = seedDate, CreatedBy = sysUser },
                new Item { ProdGroup = "PAPER", PType = "CC", ItemCode = "CCG0250S", ItemDesc = "CC Greyblack 250 GSM", UM = "SH", GSM = 250, CreateDate = seedDate, CreatedBy = sysUser },
                new Item { ProdGroup = "PAPER", PType = "FC", ItemCode = "FC0210R", ItemDesc = "Foldcote 210 GSM", UM = "RL", GSM = 210, CreateDate = seedDate, CreatedBy = sysUser },
                new Item { ProdGroup = "PAPER", PType = "CB", ItemCode = "CB0230R", ItemDesc = "Carrier Board 230 GSM", UM = "RL", GSM = 230, CreateDate = seedDate, CreatedBy = sysUser },
                new Item { ProdGroup = "PAPER", PType = "C1S", ItemCode = "C1S008500250028S", ItemDesc = "C1S Paper 85 GSM", UM = "SH", GSM = 85, Width = 25m, Length = 38m, CreateDate = seedDate, CreatedBy = sysUser },
                new Item { ProdGroup = "PAPER", PType = "C2S", ItemCode = "C2S0080R", ItemDesc = "C2S Paper 80 GSM", UM = "RL", GSM = 80, CreateDate = seedDate, CreatedBy = sysUser },
                new Item { ProdGroup = "PAPER", PType = "BP", ItemCode = "BP0065R", ItemDesc = "WOODFREE BP 65 GSM", UM = "RL", GSM = 65, CreateDate = seedDate, CreatedBy = sysUser }
            );

            // 4. Seed PaperBoardPricing
            modelBuilder.Entity<PaperBoardPricing>().HasData(
                new PaperBoardPricing { PType = "CC", Vendor = "IGHAPCL", ItemCode = "CC250GS", Group = "IMPORTED", Currcode = "USD", Price_MT = 540m, EffectiveDate = 20250101.00m, CreateDate = seedDate, CreatedBy = sysUser },
                new PaperBoardPricing { PType = "CC", Vendor = "IGHAPCL", ItemCode = "CC300GS", Group = "IMPORTED", Currcode = "USD", Price_MT = 515m, EffectiveDate = 20250101.00m, CreateDate = seedDate, CreatedBy = sysUser },
                new PaperBoardPricing { PType = "CC", Vendor = "IGHAPCL", ItemCode = "CC350GS", Group = "IMPORTED", Currcode = "USD", Price_MT = 500m, EffectiveDate = 20250101.00m, CreateDate = seedDate, CreatedBy = sysUser },

                // CHANGED: Matched the shortened Vendor key "UNASGND" here as well
                new PaperBoardPricing { PType = "FC", Vendor = "UNASGND", ItemCode = "FC210GR", Group = "IMPORTED", Currcode = "USD", Price_MT = 650m, EffectiveDate = 20250101.00m, CreateDate = seedDate, CreatedBy = sysUser },
                new PaperBoardPricing { PType = "CB", Vendor = "IGSEPCL", ItemCode = "CB230G", Group = "IMPORTED", Currcode = "USD", Price_MT = 630m, EffectiveDate = 20250101.00m, CreateDate = seedDate, CreatedBy = sysUser },
                new PaperBoardPricing { PType = "C1S", Vendor = "IGOFSNL", ItemCode = "C1S085G", Group = "IMPORTED", Currcode = "USD", Price_MT = 780m, EffectiveDate = 20250101.00m, CreateDate = seedDate, CreatedBy = sysUser }
            );
        }
    }
}