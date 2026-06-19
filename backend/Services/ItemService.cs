using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ItemService : IItemService
    {
        private readonly CostEstimateDbContext _context;

        public ItemService(CostEstimateDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ItemResponseDto>> GetAllItemsAsync()
        {
            return await _context.Items
                .Select(p => new ItemResponseDto
                {
                    ProdGroup = p.ProdGroup,
                    PType = p.PType,
                    ItemCode = p.ItemCode,
                    ItemDesc = p.ItemDesc,
                    UM = p.UM,
                    CreateDate = p.CreateDate,
                    CreatedBy = p.CreatedBy,
                    GSM = p.GSM,
                    Caliper = p.Caliper,
                    PPR = p.PPR,
                    Cbnum = p.Cbnum, // Added
                    Width = p.Width,
                    Length = p.Length
                }).ToListAsync();
        }

        public async Task<ItemResponseDto?> GetItemsByIdAsync(string itemCode)
        {
            var item = await _context.Items.FindAsync(itemCode);
            if (item == null) return null;

            return new ItemResponseDto
            {
                ProdGroup = item.ProdGroup,
                PType = item.PType,
                ItemCode = item.ItemCode,
                ItemDesc = item.ItemDesc,
                UM = item.UM,
                CreateDate = item.CreateDate,
                CreatedBy = item.CreatedBy,
                GSM = item.GSM,
                Caliper = item.Caliper,
                PPR = item.PPR,
                Cbnum = item.Cbnum, // Added
                Width = item.Width,
                Length = item.Length
            };
        }

        public async Task<ItemResponseDto> CreateItemsAsync(ItemCreateUpdateDto dto)
        {
            var item = new Item
            {
                ProdGroup = dto.ProdGroup,
                PType = dto.PType,
                ItemCode = dto.ItemCode,
                ItemDesc = dto.ItemDesc,
                UM = dto.UM,
                GSM = dto.GSM,
                Caliper = dto.Caliper,
                PPR = dto.PPR,
                Cbnum = dto.Cbnum, // Added
                Width = dto.Width,
                Length = dto.Length
            };

            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            return new ItemResponseDto
            {
                ProdGroup = item.ProdGroup,
                PType = item.PType,
                ItemCode = item.ItemCode,
                ItemDesc = item.ItemDesc,
                UM = item.UM,
                CreateDate = item.CreateDate,
                CreatedBy = item.CreatedBy,
                GSM = item.GSM,
                Caliper = item.Caliper,
                PPR = item.PPR,
                Cbnum = item.Cbnum, // Added
                Width = item.Width,
                Length = item.Length
            };
        }

        public async Task<ItemResponseDto?> UpdateItemsAsync(string itemCode, ItemCreateUpdateDto dto)
        {
            var item = await _context.Items.FindAsync(itemCode);
            if (item == null) return null;

            item.ProdGroup = dto.ProdGroup;
            item.PType = dto.PType;
            item.ItemCode = dto.ItemCode;
            item.ItemDesc = dto.ItemDesc;
            item.UM = dto.UM;
            item.GSM = dto.GSM;
            item.Caliper = dto.Caliper;
            item.PPR = dto.PPR;
            item.Cbnum = dto.Cbnum; // Added
            item.Width = dto.Width;
            item.Length = dto.Length;

            await _context.SaveChangesAsync();

            return new ItemResponseDto
            {
                ProdGroup = item.ProdGroup,
                PType = item.PType,
                ItemCode = item.ItemCode,
                ItemDesc = item.ItemDesc,
                UM = item.UM,
                CreateDate = item.CreateDate,
                CreatedBy = item.CreatedBy,
                GSM = item.GSM,
                Caliper = item.Caliper,
                PPR = item.PPR,
                Cbnum = item.Cbnum, // Added
                Width = item.Width,
                Length = item.Length
            };
        }

        public async Task<bool> DeleteItemsAsync(string itemCode)
        {
            var item = await _context.Items.FindAsync(itemCode);
            if (item == null) return false;

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}