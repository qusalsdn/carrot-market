import type { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@components/floating-button";
import Layout from "@components/layout";
import { Stream } from "@prisma/client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Pagination from "@components/pagination";
import Image from "next/image";
import Loading from "@components/loading";

interface StreamsResponse {
  ok: boolean;
  streams: Stream[];
}

const Streams: NextPage = () => {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { data, isLoading } = useSWR<StreamsResponse>(`/api/streams?page=${page}`);

  useEffect(() => {
    if (router.query.page) {
      setPage(Number(router.query.page));
    }
  }, [page, router]);

  return (
    <Layout hasTabBar title="라이브" seoTitle="라이브 스트림 홈">
      {isLoading ? (
        <Loading />
      ) : (
        <div className=" space-y-4 divide-y-[1px]">
          {data?.streams?.map((stream) => (
            <Link
              key={stream.id}
              href={`/streams/${stream.id}`}
              className="block px-4  pt-4"
            >
              <div
                className="relative aspect-video w-full overflow-hidden rounded-md bg-slate-300
              shadow-sm"
              >
                <Image
                  src={`https://videodelivery.net/${stream.cloudflareId}/thumbnails/thumbnail.jpg?height=320`}
                  alt="thumbnail"
                  fill
                />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <h1 className="mr-3 text-2xl font-bold text-gray-900">{stream.name}</h1>
                {stream.completed && (
                  <h3 className="rounded-md bg-orange-400 px-2 py-1 text-sm font-bold text-white">
                    스트리밍 종료됨
                  </h3>
                )}
              </div>
            </Link>
          ))}

          <FloatingButton href="/streams/create">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              ></path>
            </svg>
          </FloatingButton>
          <Pagination page={page} countProduct={data?.streams?.length} />
        </div>
      )}
    </Layout>
  );
};

export default Streams;
