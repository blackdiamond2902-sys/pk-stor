import { useState } from 'react'
import { signInWithGoogle, auth } from './firebase'

type Product = { id: number; name: string; category: string; price: number; oldPrice?: number; image: string; badge?: string }
type CartLine = { productId: number; size: string; quantity: number }
type IconName = 'search' | 'bag' | 'heart' | 'arrow' | 'close' | 'plus' | 'minus'

const products: Product[] = [
  { id: 1, name: 'এভরিডে কটন টি-শার্ট', category: 'টি-শার্ট', price: 790, oldPrice: 990, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', badge: 'বেস্টসেলার' },
  { id: 2, name: 'গ্রাফিক স্টেটমেন্ট টি', category: 'টি-শার্ট', price: 950, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80', badge: 'নতুন' },
  { id: 3, name: 'ওভারসাইজড এসেনশিয়াল টি', category: 'টি-শার্ট', price: 890, oldPrice: 1090, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'সফট-টাচ ক্লাসিক পোলো', category: 'টি-শার্ট', price: 1190, image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: 'লিনেন ডেইলি ওভারশার্ট', category: 'শার্ট', price: 1490, oldPrice: 1790, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80' },
  { id: 6, name: 'রিল্যাক্সড ফিট অক্সফোর্ড', category: 'শার্ট', price: 1390, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80' },
  { id: 7, name: 'উইকেন্ড ফ্লিস হুডি', category: 'হুডি', price: 1890, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80' },
  { id: 8, name: 'কোর ক্রু-নেক সোয়েটশার্ট', category: 'হুডি', price: 1690, oldPrice: 1990, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80' }
]

const categories = ['সব পণ্য', 'টি-শার্ট', 'শার্ট', 'হুডি']
const money = (amount: number) => `৳${amount.toLocaleString('en-US')}`

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 }
  if (name === 'search') return <svg {...props}><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></svg>
  if (name === 'bag') return <svg {...props}><path d="M5 8h14l1 12H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>
  if (name === 'heart') return <svg {...props}><path d="M20.4 8.7c0 4.2-8.4 10-8.4 10s-8.4-5.8-8.4-10a4.4 4.4 0 0 1 8.4-2.1 4.4 4.4 0 0 1 8.4 2.1Z" /></svg>
  if (name === 'arrow') return <svg {...props}><path d="M4.5 12h14m-5.5-5.5 5.5 5.5-5.5 5.5" /></svg>
  if (name === 'close') return <svg {...props}><path d="M18 6 6 18M6 6l12 12" /></svg>
  if (name === 'plus') return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>
  return <svg {...props}><path d="M5 12h14" /></svg>
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('সব পণ্য')
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({})
  const [cart, setCart] = useState<CartLine[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null)

  const shown = products.filter(p => selectedCategory === 'সব পণ্য' || p.category === selectedCategory)

  const buyNow = async (product: Product) => {
    if (!auth.currentUser) {
      alert("অর্ডার করতে আগে Google দিয়ে লগইন করুন!")
      const user = await signInWithGoogle()
      if (!user) return
    }
    setCheckoutProduct(product)
  }

  const addToCart = (productId: number) => {
    const size = selectedSizes[productId] || 'M'
    setCart(prev => {
      const idx = prev.findIndex(item => item.productId === productId && item.size === size)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 }
        return next
      }
      return [...prev, { productId, size, quantity: 1 }]
    })
    setIsDrawerOpen(true)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <h1>ভালো ফিট, ভালো দিন।</h1>
        </div>
        <button className="cart-trigger" onClick={() => setIsDrawerOpen(true)}>
          <Icon name="bag" />
          <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </button>
      </header>

      <main className="catalog">
        <nav className="cats">
          {categories.map(c => (
            <button key={c} className={c === selectedCategory ? 'active' : ''} onClick={() => setSelectedCategory(c)}>
              {c}
            </button>
          ))}
        </nav>

        <div className="grid">
          {shown.map(product => (
            <div key={product.id} className="card">
              <div className="img-wrap">
                <img src={product.image} alt={product.name} />
                {product.badge && <span className="badge">{product.badge}</span>}
              </div>
                <h3>{product.name}</h3>
                <p className="price">{money(product.price)} {product.oldPrice && <del>{money(product.oldPrice)}</del>}</p>
                <div className="actions">
                  <button type="button" onClick={() => addToCart(product.id)}>কার্টে যোগ</button>
                  <button type="button" className="buy-button" onClick={() => buyNow(product)}>Buy now →</button>
                </div>
            </div>
          ))}
        </div>
      </main>

      {checkoutProduct && (
        <div className="modal-overlay" onClick={() => setCheckoutProduct(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>অর্ডারের তথ্য</h2>
            <p>{checkoutProduct.name} - {money(checkoutProduct.price)}</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('অর্ডার সফল হয়েছে!'); setCheckoutProduct(null); }}>
              <input type="text" placeholder="আপনার নাম" required />
              <input type="text" placeholder="ফোন নম্বর" required />
              <textarea placeholder="ডেলিভারি ঠিকানা" required></textarea>
              <button type="submit" className="buy-button">অর্ডার নিশ্চিত করুন</button>
            </form>
            <button className="close-btn" onClick={() => setCheckoutProduct(null)}>
              <Icon name="close" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}