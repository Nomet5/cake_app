// src/app/admin/reviews/page.js
import {
  getReviews,
  getReviewStats,
} from "../../../actions/admin/review.actions";
import Link from "next/link";
import DeleteReviewModal from "../../Components/DeliteReviewModal";

export default async function ReviewsPage({ searchParams }) {
  const [reviews, stats] = await Promise.all([getReviews(), getReviewStats()]);

  const deleteReviewId = searchParams.delete;
  const reviewToDelete = reviews.find(
    (review) => review.id === parseInt(deleteReviewId)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Отзывы</h1>
          <p className="text-gray-600">
            Всего: {stats.total} | Одобрено: {stats.approved} | На модерации:{" "}
            {stats.pending}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/reviews?filter=approved"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Одобренные
          </Link>
          <Link
            href="/admin/reviews?filter=pending"
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
          >
            На модерации
          </Link>
        </div>
      </div>

      {/* Таблица отзывов */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Пользователь
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Рейтинг
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Комментарий
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Дата
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{review.id}</td>
                <td className="px-6 py-4">
                  {review.user?.firstName || review.user?.email}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-yellow-500">⭐</span>
                    <span className="ml-1">{review.rating}/5</span>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-xs truncate">
                  {review.comment}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      review.isApproved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {review.isApproved ? "Одобрен" : "На модерации"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(review.createdAt).toLocaleDateString("ru-RU")}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <Link
                    href={`/admin/reviews/${review.id}`}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Просмотреть
                  </Link>
                  <Link
                    href={`/admin/reviews?delete=${review.id}`}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Удалить
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно удаления */}
      {deleteReviewId && reviewToDelete && (
        <DeleteReviewModal
          reviewId={parseInt(deleteReviewId)}
          reviewInfo={{
            userName:
              reviewToDelete.user?.firstName || reviewToDelete.user?.email,
            rating: reviewToDelete.rating,
          }}
        />
      )}
    </div>
  );
}
