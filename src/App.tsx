import { useState } from 'react'
import { signInWithGoogle, auth } from './firebase'
import './App.css'

type Product = { id: number; name: string; category: string; price: number; oldPrice?: number; image: string; badge?: string }

const products: Product[] = [
  { id: 1, name: 'এভরিডে কটন টি-শার্ট', category: 'টি-শার্ট', price: 790, oldPrice: 990, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', badge: 'বেস্টসেলার' },
  { id: 2, name: 'গ্রাফিক স্টেটমেন্ট টি', category: 'টি-শার্ট', price: 950, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80', badge: 'নতুন' },
  { id: 3, name: 'ওভারসাইজড এসেনশিয়াল টি', category: 'টি-শার্ট', price: 890, oldPrice: 1090, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'সফট-টাচ ক্লাসিক পোলো', category: 'টি-শার্ট', price: 1190, image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80' }
]

const categories = ['সব পণ্য', 'টি-শার্ট', 'শার্ট', 'হুডি']
const money = (amount: number) => `৳${amount.toLocaleString('en-US')}`

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('সব পণ্য')
  const [cartCount, setCartCount] = useState(0)
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null)

  const shown = products.filter(p => selectedCategory === 'সব পণ্য' || p.category === selectedCategory)

  const buyNow = async (product: Product) => {
    if (!auth.currentUser) {
      const user = await signInWithGoogle()
      if (!user) return
    }
    setCheckoutProduct(product)
  }

  return (
    <div className="page-shell">
      {/* Hero Header Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>তোমার স্টাইল।<br/>তোমার নিয়মে।</h1>
          <p>প্রতিদিনের জন্য আরামদায়ক, নিজের মতো পোশাক। পছন্দের ফিট খুঁজে নাও PK STOR-এ।</p>
          <button className="hero-btn">কলেকশন ঘুরে দেখো →</button>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80" alt="Hero" />
        </div>
      </section>

      {/* Features Strip */}
      <div className="features-strip">
        <div className="feature-item">
          <h4>01 আরামদায়ক কাপড়</h4>
          <p>প্রতিদিনের ব্যবহারের জন্য উপযোগী</p>
        </div>
        <div className="feature-item">
          <h4>02 সহজ রিফান্ড পলিসি</h4>
          <p>রিটানের দুশ্চিন্তা ছাড়া কেনাকাটা</p>
        </div>
        <div className="feature-item">
          <h4>03 ক্যাশ অন ডেলিভারি</h4>
          <p>পণ্য হাতে পেয়ে পেমেন্ট</p>
        </div>
      </div>

      {/* Catalog Section */}
      <main>
        <div className="section-header">
          <span className="sub-title">— THE EVERYDAY EDIT</span>
          <h2 className="section-title">ভালো ফিট, ভালো দিন।</h2>
        </div>

        <nav className="category-tabs">
          {categories.map(c => (
            <button key={c} className={`tab-item ${c === selectedCategory ? 'active' : ''}`} onClick={() => setSelectedCategory(c)}>
              {c}
            </button>
          ))}
        </nav>

        <section className="product-grid">
          {shown.map(product => (
            <div key={product.id} className="product-card">
              <div className="card-media">
                <img src={product.image} alt={product.name} />
                {product.badge && <span className="tag-badge">{product.badge}</span>}
              </div>
              <div className="card-details">
                <h3>{product.name}</h3>
                <p className="price-tag">{money(product.price)} {product.oldPrice && <del>{money(product.oldPrice)}</del>}</p>
                <div className="btn-group">
                  <button type="button" className="btn-secondary" onClick={() => setCartCount(c => c + 1)}>কার্টে যোগ</button>
                  <button type="button" className="btn-primary" onClick={() => buyNow(product)}>Buy now →</button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Checkout Modal */}
      {checkoutProduct && (
        <div className="modal-backdrop" onClick={() => setCheckoutProduct(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2>অর্ডারের তথ্য</h2>
            <p>{checkoutProduct.name} - {money(checkoutProduct.price)}</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('অর্ডার সফল হয়েছে!'); setCheckoutProduct(null); }}>
              <input type="text" placeholder="আপনার নাম" required />
              <input type="text" placeholder="ফোন নম্বর" required />
              <textarea placeholder="ডেলিভারি ঠিকানা" required></textarea>
              <button type="submit" className="btn-primary">অর্ডার নিশ্চিত করুন</button>
            </form>
            <button type="button" className="close-icon" onClick={() => setCheckoutProduct(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  )
}