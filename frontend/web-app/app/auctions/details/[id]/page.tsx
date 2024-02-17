import React from "react";

export default function Details({ params }: { params: { id: string } }) {
  return <div>Detail {params.id}</div>;
}
