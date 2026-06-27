import { listAllProducts } from '@/lib/sanity/products'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ProductGrid } from '@/components/shop/ProductGrid'

export default async function CollectionsPage() {
  const products = await listAllProducts()

  return (
    <div>
      <Navbar />

      <section className="section">
        <div className="container">
          <div className="s-head">
            <div>
              <span className="eyebrow">Meet the frames.</span>
              <h2>
                Every model, <em>made for play.</em>
              </h2>
            </div>
            <p>
              Pick a favourite. Each frame comes in its own set of bright, bend-proof
              colours, built to survive real childhoods.
            </p>
          </div>

          <ProductGrid products={products} />
        </div>
      </section>

      <Footer />
    </div>
  )
}
