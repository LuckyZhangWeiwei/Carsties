using AutoMapper;
using Contracts;

namespace BiddingService;

public class MappingProfilies : Profile
{
    public MappingProfilies()
    {
        CreateMap<Bid, BidDto>();
        CreateMap<Bid, BidPlaced>();
    }
}
