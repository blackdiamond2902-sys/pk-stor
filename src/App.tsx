import { useState } from 'react'

type Product = { id: number; name: string; category: string; price: number; oldPrice?: number; image: string; badge?: string; sizes: string[] }
type CartLine = { productId: number; size: string; quantity: number }
type IconName = 'search' | 'bag' | 'heart' | 'arrow' | 'close' | 'plus' | 'minus'

const products: Product[] = [
  { id: 1, name: 'এভরিডে কটন টি-শার্ট', category: 'টি-শার্ট', price: 790, oldPrice: 990, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85', badge: 'বেস্টসেলার', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 2, name: 'গ্রাফিক স্টেটমেন্ট টি', category: 'টি-শার্ট', price: 950, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=85', badge: 'নতুন', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 3, name: 'ওভারসাইজড এসেনশিয়াল টি', category: 'টি-শার্ট', price: 890, oldPrice: 1090, image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=85', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 4, name: 'সফট-টাচ ক্লাসিক পোলো', category: 'টি-শার্ট', price: 1190, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=85', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 5, name: 'লিনেন ডেইলি ওভারশার্ট', category: 'শার্ট', price: 1490, oldPrice: 1790, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85', badge: 'লিমিটেড', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 6, name: 'রিল্যাক্সড ফিট অক্সফোর্ড', category: 'শার্ট', price: 1390, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 7, name: 'উইকেন্ড ফ্লিস হুডি', category: 'হুডি', price: 1890, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85', badge: 'নতুন', sizes: ['M', 'L', 'XL', 'XXL'] },
  { id: 8, name: 'কোর ক্রু-নেক সোয়েটশার্ট', category: 'হুডি', price: 1690, oldPrice: 1990, image: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=900&q=85', sizes: ['S', 'M', 'L', 'XL'] },
]
const categories = ['সব পণ্য', 'টি-শার্ট', 'শার্ট', 'হুডি']
const money = (amount: number) => `৳${amount.toLocaleString('en-US')}`

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  if (name === 'search') return <svg {...props}><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></svg>
  if (name === 'bag') return <svg {...props}><path d="M5 8h14l1 12H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>
  if (name === 'heart') return <svg {...props}><path d="M20.4 8.7c0 4.2-8.4 10-8.4 10s-8.4-5.8-8.4-10a4.4 4.4 0 0 1 8.4-1.8 4.4 4.4 0 0 1 8.4 1.8Z" /></svg>
  if (name === 'arrow') return <svg {...props}><path d="M4.5 12h14m-5.5-5.5 5.5 5.5-5.5 5.5" /></svg>
  if (name === 'close') return <svg {...props}><path d="m18 6-12 12M6 6l12 12" /></svg>
  if (name === 'plus') return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>
  return <svg {...props}><path d="M5 12h14" /></svg>
}

function App() {
  const [category, setCategory] = useState('সব পণ্য')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartLine[]>([])
  const [sizes, setSizes] = useState<Record<number, string>>({})
  const [favorites, setFavorites] = useState<number[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutLines, setCheckoutLines] = useState<CartLine[] | null>(null)
  const [orderReview, setOrderReview] = useState(false)
  const shown = products.filter((item) => (category === 'সব পণ্য' || item.category === category) && `${item.name} ${item.category}`.toLowerCase().includes(search.trim().toLowerCase()))
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0)
  const orderTotal = (checkoutLines ?? []).reduce((sum, line) => sum + (products.find((item) => item.id === line.productId)?.price ?? 0) * line.quantity, 0)
  const selectedSize = (product: Product) => sizes[product.id] ?? product.sizes[1] ?? product.sizes[0]

  function addToCart(product: Product) {
    const size = selectedSize(product)
    setCart((current) => {
      const existing = current.find((line) => line.productId === product.id && line.size === size)
      return existing ? current.map((line) => line === existing ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { productId: product.id, size, quantity: 1 }]
    })
    setCartOpen(true)
  }
  function changeQuantity(productId: number, size: string, delta: number) {
    setCart((current) => current.map((line) => line.productId === productId && line.size === size ? { ...line, quantity: line.quantity + delta } : line).filter((line) => line.quantity > 0))
  }
  function buyNow(product: Product) { setCheckoutLines([{ productId: product.id, size: selectedSize(product), quantity: 1 }]); setOrderReview(false) }
  function toggleFavorite(id: number) { setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]) }
  function closeCheckout() { setCheckoutLines(null); setOrderReview(false) }

  return <div className="store">
    <style>{styles}</style>
    <div className="announcement"><span>নতুন সিজন, নতুন ফিট</span><i /><span>৳২,০০০+ অর্ডারে ডেলিভারি ফ্রি</span><a href="#shop">কালেকশন দেখুন <Icon name="arrow" size={13} /></a></div>
    <header className="header">
      <a className="brand" href="#home" aria-label="PK STOR হোম"><span className="brand-name">PK<span>.</span>STOR</span><span className="brand-caption">WEAR YOUR EVERYDAY</span></a>
      <nav className="navigation" aria-label="প্রধান নেভিগেশন"><a className="nav-active" href="#shop">শপ</a><a href="#shop" onClick={() => setCategory('টি-শার্ট')}>টি-শার্ট</a><a href="#shop" onClick={() => setCategory('শার্ট')}>শার্ট</a><a href="#shop" onClick={() => setCategory('হুডি')}>হুডি</a></nav>
      <div className="header-actions"><label className="search-box"><Icon name="search" size={17} /><input aria-label="পণ্য খুঁজুন" placeholder="খুঁজুন" value={search} onChange={(event) => setSearch(event.target.value)} /></label><button className="favorite-shortcut" type="button" aria-label={`পছন্দের তালিকা, ${favorites.length}টি পণ্য`} onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}><Icon name="heart" />{favorites.length > 0 && <span className="favorite-count">{favorites.length}</span>}</button><button className="bag-button" type="button" aria-label={`কার্ট, ${cartCount}টি পণ্য`} onClick={() => setCartOpen(true)}><Icon name="bag" /><span>কার্ট</span><span className="bag-count">{cartCount}</span></button></div>
    </header>
    <main id="home">
      <section className="hero"><div className="hero-copy"><span className="eyebrow"><i /> নতুন কালেকশন · ২০২৬</span><h1>তোমার স্টাইল।<br /><span>তোমার নিয়মে।</span></h1><p>প্রতিদিনের জন্য আরামদায়ক, নিজের মতো পোশাক। পছন্দের ফিট খুঁজে নাও PK STOR-এ।</p><a className="hero-button" href="#shop">কালেকশন ঘুরে দেখো <Icon name="arrow" size={17} /></a><div className="hero-note"><span>01</span> ঢাকায় তৈরি, সবার জন্য</div></div><div className="hero-photo"><img src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1400&q=90" alt="PK STOR-এর নতুন টি-শার্ট কালেকশন" /><span className="photo-label">THE DAILY UNIFORM <b>№ 06</b></span><div className="hero-sticker">MADE TO<br />MOVE <span>↗</span></div></div><div className="hero-vertical">PK STOR / DHAKA</div></section>
      <section className="benefits" aria-label="কেনাকাটার সুবিধা"><div><span>01</span><p><b>আরামদায়ক কাপড়</b><small>প্রতিদিনের ব্যবহারে যত্নে বাছাই</small></p></div><div><span>02</span><p><b>সহজ সাইজ এক্সচেঞ্জ</b><small>ফিট ঠিক না হলে আমরা আছি</small></p></div><div><span>03</span><p><b>ক্যাশ অন ডেলিভারি</b><small>পণ্য হাতে পেয়ে পেমেন্ট</small></p></div></section>
      <section className="catalog" id="shop"><div className="catalog-heading"><div><span className="eyebrow"><i /> THE EVERYDAY EDIT</span><h2>ভালো ফিট, <span>ভালো দিন।</span></h2></div><p>টি-শার্ট থেকে লেয়ারিং পিস,<br />তোমার প্রতিদিনের ওয়ারড্রোব।</p></div>
        <div className="catalog-tools"><div className="category-tabs" role="group" aria-label="পণ্যের ধরন">{categories.map((item) => <button type="button" key={item} className={category === item ? 'category-tab active' : 'category-tab'} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}{item === 'সব পণ্য' && <small>{products.length}</small>}</button>)}</div><span className="result-count">{shown.length}টি পণ্য</span></div>
        {shown.length ? <div className="product-grid">{shown.map((product, index) => <article className="product-card" key={product.id} style={{ animationDelay: `${index * 45}ms` }}><div className="product-image"><img src={product.image} alt={product.name} loading="lazy" />{product.badge && <span className="product-badge">{product.badge}</span>}<button className={favorites.includes(product.id) ? 'heart-button selected' : 'heart-button'} type="button" aria-label={favorites.includes(product.id) ? 'পছন্দের তালিকা থেকে সরান' : 'পছন্দের তালিকায় রাখুন'} aria-pressed={favorites.includes(product.id)} onClick={() => toggleFavorite(product.id)}><Icon name="heart" size={18} /></button></div><div className="product-info"><div className="product-meta"><span>{product.category}</span><span className="rating">★ <b>৪.৮</b></span></div><h3>{product.name}</h3><div className="price-row"><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}</div><div className="size-row"><label htmlFor={`size-${product.id}`}>সাইজ</label><select id={`size-${product.id}`} value={selectedSize(product)} onChange={(event) => setSizes((current) => ({ ...current, [product.id]: event.target.value }))}>{product.sizes.map((size) => <option key={size}>{size}</option>)}</select><span>Size guide</span></div><div className="product-actions"><button className="add-button" type="button" onClick={() => addToCart(product)}><Icon name="plus" size={14} /> কার্টে যোগ</button><button className="buy-button" type="button" onClick={() => buyNow(product)}>Buy now <Icon name="arrow" size={13} /></button></div></div></article>)}</div> : <div className="empty-results"><strong>এই নামে কোনো পণ্য নেই</strong><p>অন্যভাবে খুঁজে দেখুন অথবা সব পণ্য বেছে নিন।</p><button type="button" onClick={() => { setSearch(''); setCategory('সব পণ্য') }}>সব পণ্য দেখুন</button></div>}
        <div className="catalog-footer"><span>নিজের মতো করে পরো। প্রতিদিন।</span><span>PK STOR <i>·</i> DHAKA, BD</span></div>
      </section>
    </main>
    <footer className="footer"><a className="brand" href="#home"><span className="brand-name">PK<span>.</span>STOR</span><span className="brand-caption">WEAR YOUR EVERYDAY</span></a><p>প্রতিদিনের পোশাক, তোমার নিজস্ব স্টাইলে।</p><a href="mailto:hello@pkstor.com">সাহায্য লাগবে? <b>hello@pkstor.com</b></a></footer>

    {cartOpen && <div className="overlay" onClick={() => setCartOpen(false)}><aside className="drawer" role="dialog" aria-modal="true" aria-label="আপনার শপিং কার্ট" onClick={(event) => event.stopPropagation()}><div className="drawer-heading"><div><span className="eyebrow"><i /> YOUR PICKS</span><h2>তোমার কার্ট <small>({cartCount})</small></h2></div><button className="close-button" type="button" aria-label="কার্ট বন্ধ করুন" onClick={() => setCartOpen(false)}><Icon name="close" /></button></div>{cart.length ? <><div className="drawer-items">{cart.map((line) => { const product = products.find((item) => item.id === line.productId); if (!product) return null; return <div className="drawer-item" key={`${line.productId}-${line.size}`}><img src={product.image} alt="" /><div className="drawer-item-info"><span>{product.category} · সাইজ {line.size}</span><strong>{product.name}</strong><b>{money(product.price * line.quantity)}</b><div className="quantity-control"><button type="button" aria-label="পরিমাণ কমান" onClick={() => changeQuantity(product.id, line.size, -1)}><Icon name="minus" size={13} /></button><span>{line.quantity}</span><button type="button" aria-label="পরিমাণ বাড়ান" onClick={() => changeQuantity(product.id, line.size, 1)}><Icon name="plus" size={13} /></button></div></div><button className="remove-line" type="button" onClick={() => changeQuantity(product.id, line.size, -line.quantity)}>সরান</button></div>})}</div><div className="drawer-bottom"><div className="subtotal"><span>সাবটোটাল</span><strong>{money(cart.reduce((sum, line) => sum + (products.find((item) => item.id === line.productId)?.price ?? 0) * line.quantity, 0))}</strong></div><p>ডেলিভারি চার্জ পরবর্তী ধাপে যোগ হবে।</p><button className="checkout-button" type="button" onClick={() => { setCheckoutLines([...cart]); setCartOpen(false); setOrderReview(false) }}>চেকআউটে এগিয়ে যান <Icon name="arrow" size={17} /></button></div></> : <div className="empty-cart"><div className="empty-bag"><Icon name="bag" size={25} /></div><h3>কার্ট এখনো খালি</h3><p>পছন্দের পোশাক বেছে নিয়ে এখানে যোগ করো।</p><button className="hero-button" type="button" onClick={() => { setCartOpen(false); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }) }}>শপিং শুরু করো <Icon name="arrow" size={16} /></button></div>}</aside></div>}

    {checkoutLines && <div className="overlay checkout-overlay" onClick={closeCheckout}><section className="checkout-dialog" role="dialog" aria-modal="true" aria-labelledby="checkout-title" onClick={(event) => event.stopPropagation()}><div className="drawer-heading"><div><span className="eyebrow"><i /> ALMOST YOURS</span><h2 id="checkout-title">অর্ডারের তথ্য</h2></div><button className="close-button" type="button" aria-label="চেকআউট বন্ধ করুন" onClick={closeCheckout}><Icon name="close" /></button></div>{orderReview ? <div className="checkout-message"><div className="checkout-check">✓</div><h3>তোমার অর্ডার প্রস্তুত</h3><p>চেকআউট ও পেমেন্ট নিশ্চিত করতে স্টোরের অর্ডার সার্ভিস সংযুক্ত করতে হবে।</p><button className="checkout-button" type="button" onClick={closeCheckout}>শপিংয়ে ফিরে যাও</button></div> : <form className="checkout-form" onSubmit={(event) => { event.preventDefault(); setOrderReview(true) }}><div className="checkout-summary"><span>{checkoutLines.reduce((sum, line) => sum + line.quantity, 0)}টি পণ্য</span><strong>{money(orderTotal)}</strong></div><label>তোমার নাম<input required name="name" autoComplete="name" placeholder="সম্পূর্ণ নাম" /></label><label>ফোন নম্বর<input required name="phone" type="tel" autoComplete="tel" placeholder="01XXXXXXXXX" pattern="[0-9]{8,16}" /></label><label>ডেলিভারি ঠিকানা<textarea required name="address" autoComplete="street-address" placeholder="বাসা, রাস্তা, এলাকা, শহর" /></label><button className="checkout-button" type="submit">অর্ডার রিভিউ করুন <Icon name="arrow" size={17} /></button><p className="checkout-disclaimer">এটি checkout preview। অর্ডার নিশ্চিত করতে backend/payment service প্রয়োজন।</p></form>}</section></div>}
  </div>
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap');
  #root { width: 100% !important; max-width: none !important; min-height: 100svh; margin: 0 !important; border: 0 !important; display: block !important; text-align: left !important; }
  :root { color-scheme: light !important; font-family: 'Noto Sans Bengali', 'DM Sans', sans-serif; background: #fafaf7 !important; color: #242822 !important; letter-spacing: 0 !important; }
  body { min-width: 320px; margin: 0; background: #fafaf7 !important; }
  .store { --ink: #242822; --line: #e6e7e1; --forest: #345541; --lime: #d8ed68; --rust: #c8593d; min-height: 100vh; background: #fafaf7; color: var(--ink); font: 14px/1.55 'Noto Sans Bengali', 'DM Sans', sans-serif; }
  .store * { box-sizing: border-box; }
  .store button, .store input, .store select, .store textarea { font: inherit; }
  .announcement { min-height: 33px; padding: 4px 24px; display: flex; align-items: center; justify-content: center; gap: 9px; background: #2e4938; color: #f1f2ea; font-size: 9px; }
  .announcement > i { width: 3px; height: 3px; border-radius: 50%; background: var(--lime); }
  .announcement a { margin-left: 19px; display: inline-flex; align-items: center; gap: 5px; color: var(--lime); text-decoration: none; }
  .header { height: 76px; padding: 0 max(5.4vw, 24px); display: grid; grid-template-columns: 1fr 1.2fr 1fr; align-items: center; border-bottom: 1px solid var(--line); background: #fafaf7; }
  .brand { width: fit-content; display: flex; flex-direction: column; color: var(--ink); text-decoration: none; }
  .brand-name { font: 700 24px/1 'DM Sans', sans-serif; }
  .brand-name > span { color: var(--rust); }
  .brand-caption { margin-top: 4px; color: #858a80; font: 600 7px/1 'DM Sans', sans-serif; letter-spacing: .9px; }
  .navigation { height: 100%; display: flex; align-items: center; justify-content: center; gap: 28px; }
  .navigation a { height: 100%; position: relative; display: inline-flex; align-items: center; color: #73796f; font-size: 10px; text-decoration: none; }
  .navigation a:hover, .navigation a.nav-active { color: var(--ink); }
  .navigation a.nav-active::after { content: ''; position: absolute; right: 0; bottom: 0; left: 0; height: 2px; background: var(--rust); }
  .header-actions { display: flex; align-items: center; justify-content: flex-end; gap: 15px; }
  .search-box { display: flex; align-items: center; gap: 6px; color: #586158; }
  .search-box input { width: 92px; padding: 7px 0; border: 0; outline: 0; background: transparent; color: var(--ink); font-size: 9px; }
  .search-box input::placeholder { color: #858a81; }
  .favorite-shortcut, .bag-button { position: relative; border: 0; padding: 5px; display: inline-flex; align-items: center; justify-content: center; gap: 5px; background: transparent; color: var(--ink); cursor: pointer; font-size: 9px; }
  .favorite-count { position: absolute; top: -2px; right: 0; min-width: 13px; height: 13px; border-radius: 50%; display: grid; place-items: center; background: var(--rust); color: white; font: 8px 'DM Sans', sans-serif; }
  .bag-count { width: 19px; height: 19px; border-radius: 50%; display: grid; place-items: center; background: #e9ece4; font: 9px 'DM Sans', sans-serif; }
  .hero { min-height: 449px; position: relative; padding: 45px max(8vw, 38px); display: grid; grid-template-columns: .88fr 1.12fr; align-items: center; gap: 5%; background: #eef0e8; }
  .hero-copy { position: relative; z-index: 1; animation: rise-in .55s ease both; }
  .eyebrow { display: inline-flex; align-items: center; gap: 8px; color: var(--forest); font-size: 9px; font-weight: 600; }
  .eyebrow i { width: 20px; height: 1px; background: var(--rust); }
  .hero h1 { margin: 19px 0 13px; color: #252a24; font-size: clamp(42px, 5vw, 62px); line-height: 1.25; font-weight: 600; letter-spacing: 0; }
  .hero h1 span { color: var(--forest); }
  .hero-copy > p { max-width: 350px; margin: 0 0 21px; color: #6e756a; font-size: 11px; line-height: 1.9; }
  .hero-button { min-height: 42px; width: fit-content; padding: 0 16px; border: 0; display: inline-flex; align-items: center; justify-content: center; gap: 16px; background: var(--forest); color: white; text-decoration: none; font-size: 9px; font-weight: 600; cursor: pointer; transition: background .2s, transform .2s; }
  .hero-button:hover, .checkout-button:hover { background: #243e2e; transform: translateY(-1px); }
  .hero-note { margin-top: 22px; display: flex; align-items: center; gap: 9px; color: #778074; font-size: 8px; }
  .hero-note span { color: var(--rust); font: 10px 'DM Sans', sans-serif; }
  .hero-photo { height: 345px; position: relative; min-width: 0; animation: rise-in .65s .08s ease both; }
  .hero-photo > img { width: 100%; height: 100%; display: block; object-fit: cover; object-position: center 38%; }
  .photo-label { position: absolute; right: 10px; bottom: 10px; left: 10px; padding: 8px 10px; display: flex; justify-content: space-between; background: #f9f9f4e8; color: #4d584c; font: 8px 'DM Sans', sans-serif; letter-spacing: .6px; }
  .photo-label b { color: #8a8f85; font-weight: 400; }
  .hero-sticker { width: 84px; height: 84px; position: absolute; left: -19px; top: 24px; display: grid; place-content: center; background: var(--lime); color: #344833; font: 600 9px/1.55 'DM Sans', sans-serif; transform: rotate(-7deg); }
  .hero-sticker span { font-size: 15px; }
  .hero-vertical { position: absolute; top: 50%; right: 16px; color: #899084; font: 7px 'DM Sans', sans-serif; letter-spacing: 1.4px; writing-mode: vertical-rl; transform: translateY(-50%); }
  .benefits { min-height: 82px; padding: 13px max(8vw, 38px); display: grid; grid-template-columns: repeat(3, 1fr); align-items: center; border-bottom: 1px solid var(--line); }
  .benefits > div { min-height: 41px; padding: 0 15px; border-right: 1px solid var(--line); display: flex; align-items: center; justify-content: center; gap: 10px; }
  .benefits > div:first-child { padding-left: 0; justify-content: flex-start; }
  .benefits > div:last-child { padding-right: 0; border: 0; justify-content: flex-end; }
  .benefits > div > span { color: var(--rust); font: 9px 'DM Sans', sans-serif; }
  .benefits p { margin: 0; }
  .benefits b, .benefits small { display: block; }
  .benefits b { font-size: 9px; font-weight: 600; }
  .benefits small { margin-top: 2px; color: #848a80; font-size: 8px; }
  .catalog { padding: 59px max(8vw, 38px) 34px; scroll-margin-top: 14px; }
  .catalog-heading { margin-bottom: 24px; display: flex; align-items: flex-end; justify-content: space-between; gap: 15px; }
  .catalog-heading h2 { margin: 8px 0 0; color: #252a24; font-size: 29px; font-weight: 600; line-height: 1.4; letter-spacing: 0; }
  .catalog-heading h2 span { color: var(--forest); }
  .catalog-heading > p { margin: 0 0 2px; color: #81867d; font-size: 9px; line-height: 1.8; text-align: right; }
  .catalog-tools { min-height: 43px; margin-bottom: 16px; border-block: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between; }
  .category-tabs { height: 100%; display: flex; align-items: center; gap: 23px; overflow-x: auto; scrollbar-width: none; }
  .category-tabs::-webkit-scrollbar { display: none; }
  .category-tab { min-height: 42px; padding: 0; border: 0; position: relative; flex: 0 0 auto; display: inline-flex; align-items: center; gap: 6px; background: transparent; color: #858980; font-size: 9px; white-space: nowrap; cursor: pointer; }
  .category-tab.active { color: var(--ink); font-weight: 600; }
  .category-tab.active::after { content: ''; position: absolute; right: 0; bottom: -1px; left: 0; height: 2px; background: var(--rust); }
  .category-tab small { color: #8c9188; font: 8px 'DM Sans', sans-serif; }
  .result-count { color: #858a81; font-size: 9px; }
  .product-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 27px 16px; }
  .product-card { min-width: 0; animation: rise-in .42s ease both; }
  .product-image { aspect-ratio: .83; position: relative; overflow: hidden; background: #e8e8df; }
  .product-image > img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform .45s; }
  .product-card:hover .product-image > img { transform: scale(1.035); }
  .product-badge { position: absolute; top: 9px; left: 9px; padding: 4px 7px; background: #fafaf2ed; color: #4c604c; font-size: 8px; }
  .heart-button { width: 31px; height: 31px; position: absolute; top: 8px; right: 8px; border: 0; border-radius: 50%; display: grid; place-items: center; background: #fafaf2ed; color: #414b40; cursor: pointer; }
  .heart-button.selected { background: var(--rust); color: #fff; }
  .heart-button.selected svg { fill: currentColor; }
  .product-info { padding: 11px 1px 0; }
  .product-meta { display: flex; justify-content: space-between; color: #888d84; font-size: 8px; }
  .rating { color: #ae773b; font: 10px 'DM Sans', sans-serif; }
  .rating b { color: #777d73; font: 8px 'Noto Sans Bengali', sans-serif; }
  .product-info h3 { min-height: 23px; margin: 5px 0 4px; overflow: hidden; color: #30362f; font-size: 10px; line-height: 1.7; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; }
  .price-row { min-height: 20px; display: flex; align-items: baseline; gap: 8px; }
  .price-row strong { color: #28372b; font: 600 12px 'Noto Sans Bengali', sans-serif; }
  .price-row del { color: #a2a69e; font: 9px 'Noto Sans Bengali', sans-serif; }
  .size-row { margin-top: 8px; display: flex; align-items: center; gap: 7px; color: #727970; font-size: 8px; }
  .size-row label { color: #90958c; }
  .size-row select { width: 47px; height: 24px; padding: 0 4px; border: 1px solid #e0e4dc; outline: 0; background: #fff; color: #424a41; font-size: 8px; }
  .size-row select:focus { border-color: #819982; }
  .size-row > span { margin-left: auto; color: #848a80; text-decoration: underline; text-underline-offset: 2px; }
  .product-actions { margin-top: 9px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .product-actions button { min-height: 32px; padding: 0 6px; border: 1px solid #dfe4dc; display: inline-flex; align-items: center; justify-content: center; gap: 5px; font-size: 8px; cursor: pointer; transition: background .15s, color .15s; }
  .add-button { background: #fff; color: #405541; }
  .add-button:hover { border-color: var(--forest); background: #f0f4ed; }
  .buy-button { border-color: var(--forest); background: var(--forest); color: #fff; }
  .buy-button:hover { background: #243e2e; }
  .empty-results { padding: 54px 15px; border-bottom: 1px solid var(--line); text-align: center; }
  .empty-results strong { font-size: 14px; }
  .empty-results p { margin: 6px 0 14px; color: #797e75; font-size: 9px; }
  .empty-results button { padding: 7px 11px; border: 1px solid var(--line); background: transparent; font-size: 9px; cursor: pointer; }
  .catalog-footer { min-height: 49px; margin-top: 33px; border-top: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between; color: #848980; font-size: 8px; }
  .catalog-footer span:last-child { font: 8px 'DM Sans', sans-serif; }
  .catalog-footer i { padding: 0 4px; color: var(--rust); font-style: normal; }
  .footer { min-height: 76px; padding: 14px max(8vw, 38px); border-top: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between; gap: 15px; background: #f0f1eb; }
  .footer .brand-name { font-size: 20px; }
  .footer p, .footer > a:last-child { margin: 0; color: #777e74; font-size: 8px; text-decoration: none; }
  .footer > a:last-child b { color: var(--ink); font-weight: 500; }
  .overlay { position: fixed; z-index: 20; inset: 0; display: flex; justify-content: flex-end; background: #1c241e9c; animation: fade-in .18s ease both; }
  .drawer { width: min(430px, 100%); height: 100%; padding: 23px; display: flex; flex-direction: column; background: #fafaf7; box-shadow: -12px 0 40px #141a1825; animation: drawer-in .22s ease both; }
  .drawer-heading { padding-bottom: 17px; border-bottom: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between; }
  .drawer-heading h2 { margin: 5px 0 0; color: var(--ink); font-size: 19px; font-weight: 600; }
  .drawer-heading h2 small { color: #878d83; font: 10px 'DM Sans', sans-serif; }
  .close-button { width: 34px; height: 34px; border: 0; display: grid; place-items: center; background: transparent; color: var(--ink); cursor: pointer; }
  .drawer-items { flex: 1; overflow-y: auto; }
  .drawer-item { padding: 14px 0; border-bottom: 1px solid var(--line); display: flex; gap: 11px; }
  .drawer-item > img { width: 75px; height: 84px; object-fit: cover; background: #e9e9e2; }
  .drawer-item-info { flex: 1; display: flex; flex-direction: column; align-items: flex-start; gap: 3px; }
  .drawer-item-info > span { color: #898f85; font-size: 8px; }
  .drawer-item-info > strong { color: #30372f; font-size: 10px; font-weight: 500; }
  .drawer-item-info > b { margin-top: 1px; font: 600 11px 'Noto Sans Bengali', sans-serif; }
  .quantity-control { height: 24px; margin-top: 3px; border: 1px solid var(--line); display: flex; align-items: center; }
  .quantity-control button { width: 25px; height: 22px; padding: 0; border: 0; display: grid; place-items: center; background: transparent; cursor: pointer; }
  .quantity-control span { min-width: 20px; color: #454a42; font: 9px 'DM Sans', sans-serif; text-align: center; }
  .remove-line { padding: 4px; border: 0; align-self: flex-start; background: transparent; color: #888e84; font-size: 8px; cursor: pointer; }
  .drawer-bottom { padding-top: 15px; border-top: 1px solid var(--line); }
  .subtotal { display: flex; justify-content: space-between; align-items: center; font-size: 10px; }
  .subtotal strong { font: 600 14px 'Noto Sans Bengali', sans-serif; }
  .drawer-bottom > p { margin: 5px 0 13px; color: #848a80; font-size: 8px; }
  .checkout-button { min-height: 42px; width: 100%; padding: 0 14px; border: 0; display: flex; align-items: center; justify-content: space-between; background: var(--rust); color: #fff; font-size: 9px; font-weight: 600; cursor: pointer; transition: background .15s, transform .15s; }
  .empty-cart { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
  .empty-bag { width: 56px; height: 56px; margin-bottom: 13px; border-radius: 50%; display: grid; place-items: center; background: #ebefe8; color: var(--forest); }
  .checkout-overlay { justify-content: center; align-items: center; padding: 20px; }
  .checkout-dialog { width: min(440px, 100%); max-height: min(700px, 94vh); overflow-y: auto; padding: 22px; background: #fafaf7; box-shadow: 0 16px 50px #141a1833; animation: rise-in .2s ease both; }
  .checkout-form { padding-top: 15px; }
  .checkout-summary { margin-bottom: 14px; padding: 11px 0; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; color: #616a60; font-size: 9px; }
  .checkout-summary strong { color: var(--ink); font: 600 13px 'Noto Sans Bengali', sans-serif; }
  .checkout-form > label { margin-bottom: 12px; display: flex; flex-direction: column; gap: 5px; color: #4c554b; font-size: 9px; font-weight: 600; }
  .checkout-form input, .checkout-form textarea { width: 100%; min-height: 37px; padding: 8px 10px; border: 1px solid #e0e4dc; outline: 0; background: #fff; font-size: 9px; font-weight: 400; }
  .checkout-form textarea { min-height: 65px; resize: vertical; }
  .checkout-form input:focus, .checkout-form textarea:focus { border-color: #819982; }
  .checkout-disclaimer { margin: 10px 0 0; color: #888e84; font-size: 8px; line-height: 1.7; }
  .checkout-message { padding: 37px 5px 9px; text-align: center; }
  .checkout-message h3 { margin: 0 0 7px; font-size: 15px; }
  .checkout-message p { margin: 0 0 17px; color: #7c8379; font-size: 9px; line-height: 1.8; }
  @keyframes rise-in { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes drawer-in { from { transform: translateX(15px); opacity: .7; } to { transform: translateX(0); opacity: 1; } }
  @media (max-width: 900px) { .header { grid-template-columns: 1fr auto 1fr; padding-inline: 24px; } .navigation { gap: 17px; } .header-actions { gap: 9px; } .search-box input { width: 66px; } .hero { min-height: 390px; padding-inline: 6vw; } .hero-photo { height: 300px; } .benefits, .catalog { padding-inline: 6vw; } .product-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 23px 13px; } }
  @media (max-width: 640px) { .announcement { min-height: 30px; padding-inline: 9px; gap: 6px; font-size: 7px; } .announcement a { display: none; } .header { height: 62px; padding-inline: 14px; grid-template-columns: 1fr auto; } .brand-name { font-size: 21px; } .brand-caption { font-size: 6px; } .navigation { display: none; } .header-actions { gap: 5px; } .search-box { gap: 4px; } .search-box input { width: 65px; font-size: 8px; } .favorite-shortcut { display: none; } .bag-button { gap: 3px; font-size: 8px; } .hero { padding: 26px 17px 20px; display: flex; flex-direction: column; align-items: stretch; gap: 17px; } .hero h1 { margin: 14px 0 8px; font-size: 39px; line-height: 1.22; } .hero-copy > p { max-width: 340px; margin-bottom: 15px; font-size: 10px; } .hero-note { margin-top: 13px; font-size: 8px; } .hero-photo { height: 215px; margin-right: 7px; } .hero-sticker { width: 68px; height: 68px; left: -8px; top: 12px; font-size: 8px; } .photo-label { right: 7px; bottom: 7px; left: 7px; padding: 6px 7px; font-size: 7px; } .hero-vertical { display: none; } .benefits { padding: 10px 17px; grid-template-columns: 1fr; } .benefits > div, .benefits > div:first-child, .benefits > div:last-child { min-height: 51px; padding: 6px 0; justify-content: flex-start; border: 0; border-bottom: 1px solid var(--line); } .benefits > div:last-child { border: 0; } .benefits b { font-size: 9px; } .benefits small { font-size: 8px; } .catalog { padding: 36px 16px 22px; } .catalog-heading { margin-bottom: 16px; } .catalog-heading h2 { font-size: 23px; } .catalog-heading > p { max-width: 110px; font-size: 8px; } .catalog-tools { min-height: 40px; margin-bottom: 12px; } .category-tabs { gap: 15px; } .category-tab { min-height: 39px; font-size: 8px; } .result-count { display: none; } .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 10px; } .product-image { aspect-ratio: .78; } .product-badge { top: 6px; left: 6px; padding: 4px 5px; font-size: 7px; } .heart-button { width: 28px; height: 28px; top: 5px; right: 5px; } .product-info { padding-top: 8px; } .product-info h3 { margin: 4px 0 3px; font-size: 9px; } .product-meta { font-size: 7px; } .rating { font-size: 9px; } .price-row strong { font-size: 10px; } .size-row { margin-top: 6px; gap: 5px; font-size: 7px; } .size-row select { width: 42px; height: 22px; font-size: 7px; } .product-actions { margin-top: 7px; gap: 4px; } .product-actions button { min-height: 31px; gap: 3px; font-size: 7px; } .catalog-footer { min-height: 42px; margin-top: 25px; font-size: 7px; } .footer { min-height: 68px; padding: 11px 16px; flex-wrap: wrap; gap: 8px; } .footer > p { display: none; } .footer > a:last-child { font-size: 7px; } .drawer { padding: 19px 16px; } .checkout-dialog { padding: 18px; } }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; } }
`

export default App
