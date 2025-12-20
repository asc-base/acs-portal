import NewsHighlightForm from "./newshighlight.form";
import { baseUrl } from "@/infra/container";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="w-full">
      <NewsHighlightForm apiBase={baseUrl} />
    </div>
  );
}
