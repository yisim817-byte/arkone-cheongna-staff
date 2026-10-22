import { createFileRoute } from "@tanstack/react-router";
import { handleVisitSubmit } from "@/lib/visit-submit.server";

// 작업지시서 13: 모델하우스 방문예약 접수 API (같은 출처에서만 호출).
export const Route = createFileRoute("/api/visit")({
  server: {
    handlers: {
      POST: ({ request }) => handleVisitSubmit(request),
    },
  },
});
