import Link from "next/link";
import { products } from "@/src/products";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center my-16 space-y-2 ">
          <h1 className="text-5xl sm:text-7xl font-styled mb-2">
            neme's world
          </h1>
          {/* <p className="text-5xl font-secondary tracking-wide">ニャー</p> */}
        </div>
        <div className="py-4 px-6 grid gap-4 bg-red-100">
          <h5 className="text-center mb-4">my recommendations</h5>
          <div className="space-y-4 grid max-sm:grid-cols-1 grid-cols-2 gap-8 mb-16">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col bg-white backdrop-blur-sm p-4 h-75 border border-foreground  transition-all group"
              >
                <div className="flex flex-col h-full items-center justify-between gap-4">
                  <div className="text-left w-full flex flex-col">
                    <h2 className="text-lg font-semibold font-secondary text-gray-800 mb-1">
                      {product.name}
                    </h2>
                    <span className="text-sm text-pink-500">
                      {product.price}
                    </span>
                  </div>

                  <Link
                    href={`/go/${product.id}`}
                    target="_blank"
                    rel="nofollow noopener"
                    className="px-6 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-secondary hover:bg-pink-200 transition-colors whitespace-nowrap"
                  >
                    shop ♡
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Footer */}
        {/* <footer className="text-center text-xs  font-secondary">
          As an Amazon Associate, I earn from qualifying purchases
        </footer> */}
      </div>
    </main>
  );
}
