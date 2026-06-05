using Microsoft.EntityFrameworkCore;
using backend.Data;
using HealthChecks.SqlServer;

var builder = WebApplication.CreateBuilder(args);

//Connection to database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<CostEstimateContext>(options => options.UseSqlServer(connectionString));

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
// builder.Services.AddHealthChecks()
//     .AddSqlServer(connectionString);

var app = builder.Build();

// app.MapHealthChecks("/health");

// using (var scope = app.Services.CreateScope())
// {
//     var dbContext = scope.ServiceProvider.GetRequiredService<CostEstimateContext>();
//     try
//     {
//         // CanDatabaseConnect() returns true if the database is reachable
//         if (dbContext.Database.CanConnect())
//         {
//             Console.WriteLine("Successfully connected to the database!");
//         }
//         else
//         {
//             Console.WriteLine("Could not connect to the database.");
//         }
//     }
//     catch (Exception ex)
//     {
//         Console.WriteLine($"Error: {ex.Message}");
//     }
// }

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
