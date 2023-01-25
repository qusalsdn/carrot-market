import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";
import { Product, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";

interface ProductWithUser extends Product {
  user: User;
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage = () => {
  const router = useRouter();
  // useSWR을 사용할 때 optional query는 아래처럼 구현한다.
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  const { user, isLoading } = useUser();
  const { mutate } = useSWRConfig();

  const onFavClick = () => {
    if (!data) return;
    // bound Mutations의 첫 번째 인자는 변경하는 값 즉, 유저에게 화면UI의 변경사항을 보여주기 위한 부분이고 두 번째 인자는 변경이 일어난 후에 다시 API에서 데이터를 불러올지를 결정하는 부분이다.
    // 정리하자면 첫 번째 인자에는 가짜 데이터를 놓고 두 번째 인자가 true면 SWR이 다시 진짜 데이터를 찾아서 불러온다.
    boundMutate((prev) => prev && { ...data, isLiked: !data.isLiked }, false);
    // unbound Mutations는 다른 화면의 데이터를 변경하고 싶을 때 즉,  SWR 캐시의 데이터를 원하는 아무곳에서나 mutate 할 수 있다.
    // mutate("/api/users/me", { ok: false }, false); // key 값 뒤로 인자를 없이 mutate 하게 되면 refetch를 할 수 있게 된다.
    toggleFav({});
  };

  return (
    <Layout canGoBack>
      <div className="px-4  py-4">
        <div className="mb-8">
          <div className="h-96 bg-slate-300" />
          <div className="flex cursor-pointer items-center space-x-3 border-t border-b py-3">
            <div className="h-12 w-12 rounded-full bg-slate-300" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {data?.product?.user?.name}
              </p>
              <Link
                href={`/users/profiles/${data?.product?.user?.id}`}
                className="text-xs font-medium text-gray-500"
              >
                View profile &rarr;
              </Link>
            </div>
          </div>

          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {data ? data?.product?.name : "로딩중..."}
            </h1>
            <span className="mt-3 block text-2xl font-bold text-gray-900">
              {data ? `$${data?.product?.price}` : "로딩중..."}
            </span>
            <p className=" my-6 text-gray-700">
              {data ? data?.product?.description : "로딩중..."}
            </p>

            <div className="flex items-center justify-between space-x-2">
              <Button large text="Talk to seller" />
              <button
                onClick={onFavClick}
                className={cls(
                  "flex items-center justify-center rounded-md p-3 transition-colors hover:bg-gray-100",
                  data?.isLiked
                    ? "text-red-400 hover:text-gray-400"
                    : "text-gray-400 hover:text-red-400"
                )}
              >
                {data?.isLiked ? (
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="h-6 w-6"
                  >
                    <path
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {data?.relatedProducts?.map((product) => (
              <div key={product.id}>
                <Link href={`/products/${product.id}`}>
                  <div className="mb-4 h-56 w-full bg-slate-300" />
                  <h3 className="-mb-1 text-gray-700">{product.name}</h3>
                  <span className="text-sm font-bold text-gray-900">
                    ${product.price}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
