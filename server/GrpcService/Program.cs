using GrpcService.Interfaces;
using GrpcService.Services;
using GrpcService.Utils;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddGrpc();
builder.Services.AddSingleton<IChat,Chat>();
builder.Services.AddCors(o => o.AddPolicy("AllowAll", policyBuilder =>
{
    policyBuilder.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowAnyHeader();
}));
var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseRouting();
app.UseGrpcWeb(); 
app.UseCors();
app.UseEndpoints(endpoints =>
{
    endpoints.MapGrpcService<ChatService>().EnableGrpcWeb()
        .RequireCors("AllowAll");
});
app.MapGet("/",
    () =>
        "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

app.Run();