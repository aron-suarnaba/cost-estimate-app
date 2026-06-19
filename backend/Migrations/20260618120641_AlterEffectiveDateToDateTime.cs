using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AlterEffectiveDateToDateTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "EffectiveDate",
                table: "PaperBoardPricing",
                type: "datetime",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(20,8)",
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

            migrationBuilder.UpdateData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "C1S085G", "C1S", "IGOFSNL" },
                column: "EffectiveDate",
                value: new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "CB230G", "CB", "IGSEPCL" },
                column: "EffectiveDate",
                value: new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "CC250GS", "CC", "IGHAPCL" },
                column: "EffectiveDate",
                value: new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "CC300GS", "CC", "IGHAPCL" },
                column: "EffectiveDate",
                value: new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "CC350GS", "CC", "IGHAPCL" },
                column: "EffectiveDate",
                value: new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "FC210GR", "FC", "UNASGND" },
                column: "EffectiveDate",
                value: new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "EffectiveDate",
                table: "PaperBoardPricing",
                type: "decimal(20,8)",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldNullable: true);

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

            migrationBuilder.UpdateData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "C1S085G", "C1S", "IGOFSNL" },
                column: "EffectiveDate",
                value: 20250101.00m);

            migrationBuilder.UpdateData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "CB230G", "CB", "IGSEPCL" },
                column: "EffectiveDate",
                value: 20250101.00m);

            migrationBuilder.UpdateData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "CC250GS", "CC", "IGHAPCL" },
                column: "EffectiveDate",
                value: 20250101.00m);

            migrationBuilder.UpdateData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "CC300GS", "CC", "IGHAPCL" },
                column: "EffectiveDate",
                value: 20250101.00m);

            migrationBuilder.UpdateData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "CC350GS", "CC", "IGHAPCL" },
                column: "EffectiveDate",
                value: 20250101.00m);

            migrationBuilder.UpdateData(
                table: "PaperBoardPricing",
                keyColumns: new[] { "ItemCode", "PType", "Vendor" },
                keyValues: new object[] { "FC210GR", "FC", "UNASGND" },
                column: "EffectiveDate",
                value: 20250101.00m);
        }
    }
}
