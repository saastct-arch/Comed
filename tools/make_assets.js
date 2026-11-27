// Gera favicons, ícones do app, manifesto, robots.txt, sitemap.xml e a imagem de compartilhamento (Open Graph).
// Uso, na raiz do repositório: node tools/make_assets.js   (requer playwright e acesso ao Google Fonts)
const {chromium}=require('playwright');const fs=require('fs');
const BASE='https://comed-ipatinga.vercel.app';
const X=JSON.parse(fs.readFileSync('tools/cross-paths.json','utf8'));
const sym=fs.readFileSync('site/assets/logo/comed-simbolo.svg','utf8');
const CROSS=sym.match(/<path d="([^"]+)"/)[1];
const BEAT='M14 70H42L51 55L62 91L73 36L83 79L89 70H126';
const logoLight=fs.readFileSync('site/assets/logo/comed-horizontal-claro.svg','utf8').replace(/ width="\d+" height="\d+"/,'');
const FONT='<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@300..800&family=Instrument+Serif:ital@0;1&display=swap">';
const BG='#FAF4ED', INK='#7A5C49';
// símbolo com traço mais grosso, para continuar legível em 16px
const icon=(scale,rx,w=8)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="${rx}" fill="${BG}"/><g transform="translate(${50-70*scale} ${50-70*scale}) scale(${scale})" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"><path d="${CROSS}"/><path d="${BEAT}"/></g></svg>`;
fs.mkdirSync('site/icons',{recursive:true});fs.mkdirSync('site/og',{recursive:true});
fs.writeFileSync('site/favicon.svg',icon(.64,22,9)+'\n');
(async()=>{
  const b=await chromium.launch();
  async function shot(html,w,h,out,transparent=false){const p=await b.newPage({viewport:{width:w,height:h}});
    await p.setContent(`<!doctype html><html><head>${FONT}<style>html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;${transparent?'background:transparent':''}}*{box-sizing:border-box}svg{display:block}</style></head><body>${html}</body></html>`);
    await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);await p.screenshot({path:out,omitBackground:transparent});await p.close()}
  const sized=(svg,s)=>svg.replace('<svg ',`<svg width="${s}" height="${s}" `);
  for(const s of [16,32,48]) await shot(sized(icon(.7,22,10),s),s,s,`site/icons/favicon-${s}.png`,true);
  await shot(sized(icon(.62,0,8),180),180,180,'site/apple-touch-icon.png');
  await shot(sized(icon(.64,22,8),192),192,192,'site/icons/icon-192.png',true);
  await shot(sized(icon(.64,22,8),512),512,512,'site/icons/icon-512.png',true);
  await shot(sized(icon(.5,0,8),512),512,512,'site/icons/icon-512-maskable.png');
  // imagem de compartilhamento
  const t=(s)=>s;
  const IT="font-family:'Instrument Serif',Georgia,serif;font-weight:400;letter-spacing:-.01em;font-size:1.08em;color:#E9C6B2";
  const og=`<div style="position:relative;width:1200px;height:630px;background:#3F2E25;color:#FAF4ED;font-family:'Figtree',Arial,sans-serif;overflow:hidden">
    <img src="data:image/jpeg;base64,${fs.readFileSync('tools/og-photo.jpg').toString('base64')}" style="position:absolute;right:0;top:0;width:64%;height:100%;object-fit:cover;object-position:60% 30%">
    <div style="position:absolute;inset:0;background:linear-gradient(90deg,#3F2E25 0%,#3F2E25 36%,rgba(63,46,37,.78) 50%,rgba(63,46,37,.2) 70%,rgba(63,46,37,0) 100%),linear-gradient(0deg,rgba(42,29,22,.55) 0%,rgba(42,29,22,0) 35%)"></div>
    <div style="position:absolute;left:72px;top:60px;width:330px">${logoLight.replace('<svg ','<svg style="width:100%;height:auto" ')}</div>
    <div style="position:absolute;left:72px;bottom:64px;width:620px">
      <div style="display:flex;align-items:center;gap:12px;font-size:23px;font-weight:450;color:#E9C6B2;margin-bottom:22px"><span style="width:11px;height:11px;border-radius:50%;background:#E4FF8B"></span>Clínica médica e psicologia em Ipatinga</div>
      <div style="font-size:70px;line-height:1;font-weight:400;letter-spacing:-.035em">A serviço da sua <i style="${IT}">saúde</i> e do seu <i style="${IT};white-space:nowrap">bem-estar</i></div>
      <div style="margin-top:26px;font-size:22px;font-weight:350;white-space:nowrap;color:rgba(250,244,237,.88)">Horto · Segunda a sexta, 8h30 às 17h30 · Convênios aceitos</div>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:0;height:9px;background:#E4FF8B"></div></div>`;
  await shot(og,1200,630,'site/og/og-home.jpg');
  await b.close();
})().then(()=>{
  // favicon.ico a partir dos PNGs (Python/Pillow)
  require('child_process').execFileSync('python3',['-c',`from PIL import Image
im=Image.open('site/icons/favicon-48.png').convert('RGBA'); im.save('site/favicon.ico',sizes=[(16,16),(32,32),(48,48)],append_images=[])`]);
  fs.writeFileSync('site/site.webmanifest',JSON.stringify({name:'Clínica Comed',short_name:'Comed',description:'Clínica no Horto, em Ipatinga, com especialidades médicas e psicologia.',lang:'pt-BR',start_url:'/',scope:'/',display:'standalone',background_color:'#FAF4ED',theme_color:'#3F2E25',icons:[{src:'/icons/icon-192.png',sizes:'192x192',type:'image/png'},{src:'/icons/icon-512.png',sizes:'512x512',type:'image/png'},{src:'/icons/icon-512-maskable.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]},null,2)+'\n');
  fs.writeFileSync('site/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`);
  fs.writeFileSync('site/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${BASE}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>\n</urlset>\n`);
  console.log('ok');
});
