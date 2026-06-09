using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class PaperBoardPricingService : IPaperBoardPricingService
    {
        private readonly CostEstimateDbContext _context;
        public PaperBoardPricingService(CostEstimateDbContext context) => _context = context;

        public async Task<IEnumerable<PaperBoardPricingResponseDto>> GetAllAsync()
        {
            return await _context.PaperBoardPricing.Select(pb => new PaperBoardPricingResponseDto
            {
                Group = pb.Group, PType = pb.PType, Vendor = pb.Vendor, ItemCode = pb.ItemCode, Currcode = pb.Currcode,
                Price_MT = pb.Price_MT, Price_Sheet = pb.Price_Sheet, Price_Pound = pb.Price_Pound, Price_Bale = pb.Price_Bale,
                EffectiveDate = pb.EffectiveDate, CreateDate = pb.CreateDate, CreatedBy = pb.CreatedBy
            }).ToListAsync();
        }

        public async Task<PaperBoardPricingResponseDto?> GetByKeyAsync(string itemCode, string vendor, string ptype)
        {
            // Pass composite key options exactly in order mapped by DbContext config
            var pb = await _context.PaperBoardPricing.FindAsync(itemCode, vendor, ptype);
            if (pb == null) return null;
            return new PaperBoardPricingResponseDto
            {
                Group = pb.Group, PType = pb.PType, Vendor = pb.Vendor, ItemCode = pb.ItemCode, Currcode = pb.Currcode,
                Price_MT = pb.Price_MT, Price_Sheet = pb.Price_Sheet, Price_Pound = pb.Price_Pound, Price_Bale = pb.Price_Bale,
                EffectiveDate = pb.EffectiveDate, CreateDate = pb.CreateDate, CreatedBy = pb.CreatedBy
            };
        }

        public async Task<PaperBoardPricingResponseDto> CreateAsync(PaperBoardPricingCreateUpdateDto dto)
        {
            var pb = new PaperBoardPricing
            {
                Group = dto.Group, PType = dto.PType, Vendor = dto.Vendor, ItemCode = dto.ItemCode, Currcode = dto.Currcode,
                Price_MT = dto.Price_MT, Price_Sheet = dto.Price_Sheet, Price_Pound = dto.Price_Pound, Price_Bale = dto.Price_Bale,
                EffectiveDate = dto.EffectiveDate, CreateDate = DateTime.Now, CreatedBy = "SYSTEM"
            };
            _context.PaperBoardPricing.Add(pb);
            await _context.SaveChangesAsync();
            return new PaperBoardPricingResponseDto
            {
                Group = pb.Group, PType = pb.PType, Vendor = pb.Vendor, ItemCode = pb.ItemCode, Currcode = pb.Currcode,
                Price_MT = pb.Price_MT, Price_Sheet = pb.Price_Sheet, Price_Pound = pb.Price_Pound, Price_Bale = pb.Price_Bale,
                EffectiveDate = pb.EffectiveDate, CreateDate = pb.CreateDate, CreatedBy = pb.CreatedBy
            };
        }

        public async Task<PaperBoardPricingResponseDto?> UpdateAsync(string itemCode, string vendor, string ptype, PaperBoardPricingCreateUpdateDto dto)
        {
            var pb = await _context.PaperBoardPricing.FindAsync(itemCode, vendor, ptype);
            if (pb == null) return null;

            pb.Group = dto.Group; pb.Currcode = dto.Currcode;
            pb.Price_MT = dto.Price_MT; pb.Price_Sheet = dto.Price_Sheet;
            pb.Price_Pound = dto.Price_Pound; pb.Price_Bale = dto.Price_Bale;
            pb.EffectiveDate = dto.EffectiveDate;

            await _context.SaveChangesAsync();
            return new PaperBoardPricingResponseDto
            {
                Group = pb.Group, PType = pb.PType, Vendor = pb.Vendor, ItemCode = pb.ItemCode, Currcode = pb.Currcode,
                Price_MT = pb.Price_MT, Price_Sheet = pb.Price_Sheet, Price_Pound = pb.Price_Pound, Price_Bale = pb.Price_Bale,
                EffectiveDate = pb.EffectiveDate, CreateDate = pb.CreateDate, CreatedBy = pb.CreatedBy
            };
        }

        public async Task<bool> DeleteAsync(string itemCode, string vendor, string ptype)
        {
            var pb = await _context.PaperBoardPricing.FindAsync(itemCode, vendor, ptype);
            if (pb == null) return false;
            _context.PaperBoardPricing.Remove(pb);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}