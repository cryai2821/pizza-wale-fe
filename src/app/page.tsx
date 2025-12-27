import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { MenuSection } from '@/components/menu/MenuSection';
import { getMenuServer } from '@/lib/fetch-menu';

export default async function Home() {
  const { categories, products } = await getMenuServer();

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop")'
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative container h-full flex flex-col justify-center px-4 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">Auntynoz Pizza</h1>
          <p className="text-lg md:text-xl opacity-90">Delicious Pizza, Delivered Fast.</p>
        </div>
      </div>

      <MenuSection initialCategories={categories} initialProducts={products} />
    </main>
  );
}
