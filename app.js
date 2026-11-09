/* چی بپزم؟ — وب‌اپلیکیشن استاتیک کاملاً سمت کاربر، بدون API یا اشتراک پولی */
(() => {
  'use strict';
  const db = window.CHI_BEPAZAM_DATA;
  const root = document.getElementById('app');
  const modalRoot = document.getElementById('modal-root');
  const toastRoot = document.getElementById('toast-root');
  if (!db || !root) return;
  const {groups,categories,recipes} = db;
  const ingredientMap = new Map(groups.flatMap(g => g.items.map(([name,emoji])=>[name,emoji])));
  const recipeMap = new Map(recipes.map(r=>[r.id,r]));
  const number = new Intl.NumberFormat('fa-IR', {maximumFractionDigits:2});
  const storeKey = 'chi-bepazam-state-v1';
  const cleanText = x=>String(x ?? '').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const iconPaths={
    chef:'<path d="M7 18h10v4H7z"/><path d="M7 18v-6a5 5 0 0 1-2-9 5 5 0 0 1 7 1 5 5 0 0 1 7-1 5 5 0 0 1-2 9v6"/>',
    search:'<circle cx="10.7" cy="10.7" r="6.7"/><path d="m16 16 5 5"/>',
    heart:'<path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z"/>',
    cart:'<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M2 3h2l2.6 12.5A2 2 0 0 0 8.5 17H21l2-10H5"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21v-8h6v8"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
    check:'<path d="m4 12 5 5L20 6"/>',
    close:'<path d="M18 6 6 18M6 6l12 12"/>',
    shuffle:'<path d="M3 7h4c5 0 5 10 10 10h4m-4-4 4 4-4 4M3 17h4c2.2 0 3.5-2 4.8-4M17 3l4 4-4 4M13.5 7H17"/>',
    plus:'<path d="M12 4v16M4 12h16"/>',
    minus:'<path d="M4 12h16"/>',
    arrow:'<path d="m15 18-6-6 6-6"/>',
    arrowback:'<path d="m9 18 6-6-6-6"/>',
    tag:'<path d="m20 12-8 8L3 11V3h8z"/><circle cx="7" cy="7" r="1"/>',
    leaf:'<path d="M20 4C8 3 4 10 4 16c0 3 2 4 4 4 6 0 13-7 12-16Z"/><path d="M4 20c2-5 6-8 11-11"/>',
    book:'<path d="M12 7c-3-3-7-3-10-2v14c4-1 7 0 10 2 3-2 6-3 10-2V5c-3-1-7-1-10 2Zm0 0v14"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    sparkle:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z"/>',
    copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    list:'<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    trash:'<path d="M4 7h16M10 11v7M14 11v7M6 7l1 14h10l1-14M9 7V4h6v3"/>',
    cooking:'<path d="M4 12h16v3a8 8 0 0 1-16 0Z"/><path d="M2 12h20M9 6c-2-2 2-3 0-5m6 5c-2-2 2-3 0-5"/>',
    sliders:'<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2" fill="currentColor"/><circle cx="16" cy="12" r="2" fill="currentColor"/><circle cx="10" cy="18" r="2" fill="currentColor"/>',
    users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M18 11a3 3 0 0 0 0-6M18 14a5 5 0 0 1 3 5v1"/>',
    refresh:'<path d="M20 6v5h-5M4 18v-5h5"/><path d="M6 8a8 8 0 0 1 13-1l1 4M4 13l1 4a8 8 0 0 0 13-1"/>',
    location:'<path d="M12 22s8-7 8-13a8 8 0 0 0-16 0c0 6 8 13 8 13Z"/><circle cx="12" cy="9" r="3"/>',
    filter:'<path d="M4 5h16l-6 7v6l-4 2v-8z"/>'
  };
  const ico = (id,cls='')=>`<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[id]||iconPaths.leaf}</svg>`;
  function readStore(){
    try {
      const v=JSON.parse(localStorage.getItem(storeKey)||'{}');
      return {
        selected:new Set((Array.isArray(v.selected)?v.selected:[]).filter(x=>ingredientMap.has(x))),
        favorite:new Set((Array.isArray(v.favorite)?v.favorite:[]).filter(x=>recipeMap.has(x))),
        shopping:(Array.isArray(v.shopping)?v.shopping:[]).filter(x=>x&&ingredientMap.has(x.name)).map(x=>({name:x.name,checked:!!x.checked}))
      };
    } catch {return {selected:new Set(),favorite:new Set(),shopping:[]};}
  }
  const stored=readStore();
  const state={...stored,view:'home',category:'all',query:'',matching:false,expandedIngredients:false,limit:12,dialog:null,servings:4};
  const featuredIds=['koobideh','zereshk-polo','salad-shirazi','soup-lentil','ghormeh','tahchin','cake-chocolate','khoresh-bademjan','salad-fasl','soup-mushroom','adas-polo','ferni-saffron'];
  function save(){try{localStorage.setItem(storeKey,JSON.stringify({selected:[...state.selected],favorite:[...state.favorite],shopping:state.shopping}));}catch{toast('ذخیره‌سازی مرورگر در دسترس نیست.');}}
  function toast(message){toastRoot.innerHTML=`<div class="toast">${ico('check')}<span>${cleanText(message)}</span></div>`; clearTimeout(toast.timer);toast.timer=setTimeout(()=>toastRoot.innerHTML='',3300);}
  const imgSrc = recipe => recipe.photo ? `./assets/${recipe.photo}.webp` : '';
  function recipeArt(r,cls=''){
    const categoryIcon = categories.find(c=>c.id===r.type)?.emoji||'🍽️';
    return r.photo ? `<img class="recipe-image ${cls}" src="${imgSrc(r)}" alt="تصویر تزئینی ${cleanText(r.title)}" loading="lazy">` : `<div class="recipe-art ${cls} art-${r.type}" aria-hidden="true"><span>${categoryIcon}</span><span class="art-motif">✳</span></div>`;
  }
  function missingFor(r){return r.ingredients.filter(i=>!state.selected.has(i.name));}
  function score(r){const n=r.ingredients.length;return n?Math.round((n-missingFor(r).length)/n*100):0;}
  function header(){return `<header class="site-header"><div class="shell header-inner">
    <button class="brand" type="button" data-view="home" aria-label="صفحه اصلی چی بپزم؟"><span class="brand-icon">${ico('chef')}</span><span class="brand-text"><strong>چی بپزم؟ <span>🌿</span></strong><small>آشپزخونه ایرانی</small></span></button>
    <nav class="header-nav" aria-label="منوی اصلی"><button class="nav-link ${state.view==='home'?'selected':''}" data-view="home">خانه</button><button class="nav-link" data-act="categories">دسته‌بندی‌ها</button><button class="nav-link ${state.view==='favorites'?'selected':''}" data-view="favorites">${ico('heart')} علاقه‌مندی‌ها <em>${number.format(state.favorite.size)}</em></button><button class="nav-link ${state.view==='shopping'?'selected':''}" data-view="shopping">${ico('cart')} لیست خرید <em>${number.format(state.shopping.length)}</em></button></nav>
    <div class="header-actions"><button class="mini-icon" type="button" data-act="focus-search" title="جست‌وجو" aria-label="جست‌وجو">${ico('search')}</button><button class="mini-icon mobile-trigger" type="button" data-act="toggle-mobile" aria-label="باز کردن منو">${ico('menu')}</button></div>
    </div><nav id="mobile-nav" class="mobile-menu shell" aria-label="منوی موبایل" hidden><button data-view="home">خانه</button><button data-act="categories">دسته‌بندی غذاها</button><button data-view="favorites">علاقه‌مندی‌ها (${number.format(state.favorite.size)})</button><button data-view="shopping">لیست خرید (${number.format(state.shopping.length)})</button></nav></header>`;}
  function hero(){return `<section class="hero" aria-labelledby="hero-title"><div class="hero-photo" aria-hidden="true"></div><div class="hero-content"><span class="hero-kicker">🌿 از آشپزخونه خودت شروع کن</span><h1 id="hero-title">با مواد موجود در خانه<br><span>چی بپزم؟</span></h1><p>غذاهای خوشمزه ایرانی، با دستور پخت ساده و پیشنهاد مناسب مواد تو.</p><label class="hero-search">${ico('search')}<input id="global-search" type="search" placeholder="اسم غذا یا مواد اولیه رو جست‌وجو کن..." value="${cleanText(state.query)}" autocomplete="off" aria-label="جست‌وجوی غذا"></label></div></section>`;}
  function filterBar(){return `<section class="category-bar" id="categories"><div class="category-title"><span>${ico('grid')} دسته‌بندی‌ها</span></div><div class="category-scroller">${categories.map(c=>`<button type="button" class="category-chip ${state.category===c.id?'active':''}" data-category="${c.id}"><span class="category-emoji">${c.emoji}</span>${c.label}</button>`).join('')}</div></section>`;}
  const quickIngredients=['مرغ','گوشت','ماهی قزل‌آلا','سیب‌زمینی','برنج','عدس','لوبیا قرمز','لپه'];
  function chip(name,emoji){return `<button class="ingredient ${state.selected.has(name)?'on':''}" type="button" aria-pressed="${state.selected.has(name)}" data-ingredient="${cleanText(name)}"><span class="emoji">${emoji}</span><span>${cleanText(name)}</span>${state.selected.has(name)?`<i>${ico('check')}</i>`:''}</button>`;}
  function ingredientPicker(){
    const all = state.expandedIngredients ? groups.map(g=>`<div class="ing-section"><h3>${g.label}</h3><div class="ingredient-grid">${g.items.map(([name,emoji])=>chip(name,emoji)).join('')}</div></div>`).join('') : `<div class="ingredient-grid">${quickIngredients.map(n=>chip(n,ingredientMap.get(n))).join('')}</div>`;
    return `<aside class="pantry" id="pantry"><div class="pantry-title"><span class="pantry-illustration">🧺</span><div><h2>مواد موجود در خانه</h2><p>هر چی داری انتخاب کن تا برات غذا پیدا کنیم.</p></div></div>
     <div class="pantry-selected">${ico('check')} <span>${number.format(state.selected.size)} ماده انتخاب شده</span></div>
     ${all}
     <button type="button" class="show-more" data-act="expand-ingredients">${state.expandedIngredients?'بستن فهرست مواد اولیه':`مشاهده همه ${number.format(ingredientMap.size)} ماده اولیه`}${ico(state.expandedIngredients?'arrowback':'arrow')}</button>
     <button type="button" class="btn btn-primary btn-full btn-recommend" data-act="recommend">${ico('sparkle')} با این مواد چی بپزم؟</button>
     <button type="button" class="clear-selection" data-act="clear-ingredients">${ico('refresh')} پاک کردن انتخاب‌ها</button>
     <p class="pantry-note">با هر بار انتخاب، مواد در همین مرورگر ذخیره می‌شن.</p>
     </aside>`;
  }
  function recipeCard(r){
    const m=missingFor(r),can=state.matching&&m.length===0;
    const badge=state.matching ? `<span class="card-match ${can?'complete':''}">${can?`${ico('check')} موادش رو داری`:`${number.format(m.length)} ماده کم داری`}</span>` : `<span class="card-match casual">${categories.find(c=>c.id===r.type)?.label||''}</span>`;
    return `<article class="recipe-card"><button class="card-photo" type="button" data-open="${r.id}" aria-label="مشاهده دستور ${cleanText(r.title)}">${recipeArt(r)}${badge}</button><button class="favorite-toggle ${state.favorite.has(r.id)?'is-favorite':''}" type="button" data-favorite="${r.id}" aria-label="${state.favorite.has(r.id)?'حذف از':'افزودن به'} علاقه‌مندی‌ها: ${cleanText(r.title)}" title="علاقه‌مندی">${ico('heart')}</button><div class="card-body"><button class="card-title" data-open="${r.id}">${cleanText(r.title)}</button><div class="card-meta"><span>${ico('clock')} ${number.format(r.minutes)} دقیقه</span><span class="difficulty ${r.difficulty==='آسان'?'easy':''}">${r.difficulty}</span></div>${state.matching?`<div class="match-track" title="${number.format(score(r))} درصد مواد اولیه موجود است"><div style="width:${score(r)}%"></div></div>`:''}</div></article>`;
  }
  function filteredRecipes(){
    let rows=recipes.filter(r=>state.category==='all'||r.type===state.category);
    if(state.view==='favorites') rows=rows.filter(r=>state.favorite.has(r.id));
    const q=state.query.trim().toLocaleLowerCase('fa-IR').replace(/ي/g,'ی').replace(/ك/g,'ک');
    if(q) rows=rows.filter(r=>(r.title+' '+r.ingredients.map(i=>i.name).join(' ')).toLocaleLowerCase('fa-IR').replace(/ي/g,'ی').replace(/ك/g,'ک').includes(q));
    if(state.matching){
      rows=rows.sort((a,b)=>{
        const ma=missingFor(a).length,mb=missingFor(b).length;
        return ma-mb || score(b)-score(a) || a.minutes-b.minutes;
      });
    } else rows=rows.sort((a,b)=>{
      const i=featuredIds.indexOf(a.id),j=featuredIds.indexOf(b.id);
      return (i===-1?100:i)-(j===-1?100:j) || a.title.localeCompare(b.title,'fa');
    });
    return rows;
  }
  function gallery(){
    const rows=filteredRecipes(),shown=rows.slice(0,state.limit),whole=state.category==='all'?'همه دستورها':categories.find(c=>c.id===state.category)?.label;
    const title=state.view==='favorites'?'دستورهای محبوب من':state.matching?'پیشنهادها بر اساس مواد شما':state.query?'نتایج جست‌وجو':`پیشنهادهای خوشمزه امروز`;
    const description=state.matching?'غذاهای با مواد کامل‌تر اول نمایش داده می‌شوند. روی هر غذا بزن تا مواد کمبود را ببینی.':state.query?`جست‌وجو در ${number.format(recipes.length)} دستورپخت`:`از ${whole}، یه چیز خوشمزه برای امروز انتخاب کن.`;
    return `<div class="section-heading"><div><div class="title-line"><span class="title-leaf">✦</span><h2>${title}</h2></div><p>${description}</p></div><span class="result-count">${number.format(rows.length)} دستور</span></div>
    ${rows.length?`<div class="recipe-grid">${shown.map(recipeCard).join('')}</div>${rows.length>shown.length?`<button class="more-recipes" data-act="load-more">نمایش دستورهای بیشتر ${ico('arrow')}</button>`:''}`:`<div class="empty"><span>🍽️</span><h3>${state.view==='favorites'?'هنوز غذایی رو ذخیره نکردی':'غذایی با این شرایط پیدا نشد'}</h3><p>${state.view==='favorites'?'روی قلب کنار غذاها بزن تا اینجا ذخیره بشن.':'فیلترها یا مواد انتخابی رو تغییر بده و دوباره امتحان کن.'}</p><button class="btn btn-primary" data-act="reset-filters">دیدن همه غذاها</button></div>`}`;
  }
  function promoTiles(){return `<section class="feature-tiles" aria-label="امکانات چی بپزم"><div class="feature-tile"><div class="feature-icon green">${ico('cart')}</div><div><strong>لیست خرید هوشمند</strong><p>مواد کمبود رو یکجا جمع کن</p></div></div><div class="feature-tile"><div class="feature-icon amber">${ico('book')}</div><div><strong>دستور پخت مرحله‌به‌مرحله</strong><p>ساده، کاربردی و کاملاً فارسی</p></div></div><button class="feature-tile clickable" type="button" data-act="random"><div class="feature-icon coral">${ico('shuffle')}</div><div><strong>امروز چی بپزم؟</strong><p>یه پیشنهاد تصادفی خوشمزه</p></div></button></section>`;}
  function tips(){return `<section class="tip-panel"><div class="tip-decoration">🍋</div><div><span class="tip-tag">نکته آشپزخونه</span><h3>غذای خوشمزه از مواد ساده شروع می‌شه!</h3><p>دستورها برای پخت خانگی نوشته شدن. نمک، فلفل و آب رو از چاشنی‌های پایه در نظر گرفتیم؛ بقیه مواد در لیست هر غذا مشخصه.</p></div><button class="btn btn-outline" data-act="random">سورپرایزم کن ${ico('shuffle')}</button></section>`;}
  function shoppingPage(){
    const pending=state.shopping.filter(s=>!s.checked).length;
    return `<section class="secondary-page"><div class="section-heading"><div><div class="title-line">${ico('cart')}<h1>لیست خرید من</h1></div><p>موادی که برای درست کردن غذاهای دلخواهت کم داری، اینجا نگه دار.</p></div><span class="result-count">${number.format(pending)} مورد باقی‌مانده</span></div>
    <div class="shopping-layout"><div class="shopping-card"><div class="shopping-heading"><h2>مواد لازم برای خرید</h2><button class="btn btn-outline btn-small" data-act="copy-shopping">${ico('copy')} کپی لیست</button></div>
    ${state.shopping.length?`<div class="shopping-list">${state.shopping.map((s,i)=>`<div class="shopping-item ${s.checked?'checked':''}"><button class="shopping-check" type="button" data-shop-check="${i}" aria-label="${s.checked?'برگرداندن':'خریده شد'}: ${cleanText(s.name)}">${s.checked?ico('check'):''}</button><span class="shopping-emoji">${ingredientMap.get(s.name)||'🛒'}</span><span class="shopping-item-title">${cleanText(s.name)}</span><button class="shopping-remove" data-shop-remove="${i}" title="حذف" aria-label="حذف ${cleanText(s.name)}">${ico('trash')}</button></div>`).join('')}</div><div class="shopping-bottom"><span>با تیک زدن، خریدهای انجام‌شده رو علامت بزن.</span><button data-act="clear-checked">حذف خریدشده‌ها</button></div>`:`<div class="empty small"><span>🛒</span><h3>سبد خریدت خالیه</h3><p>یک دستور رو باز کن و «افزودن مواد کمبود به لیست خرید» رو بزن.</p></div>`}
    </div><div class="shopping-side"><h3>اضافه کردن دستی</h3><p>می‌تونی هر کدوم از مواد اولیه رو خودت هم به لیست اضافه کنی.</p><form id="shopping-form"><label for="shopping-ingredient">ماده غذایی</label><select id="shopping-ingredient" name="ingredient">${[...ingredientMap.keys()].map(n=>`<option value="${cleanText(n)}">${ingredientMap.get(n)} ${cleanText(n)}</option>`).join('')}</select><button class="btn btn-primary btn-full" type="submit">${ico('plus')} اضافه به لیست</button></form><p class="side-note">اطلاعات فقط روی همین دستگاه و مرورگر ذخیره می‌شوند.</p></div></div></section>`;
  }
  function homePage(){return `<main class="shell page-layout"><div class="main-col">${hero()}${filterBar()}<section id="gallery-wrap" aria-label="فهرست غذاها">${gallery()}</section>${promoTiles()}${tips()}</div>${ingredientPicker()}</main>`;}
  function favoritesPage(){return `<main class="shell page-layout"><div class="main-col"><div class="inner-head"><div><span class="hero-kicker">❤️ از انتخاب‌های خودت</span><h1>علاقه‌مندی‌های من</h1><p>دستورهای موردعلاقه‌ات همیشه همین‌جا هستن.</p></div><div class="inner-illustration">🍲</div></div>${filterBar()}<section id="gallery-wrap">${gallery()}</section></div>${ingredientPicker()}</main>`;}
  function footer(){return `<footer class="footer"><div class="shell footer-inner"><span><strong>چی بپزم؟</strong> 🌿 آشپزخونه ایرانی</span><span>با عشق و کمی زعفرون ساخته شده ✨</span><small>نسخه آموزشی — بدون اتصال به حساب کاربری یا سرور</small></div></footer>`;}
  function render(){root.innerHTML=header()+(state.view==='shopping'?`<main class="shell shopping-main">${shoppingPage()}</main>`:state.view==='favorites'?favoritesPage():homePage())+footer(); if(state.dialog) renderDialog();}
  function renderGallery(){const g=document.getElementById('gallery-wrap');if(g)g.innerHTML=gallery();}
  function findRecipe(id){return recipeMap.get(id);}
  function showRecipe(id){const r=findRecipe(id);if(!r)return;state.dialog=id;state.servings=r.servings;renderDialog();}
  function qty(value){return number.format(Number(value.toFixed(2)));}
  function renderDialog(){
    const r=findRecipe(state.dialog);if(!r){modalRoot.innerHTML='';document.body.classList.remove('modal-open');return;}
    document.body.classList.add('modal-open');const missing=missingFor(r);
    modalRoot.innerHTML=`<div class="modal-backdrop" data-act="close-backdrop"><article class="recipe-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><button class="dialog-close" data-act="close-modal" aria-label="بستن پنجره">${ico('close')}</button><div class="dialog-cover">${recipeArt(r)}</div>
    <div class="dialog-content"><div class="dialog-kicker">${categories.find(c=>c.id===r.type)?.emoji||'🍽️'} ${categories.find(c=>c.id===r.type)?.label}</div><div class="dialog-headline"><h2 id="dialog-title">${cleanText(r.title)}</h2><button class="dialog-heart ${state.favorite.has(r.id)?'is-favorite':''}" data-favorite="${r.id}" aria-label="افزودن به علاقه‌مندی‌ها">${ico('heart')}</button></div><div class="dialog-stats"><span>${ico('clock')} ${number.format(r.minutes)} دقیقه</span><span>${ico('users')} ${number.format(state.servings)} نفر</span><span>👩‍🍳 ${r.difficulty}</span></div>
    <div class="dialog-ingredients"><div class="ingredients-top"><h3>مواد لازم</h3><div class="servings"><button data-act="servings-minus" aria-label="کم کردن تعداد نفرات">${ico('minus')}</button><span>${number.format(state.servings)} نفر</span><button data-act="servings-plus" aria-label="افزایش تعداد نفرات">${ico('plus')}</button></div></div><div class="ingredient-detail-list">${r.ingredients.map(i=>`<div class="ingredient-detail ${state.selected.has(i.name)?'available':''}"><span>${state.selected.has(i.name)?ico('check'):ico('plus')} ${ingredientMap.get(i.name)||'🧂'} ${cleanText(i.name)}</span><strong>${qty(i.amount*state.servings/r.servings)} ${cleanText(i.unit)}</strong></div>`).join('')}</div><p class="basics-note">نمک، فلفل و آب به مقدار لازم، در صورت نیاز.</p>
    ${missing.length?`<div class="missing-tip">${ico('info')} <span>${number.format(missing.length)} ماده برای این غذا نداری: <strong>${missing.map(i=>cleanText(i.name)).join('، ')}</strong></span></div>`:`<div class="ready-tip">${ico('check')} همه مواد اصلی این دستور رو انتخاب کردی!</div>`}<button class="btn ${missing.length?'btn-primary':'btn-soft'} btn-full" data-act="add-missing" ${missing.length?'':'disabled'}>${ico('cart')} ${missing.length?'افزودن مواد کمبود به لیست خرید':'همه مواد رو داری'}</button></div>
    <div class="dialog-steps"><h3>دستور پخت مرحله‌به‌مرحله</h3><ol>${r.steps.map((s,i)=>`<li><span>${number.format(i+1)}</span><p>${cleanText(s)}</p></li>`).join('')}</ol></div><div class="chef-tip"><span>✨ نکته سرآشپز</span><p>${cleanText(r.tip)}</p></div></div></article></div>`;
    modalRoot.querySelector('.dialog-close')?.focus({preventScroll:true});
  }
  function closeModal(){state.dialog=null;modalRoot.innerHTML='';document.body.classList.remove('modal-open');}
  function navigate(view){state.view=view;state.limit=12;state.query='';state.category='all';state.matching=false;closeModal();render();window.scrollTo(0,0);}
  function toggleFavorite(id){if(state.favorite.has(id)){state.favorite.delete(id);toast('از علاقه‌مندی‌ها حذف شد.');}else{state.favorite.add(id);toast('به علاقه‌مندی‌ها اضافه شد ❤️');}save();const scroll=window.scrollY;render();window.scrollTo(0,scroll);}
  function addShopping(names){let added=0;for(const name of names)if(ingredientMap.has(name)&&!state.shopping.some(s=>s.name===name)){state.shopping.push({name,checked:false});added++;}save();toast(added?`${number.format(added)} مورد به لیست خرید اضافه شد.`:'این مواد از قبل در لیست خرید هستند.');render();}
  function randomRecipe(){const available=filteredRecipes();const pool=available.length?available:recipes;showRecipe(pool[Math.floor(Math.random()*pool.length)].id);}
  async function copyShopping(){
    const str=state.shopping.filter(s=>!s.checked).map(x=>'• '+x.name).join('\n');
    if(!str){toast('فعلاً موردی برای کپی وجود نداره.');return;}
    try{await navigator.clipboard.writeText('لیست خرید چی بپزم؟\n'+str);toast('لیست خرید کپی شد.');}
    catch{const el=document.createElement('textarea');el.value='لیست خرید چی بپزم؟\n'+str;document.body.append(el);el.select();const ok=document.execCommand('copy');el.remove();toast(ok?'لیست خرید کپی شد.':'مرورگر اجازه کپی نداد؛ می‌تونی مواد رو دستی انتخاب کنی.');}
  }
  document.addEventListener('click',e=>{
    const el=e.target.closest('button,[data-act]'); if(!el)return;
    if(el.hasAttribute('data-view')){navigate(el.dataset.view);return;}
    if(el.hasAttribute('data-category')){state.category=el.dataset.category;state.limit=12;const pos=window.scrollY;render();if(pos>0)window.scrollTo(0,pos);return;}
    if(el.hasAttribute('data-ingredient')){const name=el.dataset.ingredient;if(!ingredientMap.has(name))return;state.selected.has(name)?state.selected.delete(name):state.selected.add(name);save();const pos=window.scrollY;render();window.scrollTo(0,pos);return;}
    if(el.hasAttribute('data-open')){showRecipe(el.dataset.open);return;}
    if(el.hasAttribute('data-favorite')){toggleFavorite(el.dataset.favorite);return;}
    if(el.hasAttribute('data-shop-check')){const i=Number(el.dataset.shopCheck);if(state.shopping[i]){state.shopping[i].checked=!state.shopping[i].checked;save();render();}return;}
    if(el.hasAttribute('data-shop-remove')){const i=Number(el.dataset.shopRemove);state.shopping.splice(i,1);save();render();return;}
    const act=el.dataset.act;
    if(act==='recommend'){if(!state.selected.size){toast('اول یکی از مواد موجود در خانه رو انتخاب کن.');return;}state.view='home';state.matching=true;state.limit=12;render();document.getElementById('gallery-wrap')?.scrollIntoView({behavior:'smooth',block:'start'});return;}
    if(act==='expand-ingredients'){state.expandedIngredients=!state.expandedIngredients;const pos=window.scrollY;render();window.scrollTo(0,pos);return;}
    if(act==='clear-ingredients'){state.selected.clear();state.matching=false;save();const pos=window.scrollY;render();window.scrollTo(0,pos);toast('انتخاب مواد پاک شد.');return;}
    if(act==='focus-search'){if(state.view!=='home'){navigate('home');}document.getElementById('global-search')?.focus();return;}
    if(act==='categories'){if(state.view!=='home'){navigate('home');}document.getElementById('categories')?.scrollIntoView({behavior:'smooth',block:'start'});return;}
    if(act==='toggle-mobile'){const n=document.getElementById('mobile-nav');if(n)n.hidden=!n.hidden;return;}
    if(act==='load-more'){state.limit+=12;renderGallery();return;}
    if(act==='random'){randomRecipe();return;}
    if(act==='close-modal'){closeModal();return;}
    if(act==='close-backdrop'){if(e.target===el)closeModal();return;}
    if(act==='servings-minus'){state.servings=Math.max(1,state.servings-1);renderDialog();return;}
    if(act==='servings-plus'){state.servings=Math.min(20,state.servings+1);renderDialog();return;}
    if(act==='add-missing'){const r=findRecipe(state.dialog);if(r){addShopping(missingFor(r).map(i=>i.name));renderDialog();}return;}
    if(act==='copy-shopping'){copyShopping();return;}
    if(act==='clear-checked'){state.shopping=state.shopping.filter(s=>!s.checked);save();render();toast('موارد خریداری‌شده پاک شدند.');return;}
    if(act==='reset-filters'){state.view='home';state.category='all';state.query='';state.matching=false;state.limit=12;render();return;}
  });
  document.addEventListener('input',e=>{if(e.target.id==='global-search'){state.query=e.target.value;state.limit=12;renderGallery();}});
  document.addEventListener('submit',e=>{if(e.target.id==='shopping-form'){e.preventDefault();const name=e.target.querySelector('select').value;addShopping([name]);}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.dialog)closeModal();});
  render();
})();
