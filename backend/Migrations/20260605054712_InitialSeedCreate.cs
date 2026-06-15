using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialSeedCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PaperBoardPricing",
                table: "PaperBoardPricing");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Items",
                table: "Items");

            migrationBuilder.AlterColumn<string>(
                name: "ItemCode",
                table: "Items",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(30)",
                oldMaxLength: 30,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ProdGroup",
                table: "Items",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PaperBoardPricing",
                table: "PaperBoardPricing",
                columns: new[] { "PType", "Vendor", "ItemCode" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Items",
                table: "Items",
                column: "ItemCode");

            migrationBuilder.InsertData(
                table: "Items",
                columns: new[] { "ItemCode", "Caliper", "Cbnum", "CreateDate", "CreatedBy", "GSM", "ItemDesc", "Length", "PPR", "PType", "ProdGroup", "UM", "Width" },
                values: new object[,]
                {
                    { "BP0065R", null, null, new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", 65, "WOODFREE BP 65 GSM", null, null, "BP", "PAPER", "RL", null },
                    { "C1S008500250028S", null, null, new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", 85, "C1S Paper 85 GSM", 38m, null, "C1S", "PAPER", "SH", 25m },
                    { "C2S0080R", null, null, new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", 80, "C2S Paper 80 GSM", null, null, "C2S", "PAPER", "RL", null },
                    { "CB0230R", null, null, new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", 230, "Carrier Board 230 GSM", null, null, "CB", "PAPER", "RL", null },
                    { "CCG0250R", null, null, new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", 250, "CC Greyblack 250 GSM", null, null, "CC", "PAPER", "RL", null },
                    { "CCG0250S", null, null, new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", 250, "CC Greyblack 250 GSM", null, null, "CC", "PAPER", "SH", null },
                    { "FC0210R", null, null, new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", 210, "Foldcote 210 GSM", null, null, "FC", "PAPER", "RL", null }
                });

            migrationBuilder.InsertData(
                table: "PaperBoardPricing",
                columns: new[] { "ItemCode", "PType", "Vendor", "CreateDate", "CreatedBy", "Currcode", "EffectiveDate", "Group", "Price_Bale", "Price_MT", "Price_Pound", "Price_Sheet" },
                values: new object[,]
                {
                    { "C1S085G", "C1S", "IGOFSNL", new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", "USD", 20250101.00m, "IMPORTED", null, 780m, null, null },
                    { "CB230G", "CB", "IGSEPCL", new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", "USD", 20250101.00m, "IMPORTED", null, 630m, null, null },
                    { "CC250GS", "CC", "IGHAPCL", new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", "USD", 20250101.00m, "IMPORTED", null, 540m, null, null },
                    { "CC300GS", "CC", "IGHAPCL", new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", "USD", 20250101.00m, "IMPORTED", null, 515m, null, null },
                    { "CC350GS", "CC", "IGHAPCL", new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", "USD", 20250101.00m, "IMPORTED", null, 500m, null, null },
                    { "FC210GR", "FC", "UNASGND", new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", "USD", 20250101.00m, "IMPORTED", null, 650m, null, null }
                });

            migrationBuilder.InsertData(
                table: "Ptype",
                columns: new[] { "PType", "CreateDate", "CreatedBy", "DescLabel", "PtypeDesc" },
                values: new object[,]
                {
                    { "BP", new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", "Book Paper", "Book Paper" },
                    { "C1S", new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", "C1S", "C1S" },
                    { "C2S", new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", "C2S", "C2S" },
                    { "CB", new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", "CB", "Carrier Board" },
                    { "CC", new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", "CC Greyblack", "CC Greyblack" },
                    { "FC", new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", "Foldcote", "Foldcote" }
                });

            migrationBuilder.InsertData(
                table: "Vendors",
                columns: new[] { "Vendnum", "CreateDate", "CreatedBy", "Currcode", "Group", "Name" },
                values: new object[,]
                {
                    { "IGHAPCL", new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", "USD", "IMPORTED", "HANSOL PAPER CO. LTD." },
                    { "IGOFSNL", new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", "USD", "IMPORTED", "OJI FIBRE SOLUTIONS (NZ) LIMITED" },
                    { "IGSEPCL", new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", "USD", "IMPORTED", "STORA ENSO (GUANGXI) PACKAGING" },
                    { "IGSPHK2", new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", "USD", "IMPORTED", "SAPPI PAPIER HOLDING GmBh" },
                    { "UNASGND", new DateTime(2024, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), "SystemSeed", "PHP", "NONE", "Pending Vendor Assignment" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PaperBoardPricing",
                table: "PaperBoardPricing");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Items",
                table: "Items");

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "ItemCode",
                keyValue: "BP0065R");

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "ItemCode",
                keyValue: "C1S008500250028S");

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "ItemCode",
                keyValue: "C2S0080R");

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "ItemCode",
                keyValue: "CB0230R");

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "ItemCode",
                keyValue: "CCG0250R");

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "ItemCode",
                keyValue: "CCG0250S");

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "ItemCode",
                keyValue: "FC0210R");

            migrationBuilder.DeleteData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "C1S085G", "C1S", "IGOFSNL" });

            migrationBuilder.DeleteData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "CB230G", "CB", "IGSEPCL" });

            migrationBuilder.DeleteData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "CC250GS", "CC", "IGHAPCL" });

            migrationBuilder.DeleteData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "CC300GS", "CC", "IGHAPCL" });

            migrationBuilder.DeleteData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "CC350GS", "CC", "IGHAPCL" });

            migrationBuilder.DeleteData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "FC210GR", "FC", "UNASGND" });

            migrationBuilder.DeleteData(
                table: "Ptype",
                keyColumn: "PType",
                keyValue: "BP");

            migrationBuilder.DeleteData(
                table: "Ptype",
                keyColumn: "PType",
                keyValue: "C1S");

            migrationBuilder.DeleteData(
                table: "Ptype",
                keyColumn: "PType",
                keyValue: "C2S");

            migrationBuilder.DeleteData(
                table: "Ptype",
                keyColumn: "PType",
                keyValue: "CB");

            migrationBuilder.DeleteData(
                table: "Ptype",
                keyColumn: "PType",
                keyValue: "CC");

            migrationBuilder.DeleteData(
                table: "Ptype",
                keyColumn: "PType",
                keyValue: "FC");

            migrationBuilder.DeleteData(
                table: "Vendors",
                keyColumn: "Vendnum",
                keyValue: "IGHAPCL");

            migrationBuilder.DeleteData(
                table: "Vendors",
                keyColumn: "Vendnum",
                keyValue: "IGOFSNL");

            migrationBuilder.DeleteData(
                table: "Vendors",
                keyColumn: "Vendnum",
                keyValue: "IGSEPCL");

            migrationBuilder.DeleteData(
                table: "Vendors",
                keyColumn: "Vendnum",
                keyValue: "IGSPHK2");

            migrationBuilder.DeleteData(
                table: "Vendors",
                keyColumn: "Vendnum",
                keyValue: "UNASGND");

            migrationBuilder.AlterColumn<string>(
                name: "ProdGroup",
                table: "Items",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ItemCode",
                table: "Items",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(30)",
                oldMaxLength: 30);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PaperBoardPricing",
                table: "PaperBoardPricing",
                columns: new[] { "ItemCode", "Vendor", "PType" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Items",
                table: "Items",
                column: "ProdGroup");
        }
    }
}
