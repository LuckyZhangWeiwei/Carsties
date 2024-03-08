"use client";
import { useAuctionStore } from "@/hooks/useAuctionStore";
import { useBidStore } from "@/hooks/useBidStore";
import { Bid, Auction, AuctionFinished } from "@/types";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { User } from "next-auth";
import { ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import AuctionToaster from "../components/AuctionToaster";
import { usePathname } from "next/navigation";
import { getDetailedViewData } from "../actions/auctionActions";
import AuctionFinishedToast from "../components/AuctionFinishedToast";

type Props = {
  children: ReactNode;
  user: User | undefined | null;
};

export default function SignalRProvider({ children, user }: Props) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const setCurrentPrice = useAuctionStore((state) => state.setCurrentPrice);
  const addAuction = useAuctionStore((state) => state.addAuction);
  const addBid = useBidStore((state) => state.addBid);

  const pathname = usePathname();

  // nextjs bug 不能带入env.local中的值
  const apiUrl =
    process.env.NODE_ENV === "production"
      ? "https://api.carsties.com/notifications"
      : process.env.NEXT_PUBLIC_NOTIFY_URL;

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(apiUrl!)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [apiUrl]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to notification hub");

          connection.on("BidPlaced", (bid: Bid) => {
            if (bid.bidStatus.includes("Accepted")) {
              setCurrentPrice(bid.auctionId, bid.amount);
            }
            addBid(bid);
          });

          connection.on("AuctionCreated", (auction: Auction) => {
            if (user?.username !== auction.seller) {
              if (pathname === "/") {
                addAuction(auction);
              }

              return toast(<AuctionToaster auction={auction} />, {
                duration: 5000,
              });
            }
          });

          connection.on(
            "AuctionFinished",
            (finishedAuction: AuctionFinished) => {
              const auction = getDetailedViewData(finishedAuction.auctionId);
              return toast.promise(
                auction,
                {
                  loading: "Loading",
                  success: (auction) => (
                    <AuctionFinishedToast
                      auction={auction}
                      auctionFinished={finishedAuction}
                    />
                  ),
                  error: (error) => "Auction finished",
                },
                { success: { duration: 5000, icon: null } }
              );
            }
          );
        })
        .catch((error) => console.log("==error==", error));
    }

    return () => {
      console.log("==connection?.stop();==");
      connection?.stop();
    };
  }, [
    connection,
    setCurrentPrice,
    addAuction,
    addBid,
    pathname,
    user?.username,
  ]);

  return children;
}
