import EmptyFilter from "@/app/components/EmptyFilter";
import React from "react";

export default function page({
  searchParams,
}: {
  searchParams: { callbackUrl: string };
}) {
  return (
    <EmptyFilter
      title="you need to be logged in to do that"
      subtitle="please click below to sign in"
      showLogin
      callbackUrl={searchParams.callbackUrl}
    />
  );
}
