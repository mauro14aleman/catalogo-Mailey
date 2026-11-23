const fallbackProducts=window.MAILEY_PRODUCTS||[];
const grid=document.getElementById("products"),search=document.getElementById("search");
let products=[...fallbackProducts],category="Todos";
const money=n=>"C$ "+Number(n).toFixed(2);
const escapeHtml=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function normalizeProduct(p){return {...p,id:p.id??p.code,image:p.image_url||p.image,gallery:p.gallery||[],availability:p.availability||"Disponible"}}
async function loadLiveProducts(){
 const cfg=window.MAILEY_SUPABASE||{};
 if(!cfg.url||!cfg.anonKey||!window.supabase)return;
 try{
  const client=window.supabase.createClient(cfg.url,cfg.anonKey);
  const {data,error}=await client.from("products").select("*").eq("is_active",true).is("deleted_at",null).order("created_at",{ascending:false});
  if(error)throw error;
  if(Array.isArray(data)&&data.length)products=data.map(normalizeProduct);
 }catch(error){console.warn("MAILEY: se mantiene el catálogo local.",error.message)}
}
function render(){
 const q=(search.value||"").toLowerCase();
 const list=products.filter(p=>(category==="Todos"||p.category===category)&&(!q||[p.name,p.detail,p.category,p.code].join(" ").toLowerCase().includes(q)));
 grid.innerHTML=list.map(p=>'<article class="product" data-id="'+escapeHtml(p.id)+'"><div class="photo"><img src="'+encodeURI(p.image||"")+'" alt="'+escapeHtml(p.name)+'" loading="lazy"></div><div class="meta"><div class="cat">'+escapeHtml(p.category)+'</div><div class="name">'+escapeHtml(p.name)+'</div><div class="price">'+(p.price===null||p.price===undefined?"Solo por encargo":money(p.price))+'</div></div></article>').join("");
 document.getElementById("count").textContent=list.length+" productos";
 grid.querySelectorAll(".product").forEach(el=>el.onclick=()=>openProduct(products.find(p=>String(p.id)===el.dataset.id)));
}
function openProduct(p){
 if(!p)return;
 const price=p.price===null||p.price===undefined?"Solo por encargo":money(p.price);
 const message=encodeURIComponent("Hola, MAILEY. ❤️ Estoy interesado/a en este producto:\n- Producto: "+p.name+"\n- Código: "+(p.code||"Consultar")+"\n- Precio: "+price+"\n¿Podrían brindarme más información para realizar mi compra?");
 const photos=p.gallery&&p.gallery.length?p.gallery:[p.image];
 document.getElementById("detail").innerHTML='<div class="detail-gallery">'+photos.filter(Boolean).map(src=>'<img class="detail-image" src="'+encodeURI(src)+'" alt="'+escapeHtml(p.name)+'">').join("")+'</div><div class="detail-info"><p class="eyebrow">DETALLES MAILEY</p><p class="cat">'+escapeHtml(p.category)+' · '+escapeHtml(p.code||"")+'</p><h2>'+escapeHtml(p.name)+'</h2><p class="detail-description">'+escapeHtml(p.detail)+'. '+escapeHtml(p.description)+'</p><p class="availability">Disponibilidad: '+escapeHtml(p.availability)+'</p><p class="detail-price">'+price+'</p><a class="btn btn-gold whatsapp-btn" target="_blank" rel="noopener" href="https://wa.me/50586654750?text='+message+'">Consultar este producto por WhatsApp ↗</a></div>';
 document.getElementById("modal").classList.remove("hidden");document.body.classList.add("modal-open");
}
function closeProduct(){document.getElementById("modal").classList.add("hidden");document.body.classList.remove("modal-open")}
document.getElementById("filters").onclick=e=>{if(e.target.dataset.cat){category=e.target.dataset.cat;document.querySelectorAll("#filters button").forEach(b=>b.classList.toggle("active",b===e.target));render()}};
search.oninput=render;
document.getElementById("enter").onclick=()=>{const audio=document.getElementById("mailey-audio");if(audio){audio.volume=.3;audio.play().catch(()=>{})}document.getElementById("welcome").classList.add("out")};
document.getElementById("close").onclick=closeProduct;
document.getElementById("modal").onclick=e=>{if(e.target.id==="modal")closeProduct()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeProduct()});
document.getElementById("menu").onclick=()=>{const nav=document.getElementById("nav");nav.classList.toggle("open");document.getElementById("menu").setAttribute("aria-expanded",String(nav.classList.contains("open")))};
document.getElementById("year").textContent=new Date().getFullYear();
render();loadLiveProducts().then(render);
