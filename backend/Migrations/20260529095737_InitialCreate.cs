using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    ProdGroup = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    PType = table.Column<string>(type: "nvarchar(7)", maxLength: 7, nullable: true),
                    ItemCode = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    ItemDesc = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UM = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    GSM = table.Column<int>(type: "int", nullable: true),
                    Caliper = table.Column<int>(type: "int", nullable: true),
                    PPR = table.Column<int>(type: "int", nullable: true),
                    Cbnum = table.Column<int>(type: "int", nullable: true),
                    Width = table.Column<decimal>(type: "decimal(20,4)", nullable: true),
                    Length = table.Column<decimal>(type: "decimal(20,4)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.ProdGroup);
                });

            migrationBuilder.CreateTable(
                name: "PaperBoardPricing",
                columns: table => new
                {
                    PType = table.Column<string>(type: "nvarchar(7)", maxLength: 7, nullable: false),
                    Vendor = table.Column<string>(type: "nvarchar(7)", maxLength: 7, nullable: false),
                    ItemCode = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Group = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Currcode = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: true),
                    Price_MT = table.Column<decimal>(type: "decimal(20,8)", nullable: true),
                    Price_Sheet = table.Column<decimal>(type: "decimal(20,8)", nullable: true),
                    Price_Pound = table.Column<decimal>(type: "decimal(20,8)", nullable: true),
                    Price_Bale = table.Column<decimal>(type: "decimal(20,8)", nullable: true),
                    EffectiveDate = table.Column<decimal>(type: "decimal(20,8)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaperBoardPricing", x => new { x.ItemCode, x.Vendor, x.PType });
                });

            migrationBuilder.CreateTable(
                name: "Ptype",
                columns: table => new
                {
                    PType = table.Column<string>(type: "nvarchar(7)", maxLength: 7, nullable: false),
                    PtypeDesc = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    DescLabel = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ptype", x => x.PType);
                });

            migrationBuilder.CreateTable(
                name: "Vendors",
                columns: table => new
                {
                    Vendnum = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Group = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Currcode = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendors", x => x.Vendnum);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Items");

            migrationBuilder.DropTable(
                name: "PaperBoardPricing");

            migrationBuilder.DropTable(
                name: "Ptype");

            migrationBuilder.DropTable(
                name: "Vendors");
        }
    }
}
