using AutoMapper;

namespace BiddingService;

public class MappingProfilies : Profile
{
    public MappingProfilies()
    {
        CreateMap<Bid, BidDto>();
    }
}
