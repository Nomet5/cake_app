// src/app/admin/products/handler.js
"use server";

import { redirect } from "next/navigation";
import {
  toggleProductAvailable,
  deleteProduct,
} from "../../actions/admin/product.actions";

export async function handleSearchParams(searchParams) {
  // Обработка переключения доступности
  if (searchParams.toggle) {
    await toggleProductAvailable(Number(searchParams.toggle));
    redirect("/admin/products");
  }

  // Обработка удаления
  if (searchParams.delete) {
    await deleteProduct(Number(searchParams.delete));
    redirect("/admin/products");
  }
}
