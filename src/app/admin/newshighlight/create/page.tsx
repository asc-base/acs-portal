import { NewsInformationForm } from "@/components/newsinformationform";
import { baseUrl } from "@/infra/container";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="w-full">
      <NewsInformationForm type="newshighlight" apiBase={baseUrl} />
    </div>
  );
}
