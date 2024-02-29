"use client";
import { getBidsForAuction } from "@/app/actions/auctionActions";
import Heading from "@/app/components/Heading";
import { useBidStore } from "@/hooks/useBidStore";
import { Auction, Bid } from "@/types";
import { User } from "next-auth";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BidItem from "./BidItem";
import { numberWithCommas } from "@/app/lib/numberWithComma";
import EmptyFilter from "@/app/components/EmptyFilter";
import BidForm from "./BidForm";

type Props = {
  user: User | null;
  auction: Auction;
};

export default function BidList({ user, auction }: Props) {
  const bids = useBidStore((state) => state.bids);
  const setBids = useBidStore((state) => state.setBids);
  const [loading, setLoading] = useState(true);

  const highBid = bids.reduce(
    (pre, current) => (pre > current.amount ? pre : current.amount),
    0
  );

  useEffect(() => {
    getBidsForAuction(auction.id)
      .then((res: any) => {
        if (res.error) {
          throw res.error;
        }
        setBids(res as Bid[]);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [auction.id, setLoading, setBids]);

  if (loading) return <span>Loading bids...</span>;

  return (
    <>
      <div className="shadow-md rounded-lg">
        <div className="py-2 px-4 bg-white">
          <div className="sticky top-0 bg-white p-2">
            <Heading
              title={`Current high bid is $${numberWithCommas(highBid)}`}
            />
          </div>
        </div>
        <div className="overflow-auto h-[400px] flex flex-col-reverse px-2">
          {bids.length === 0 ? (
            <EmptyFilter
              title="No bids fro this item"
              subtitle="please feel free to make a bid"
            />
          ) : (
            <>
              {bids.map((bid) => (
                <BidItem key={bid.id} bid={bid} />
              ))}
            </>
          )}
        </div>
        <div className="px-2 pb-2 text-gray-500">
          <BidForm auctionId={auction.id} highBid={highBid} />
        </div>
      </div>
    </>
  );
}
