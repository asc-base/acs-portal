import React from "react";
import { getExampleData } from "@/app/example/action";
import { to } from "@/interface/asyncresult";

export default async function Example() {
  const { data, err } = await to(getExampleData());

  if (err) {
    return (
      <>
        <h1 className="font-bold">Example</h1>
        <pre>{JSON.stringify(err, null, 2)}</pre>
      </>
    );
  }

  return (
    <>
      <h1 className="font-bold">Example</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
