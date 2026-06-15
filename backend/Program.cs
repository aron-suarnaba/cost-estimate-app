using System.Text;
using backend.Data;
using backend.Interfaces;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using backend.Middleware;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// ============================================================================
// 1. JWT AUTHENTICATION CONFIGURATION
// ============================================================================
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKeyString = jwtSettings["Secret"] ?? "SuperSecretBackupKeyThatIsAtLeast32BytesLong123!";
var secretKey = Encoding.UTF8.GetBytes(secretKeyString);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "http://localhost:7282",
        ValidAudience = jwtSettings["Audience"] ?? "http://localhost:5173",
        IssuerSigningKey = new SymmetricSecurityKey(secretKey),
        ClockSkew = TimeSpan.Zero
    };
});

// ============================================================================
// 2. DATA STORAGE & DATABASE CONFIGURATION
// ============================================================================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<CostEstimateDbContext>(options => 
    options.UseSqlServer(connectionString));

// ============================================================================
// 3. SECURITY & CROSS-ORIGIN RESOURCE SHARING (CORS)
// ============================================================================
var costEstimateCorsPolicy = "_CostEstimateCorsPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: costEstimateCorsPolicy,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()  
                  .AllowAnyMethod()  
                  .AllowCredentials(); 
        });
});

// ============================================================================
// 4. DEPENDENCY INJECTION (APPLICATION SERVICES)
// ============================================================================
builder.Services.AddScoped<IItemService, ItemService>();
builder.Services.AddScoped<IPtypeService, PtypeService>();
builder.Services.AddScoped<IVendorsService, VendorsService>();
builder.Services.AddScoped<IPaperBoardPricingService, PaperBoardPricingService>();

// ============================================================================
// 5. CORE CONTROLLER & API FRAMEWORKS (.NET 10 STABLE)
// ============================================================================
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddControllers(options =>
{
    options.Filters.Add(new AuthorizeFilter());
});

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        document.Info.Title = "Cost Estimation Engine API";
        document.Info.Version = "v1";
        document.Info.Description = "Enterprise ledger infrastructure for material variants.";
        return Task.CompletedTask;
    });
});

var app = builder.Build();

// ============================================================================
// 6. HTTP REQUEST PIPELINE (MIDDLEWARE REQUISITE ORDER)
// ============================================================================
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi(); // Exposes /openapi/v1.json
    
    // 🟢 Fully resolved UI pipeline reference wrapper
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "Cost Engine API v1");
        options.RoutePrefix = "swagger"; // Lands UI at https://localhost:7282/swagger
    });
}

app.UseHttpsRedirection();
app.UseExceptionHandler();
app.UseCors(costEstimateCorsPolicy);

app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();