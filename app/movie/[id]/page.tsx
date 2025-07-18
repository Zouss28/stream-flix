import { AppLayout } from "@/components/app-layout"
import { MovieDetailPage } from "@/components/movie-detail-page"

export default function MovieDetail({ params }: { params: { id: string } }) {
  return (
    <AppLayout>
      <MovieDetailPage id={params.id} />
    </AppLayout>
  )
}
