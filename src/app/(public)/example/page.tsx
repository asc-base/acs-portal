import React from "react";
import { getExampleData } from "@/app/(public)/example/action";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Example() {
  const result = await getExampleData();

  if (result instanceof Error) {
    return (
      <>
        <h1 className="font-bold">Example</h1>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </>
    );
  }

  return (
    <>
      <h1 className="font-bold">Example</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </>
  );
}
