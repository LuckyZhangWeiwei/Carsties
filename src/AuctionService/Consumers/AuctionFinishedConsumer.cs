using AuctionService.Data;
using AuctionService.Entities;
using Contracts;
using MassTransit;

namespace AuctionService;

public class AuctionFinishedConsumer : IConsumer<AuctionFinished>
{
    private AuctionDbContext _auctionDbContext;

    public AuctionFinishedConsumer(AuctionDbContext auctionDbContext)
    {
        _auctionDbContext = auctionDbContext;
    }

    public async Task Consume(ConsumeContext<AuctionFinished> context)
    {
        Console.WriteLine("-----> consuming AuctionFinishedConsumer ");
        
        var auction = await _auctionDbContext.Auctions.FindAsync(context.Message.AuctionId);

        if (context.Message.ItemSold)
        {
            auction.Winner = context.Message.Winner;
            auction.SolidAmont = context.Message.Amout;
        }

        auction.Status =
            auction.SolidAmont > auction.ReservePrice ? Status.Finished : Status.ReserveNotMet;

        await _auctionDbContext.SaveChangesAsync();
    }
}
