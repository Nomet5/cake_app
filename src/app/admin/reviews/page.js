// app/admin/reviews/page.tsx
import {
  getReviews,
  approveReview,
  deleteReview,
} from "../../actions/admin/review.actions";

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Отзывы</h2>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left border-b">Пользователь</th>
              <th className="p-3 text-left border-b">Повар</th>
              <th className="p-3 text-left border-b">Рейтинг</th>
              <th className="p-3 text-left border-b">Статус</th>
              <th className="p-3 text-left border-b">Действия</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{review.user.firstName}</td>
                <td className="p-3">{review.chef.businessName}</td>
                <td className="p-3">{"⭐".repeat(review.rating)}</td>
                <td className="p-3">
                  {review.isApproved ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      Одобрен
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                      На модерации
                    </span>
                  )}
                </td>
                <td className="p-3 space-x-2">
                  {!review.isApproved && (
                    <form
                      action={approveReview.bind(null, review.id)}
                      className="inline"
                    >
                      <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                        Одобрить
                      </button>
                    </form>
                  )}
                  <form
                    action={deleteReview.bind(null, review.id)}
                    className="inline"
                  >
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                      Удалить
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
