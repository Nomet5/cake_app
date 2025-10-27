// app/admin/users/[id]/page.js
import { getUserById } from "../../../actions/admin/user.actions";
import { notFound } from "next/navigation";
import UserProfile from "./components/user-profile";
import UserStats from "./components/user-stats";
import UserActivity from "./components/user-activity";
import UserOrders from "./components/user-orders";
import BackButton from "../components/back-button";
import UserActions from "../components/user-actions";

export default async function UserDetailPage({ params }) {
  const id = parseInt(params.id);
  const result = await getUserById(id);

  if (!result.success) {
    notFound();
  }

  const { user } = result;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <BackButton />
        <UserActions user={user} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <UserProfile user={user} />
          <UserStats user={user} />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <UserActivity user={user} />
          <UserOrders user={user} />
        </div>
      </div>
    </div>
  );
}