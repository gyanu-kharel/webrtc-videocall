using Hooked.Api.Hubs;

namespace Hooked.Api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var corsConfig = builder.Configuration.GetSection("Cors:AllowedDomains").GetChildren();
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("allow-all-policy", policy =>
            {
                policy
                    .WithOrigins(corsConfig.Select(x => x.Value).ToArray())
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });
        builder.Services.AddControllers();
        builder.Services.AddSignalR();
        var app = builder.Build();

        app.UseHttpsRedirection();
        app.UseCors("allow-all-policy");

        app.MapControllers();
        app.MapHub<VCallSignalHub>("/hub");
        
        app.Run();
    }
}