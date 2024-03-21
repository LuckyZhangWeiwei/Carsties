using System.Net;
using MassTransit;
using Polly;
using Polly.Extensions.Http;
using SearchService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// add polly policy
builder.Services.AddHttpClient<AuctionSvcHttpClient>().AddPolicyHandler(GetPolicy());

builder.Services.AddMassTransit(x =>
{
    x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();

    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("search", false));

    x.UsingRabbitMq(
        (context, cfg) =>
        {
            cfg.UseMessageRetry(r =>
            {
                r.Handle<RabbitMqConnectionException>();
                r.Interval(5, TimeSpan.FromSeconds(10));
            });

            cfg.Host(
                builder.Configuration["RabbitMq:Host"],
                "/",
                host =>
                {
                    host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
                    host.Username(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
                }
            );

            cfg.ReceiveEndpoint(
                "search-auction-created",
                e =>
                {
                    e.UseMessageRetry(r => r.Interval(10, 5));

                    e.ConfigureConsumer<AuctionCreatedConsumer>(context);
                }
            );

            cfg.ConfigureEndpoints(context);
        }
    );
});

var app = builder.Build();

app.UseAuthorization();

app.MapControllers();

// 用这种方式可以避免 当auction 服务停止时，程序一直停在 DbInitializer.InitDb, 一直走不到 app.Run()
app.Lifetime.ApplicationStarted.Register(async () =>
{
    await Policy
        .Handle<TimeoutException>()
        .WaitAndRetryAsync(5, retryAttempt => TimeSpan.FromSeconds(10))
        .ExecuteAndCaptureAsync(async () => await DbInitializer.InitDb(app));
});

app.Run();

static IAsyncPolicy<HttpResponseMessage> GetPolicy() =>
    HttpPolicyExtensions
        .HandleTransientHttpError()
        .OrResult(msg => msg.StatusCode == HttpStatusCode.NotFound)
        .WaitAndRetryForeverAsync(_ => TimeSpan.FromSeconds(3)); // try every 3 seconds
