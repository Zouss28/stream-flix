import { AppLayout } from "@/components/app-layout"
import { TVDetailPage } from "@/components/tv-detail-page"

export default function TVDetail({ params }: { params: { id: string } }) {
  return (
    <AppLayout>
      <TVDetailPage id={params.id} />
    </AppLayout>
  )
}
