using Microsoft.EntityFrameworkCore;
using backend.Data;
using HealthChecks.SqlServer;

var builder = WebApplication.CreateBuilder(args);

//Connection to database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<CostEstimateDbContext>(options => options.UseSqlServer(connectionString));

var CostEstimateCorsPolicy = "_CostEstimateCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: CostEstimateCorsPolicy,
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                    });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors(CostEstimateCorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();
