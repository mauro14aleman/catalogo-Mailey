const data=window.MAILEY_PRODUCTS;
const grid=document.getElementById("products");
const search=document.getElementById("search");
let category="Todos";
const money=n=>"C$"+n;

function render(){
  const q=search.value.toLowerCase();
  const list=data.filter(p=>(category==="Todos"||p.category===category)&&(!q||(p.name+p.detail+p.category).toLowerCase().includes(q)));
  grid.innerHTML=list.map(p=>'<article class="product" data-id="'+p.id+'"><div class="photo"><img src="'+p.image+'" alt="'+p.name+'" loading="lazy"></div><div class="meta"><div class="cat">'+p.category+'</div><div class="name">'+p.name+'</div><div class="price">'+(p.price===null?"Solo por encargo":money(p.price))+'</div></div></article>').join("");
  document.getElementById("count").textContent=list.length+" productos";
  grid.querySelectorAll(".product").forEach(el=>el.onclick=()=>showProduct(data.find(p=>p.id==el.dataset.id)));
}

function showProduct(p){
  const price=p.price===null?"Solo por encargo":money(p.price);
  const msg=encodeURIComponent("Hola MAILEY, me interesa el artículo: "+p.name+" ("+price+"). ¿Me brindan más información?");
  const images=p.gallery||[p.image];
  document.getElementById("detail").innerHTML=
    '<div class="detail-gallery">'+images.map(src=>'<img class="detail-image" src="'+src+'" alt="'+p.name+'">').join("")+'</div>'+
    '<div class="detail-info"><p class="cat">'+p.category+'</p><h2>'+p.name+'</h2><p class="detail-description">'+p.detail+'</p><p class="detail-price">'+price+'</p>'+
    '<a class="btn dark whatsapp-btn" target="_blank" rel="noopener" href="https://wa.me/50586654750?text='+msg+'">Consultar este artículo por WhatsApp ↗</a></div>';
  document.getElementById("modal").classList.remove("hidden");
}

document.getElementById("filters").onclick=e=>{
  if(e.target.dataset.cat){
    category=e.target.dataset.cat;
    document.querySelectorAll("#filters button").forEach(b=>b.classList.toggle("active",b===e.target));
    render();
  }
};
search.oninput=render;
document.getElementById("enter").onclick=()=>{
  const audio=document.getElementById("mailey-audio");
  if(audio){audio.volume=0.35;audio.play().catch(()=>{});}
  document.getElementById("welcome").classList.add("out");
};
document.getElementById("close").onclick=()=>document.getElementById("modal").classList.add("hidden");
document.getElementById("modal").onclick=e=>{if(e.target.id==="modal")e.currentTarget.classList.add("hidden")};
document.getElementById("menu").onclick=()=>document.getElementById("nav").classList.toggle("open");
document.getElementById("year").textContent=new Date().getFullYear();
render();
