// QuickShop setup: WhatsApp number uses international digits only, no +, spaces or dashes.
// Current number is based on the contact number previously provided. Edit it here if needed.
const WHATSAPP_NUMBER = '971569247414';
const products = [
  {id:'bag-1',name:'Classic Everyday Tote',price:79,category:'Tote',description:'A roomy everyday style for work, shopping and weekends.',tag:'BESTSELLER',image:'assets/bag-1.jpg'},
  {id:'bag-2',name:'Elegant Shoulder Bag',price:89,category:'Shoulder',description:'A polished bag to complement your everyday outfits.',tag:'POPULAR', image:'assets/bag-2.jpg'},
  {id:'bag-3',name:'Mini Crossbody Bag',price:59,category:'Crossbody',description:'Compact, lightweight and easy to carry on the go.',tag:'EVERYDAY',image:'assets/bag-3.jpg'},
  {id:'bag-4',name:'Soft Neutral Handbag',price:99,category:'Shoulder',description:'A timeless neutral style for casual and dressy looks.',tag:'NEW STYLE',image:'assets/bag-4.jpg'},
  {id:'bag-5',name:'Evening Clutch',price:49,category:'Clutch',description:'A simple finishing touch for dinners and special events.',tag:'OCCASION',image:'assets/bag-5.jpg'},
  {id:'bag-6',name:'Daily Crossbody',price:69,category:'Crossbody',description:'A practical hands-free bag for busy days.',tag:'FAVOURITE',image:'assets/bag-6.jpg'}
];
let activeCategory='All';
let cart=[];
const $=s=>document.querySelector(s);
const money=n=>`AED ${n.toFixed(0)}`;
function whatsappUrl(message){return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;}
function orderOne(p){window.open(whatsappUrl(`Hello QuickShop! I'd like to order this bag:\nProduct: ${p.name}\nPrice: ${money(p.price)}\nPlease confirm availability, delivery and payment details.`),'_blank','noopener');}
function renderProducts(){
  let list=products.filter(p=>(activeCategory==='All'||p.category===activeCategory)&&(`${p.name} ${p.category} ${p.description}`).toLowerCase().includes($('#searchInput').value.toLowerCase().trim()));
  const sort=$('#sortSelect').value;if(sort==='low')list.sort((a,b)=>a.price-b.price);if(sort==='high')list.sort((a,b)=>b.price-a.price);if(sort==='az')list.sort((a,b)=>a.name.localeCompare(b.name));
  $('#productGrid').innerHTML=list.map(p=>`<article class="product-card"><div class="product-visual"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span></div><div class="product-info"><span class="product-category">${p.category} Bag</span><h3>${p.name}</h3><p class="product-description">${p.description}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-button" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button></div><button class="order-button" data-order="${p.id}">☏ Order on WhatsApp</button></div></article>`).join('');
  $('#productCount').textContent=`${list.length} ${list.length===1?'style':'styles'}`;$('#emptyState').hidden=list.length>0;
}
function renderCart(){
  $('#cartCount').textContent=cart.reduce((n,x)=>n+x.qty,0);
  $('#cartItems').innerHTML=cart.length?cart.map(x=>`<div class="cart-line"><img src="${x.product.image}" alt=""><div class="cart-line-info"><strong>${x.product.name}</strong><small>${money(x.product.price)} each</small></div><div class="quantity-controls"><button data-qty="${x.product.id}" data-delta="-1" aria-label="Remove one">−</button><span>${x.qty}</span><button data-qty="${x.product.id}" data-delta="1" aria-label="Add one">+</button></div></div>`).join(''):'<p class="cart-empty">Your bag is empty. Add a style you love!</p>';
  $('#cartTotal').textContent=money(cart.reduce((n,x)=>n+x.product.price*x.qty,0));
}
function openCart(){ $('#cartDrawer').classList.add('open');$('#scrim').classList.add('show');$('#cartDrawer').setAttribute('aria-hidden','false'); }
function closeCart(){ $('#cartDrawer').classList.remove('open');$('#scrim').classList.remove('show');$('#cartDrawer').setAttribute('aria-hidden','true'); }
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);}
$('#categoryPills').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll('.pill').forEach(x=>x.classList.toggle('active',x===b));renderProducts();});
$('#searchInput').addEventListener('input',renderProducts);$('#sortSelect').addEventListener('change',renderProducts);
$('#productGrid').addEventListener('click',e=>{const add=e.target.closest('[data-add]');const order=e.target.closest('[data-order]');if(add){const p=products.find(x=>x.id===add.dataset.add);const existing=cart.find(x=>x.product.id===p.id);if(existing)existing.qty++;else cart.push({product:p,qty:1});renderCart();toast(`${p.name} added to your bag`);}if(order){const p=products.find(x=>x.id===order.dataset.order);orderOne(p);}});
$('#cartItems').addEventListener('click',e=>{const b=e.target.closest('[data-qty]');if(!b)return;const item=cart.find(x=>x.product.id===b.dataset.qty);if(!item)return;item.qty+=Number(b.dataset.delta);if(item.qty<=0)cart=cart.filter(x=>x!==item);renderCart();});
$('#cartToggle').addEventListener('click',openCart);$('#cartClose').addEventListener('click',closeCart);$('#scrim').addEventListener('click',closeCart);
$('#checkoutButton').addEventListener('click',()=>{if(!cart.length){toast('Your bag is empty. Add a product first.');return;}const lines=cart.map(x=>`${x.qty} × ${x.product.name} — ${money(x.product.price*x.qty)}`).join('\n');const total=cart.reduce((n,x)=>n+x.product.price*x.qty,0);window.open(whatsappUrl(`Hello QuickShop! I'd like to place an order:\n${lines}\nEstimated total: ${money(total)}\nPlease confirm availability, delivery and payment details.`),'_blank','noopener');});
const generalMessage='Hello QuickShop! Please help me choose a ladies bag.';
['headerWhatsApp','helpWhatsApp','contactWhatsApp','floatingWhatsApp'].forEach(id=>{const el=document.getElementById(id);el.href=whatsappUrl(generalMessage);if(id==='floatingWhatsApp')el.addEventListener('click',e=>{e.preventDefault();window.open(whatsappUrl(generalMessage),'_blank','noopener');});});
$('#year').textContent=new Date().getFullYear();renderProducts();renderCart();
