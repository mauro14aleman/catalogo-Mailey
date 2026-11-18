const data=window.MAILEY_PRODUCTS;
const grid=document.getElementById("products"),search=document.getElementById("search");
let category="Todos";
const money=n=>"C$ "+Number(n).toFixed(2);
function render(){
 const q=search.value.toLowerCase();
 const list=data.filter(p=>(category==="Todos"||p.category===category)&&(!q||(p.name+p.detail+p.category+p.code).toLowerCase().includes(q)));
 grid.innerHTML=list.map(p=>'<article class="product" data-id="'+p.id+'"><div class="photo"><img src="'+p.image+'" alt="'+p.name+'" loading="lazy"></div><div class="meta"><div class="cat">'+p.category+'</div><div class="name">'+p.name+'</div><div class="price">'+(p.price===null?"Solo por encargo":money(p.price))+'</div></div></article>').join("");
 document.getElementById("count").textContent=list.length+" productos";
 grid.querySelectorAll(".product").forEach(el=>el.onclick=()=>openProduct(data.find(p=>p.id==el.dataset.id)));
}
function openProduct(p){
 const price=p.price===null?"Solo por encargo":money(p.price);
 const message=encodeURIComponent("Hola, MAILEY. ❤️ Estoy interesado/a en este producto:\n- Producto: "+p.name+"\n- Código: "+p.code+"\n- Precio: "+price+"\n¿Podrían brindarme más información para realizar mi compra?");
 const photos=p.gallery||[p.image];
 document.getElementById("detail").innerHTML='<div class="detail-gallery">'+photos.map(src=>'<img class="detail-image" src="'+src+'" alt="'+p.name+'">').join("")+'</div><div class="detail-info"><p class="eyebrow">DETALLES MAILEY</p><p class="cat">'+p.category+' · '+p.code+'</p><h2>'+p.name+'</h2><p class="detail-description">'+p.detail+'. '+p.description+'</p><p class="availability">Disponibilidad: '+p.availability+'</p><p class="detail-price">'+price+'</p><a class="btn dark whatsapp-btn" target="_blank" rel="noopener" href="https://wa.me/50586654750?text='+message+'">Consultar este producto por WhatsApp ↗</a></div>';
 document.getElementById("modal").classList.remove("hidden");document.body.classList.add("modal-open");
}
function closeProduct(){document.getElementById("modal").classList.add("hidden");document.body.classList.remove("modal-open")}
document.getElementById("filters").onclick=e=>{if(e.target.dataset.cat){category=e.target.dataset.cat;document.querySelectorAll("#filters button").forEach(b=>b.classList.toggle("active",b===e.target));render()}};
search.oninput=render;
document.getElementById("enter").onclick=()=>{const audio=document.getElementById("mailey-audio");if(audio){audio.volume=.35;audio.play().catch(()=>{})}document.getElementById("welcome").classList.add("out")};
document.getElementById("close").onclick=closeProduct;
document.getElementById("modal").onclick=e=>{if(e.target.id==="modal")closeProduct()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeProduct()});
document.getElementById("menu").onclick=()=>document.getElementById("nav").classList.toggle("open");
document.getElementById("year").textContent=new Date().getFullYear();render();