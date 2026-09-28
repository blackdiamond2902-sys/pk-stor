import { useState } from 'react'
import { Heart, Search, ShoppingCart, Smartphone, UserRound } from 'lucide-react'
import { signInWithGoogle, auth } from './firebase'
import './App.css'

type Product = { 
  id: number; 
  name: string; 
  gender: 'Men' | 'Women'; 
  category: string; 
  price: number; 
  oldPrice?: number; 
  image: string; 
  badge?: string 
}

const products: Product[] = [
  // Mens Collection
  { id: 1, name: 'পুরুষদের কটন টি-শার্ট', gender: 'Men', category: 'টি-শার্ট', price: 790, oldPrice: 990, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', badge: 'বেস্টসেলার' },
  { id: 2, name: 'পুরুষদের ক্লাসিক পোলো', gender: 'Men', category: 'পোলো', price: 1190, image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80' },
  
  // Womens Collection
  { id: 3, name: 'নারীদের ক্যাজুয়াল টপস', gender: 'Women', category: 'টপস', price: 950, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80', badge: 'নতুন' },
  { id: 4, name: 'নারীদের ওভারসাইজড টি-শার্ট', gender: 'Women', category: 'টি-শার্ট', price: 890, oldPrice: 1090, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80' }
]

const money = (amount: number) => `৳${amount.toLocaleString('en-US')}`

export default function App() {
  const [selectedGender, setSelectedGender] = useState<'All' | 'Men' | 'Women'>('All')
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const shown = products.filter(product => {
    const matchesGender = selectedGender === 'All' || product.gender === selectedGender
    const matchesSearch = !normalizedSearch || `${product.name} ${product.category}`.toLowerCase().includes(normalizedSearch)
    return matchesGender && matchesSearch
  })

  const addToCart = () => setCartCount(count => count + 1)

  // গুগল লগইন চেক করার লজিক
  const buyNow = async (product: Product) => {
    try {
      if (!auth.currentUser) {
        const user = await signInWithGoogle()
        if (!user) return 
      }
      setCheckoutProduct(product)
    } catch (error) {
      console.error("Login Error:", error)
      alert("লগইন সফল হয়নি! আবার চেষ্টা করুন।")
    }
  }

  return (
    <div className="page-shell">
      <header className="site-header">
        <a href="/" className="text-logo" aria-label="PK Stor home">
          <span className="logo-monogram">PK</span>
          <span>Stor</span>
        </a>

        <form className="header-search" role="search" onSubmit={event => event.preventDefault()}>
          <label className="visually-hidden" htmlFor="store-search">Search products</label>
          <input
            id="store-search"
            type="search"
            placeholder="Search for fashion, styles and more"
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
          />
          <button type="submit"><Search size={17} /> Search</button>
        </form>

        <nav className="header-utilities" aria-label="Store links">
          <button className="utility-link" type="button" aria-label="Download App">
            <Smartphone size={19} /><span>Download App</span>
          </button>
          <button className="utility-link" type="button" aria-label="Wishlist">
            <Heart size={19} /><span>Wishlist</span>
          </button>
          <button className="utility-link cart-link" type="button" aria-label={`Cart, ${cartCount} items`}>
            <span className="cart-icon-wrap">
              <ShoppingCart size={20} />
              <span className="cart-count">{cartCount}</span>
            </span>
            <span>Cart</span>
          </button>
          <button className="utility-link" type="button" aria-label="Account">
            <UserRound size={19} /><span>Account</span>
          </button>
        </nav>
      </header>

      <section className="hero-section" aria-label="Featured fashion collection">
        <div className="hero-banner">
          <div className="hero-photo hero-photo-one">
            <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85" alt="Model wearing a contemporary fashion look" />
          </div>
          <div className="hero-photo hero-photo-two">
            <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85" alt="Model in a casual summer outfit" />
          </div>
          <div className="hero-photo hero-photo-three">
            <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85" alt="Model in an elegant seasonal outfit" />
          </div>
          <div className="hero-copy">
            <span className="hero-kicker">THE NEW SEASON</span>
            <h1>তোমার স্টাইল।<br />তোমার নিয়মে।</h1>
            <p>প্রতিদিনের ফ্যাশনে নিজের মতো করে সাজো।</p>
            <a className="hero-btn" href="#collection">Shop the collection <span aria-hidden="true">→</span></a>
          </div>
        </div>

        <div className="hero-category-bar">
          <div>
            <span>THIS SEASON'S EDIT</span>
            <h2>Women Fashion Wear</h2>
          </div>
          <a href="#collection">Explore styles <span aria-hidden="true">→</span></a>
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

      {/* Main Catalog Section */}
      <main id="collection">
        <section className="category-section">
          <div className="section-header">
            <span className="sub-title">— THE COLLECTION</span>
            <h2 className="section-title">পছন্দের বিভাগ বেছে নিন</h2>
          </div>

          <nav className="category-tabs" aria-label="Product categories">
            <button
              className={`tab-btn ${selectedGender === 'Women' ? 'active' : ''}`}
              onClick={() => setSelectedGender('Women')}
              type="button"
            >
              Women's Wear
            </button>
            <button
              className={`tab-btn ${selectedGender === 'Men' ? 'active' : ''}`}
              onClick={() => setSelectedGender('Men')}
              type="button"
            >
              Men's Wear
            </button>
            <button
              className={`tab-btn ${selectedGender === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedGender('All')}
              type="button"
            >
              All Items
            </button>
          </nav>

          <div className="product-grid">
          {shown.map(product => (
            <div key={product.id} className="product-card">
              <div className="card-media">
                <img src={product.image} alt={product.name} />
                {product.badge && <span className="tag-badge">{product.badge}</span>}
                {product.oldPrice && (
                  <span className="discount-tag">
                    {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
                  </span>
                )}
              </div>
              <div className="card-details">
                <h3>{product.name}</h3>
                <p className="price-tag">{money(product.price)} {product.oldPrice && <del>{money(product.oldPrice)}</del>}</p>
                <div className="btn-group">
                  <button type="button" className="btn-secondary add-to-cart-btn" onClick={addToCart}>
                    <ShoppingCart size={15} /> Add to Cart
                  </button>
                  <button type="button" className="btn-primary" onClick={() => buyNow(product)}>Buy now →</button>
                </div>
              </div>
            </div>
          ))}
          </div>
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