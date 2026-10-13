export const CATALOG_URL='https://pingme.pm/api/catalog';
export const CATALOG_CACHE_KEY='homepage-project-catalog-v2';
function url(value){if(!value)return '';const parsed=new URL(value,CATALOG_URL);if(!['http:','https:'].includes(parsed.protocol)||parsed.username||parsed.password)throw Error('Invalid project URL');return parsed.href;}
export function normalizeCatalog(raw){
 if(!raw||!Array.isArray(raw.categories)||!Array.isArray(raw.projects)||raw.categories.length>100||raw.projects.length>1000)throw Error('Invalid project catalog');
 const categoryIds=new Set(),projectIds=new Set();
 const categories=raw.categories.map(c=>{if(!/^[a-z0-9-]{2,40}$/.test(c.id)||categoryIds.has(c.id)||typeof c.name!=='string'||!c.name.trim()||!Number.isSafeInteger(c.sort_order))throw Error('Invalid category');categoryIds.add(c.id);return {id:c.id,name:c.name,description:String(c.description||''),sort_order:c.sort_order};}).sort((a,b)=>a.sort_order-b.sort_order||a.id.localeCompare(b.id));
 const projects=raw.projects.map(p=>{if(!/^[a-z0-9-]{2,50}$/.test(p.slug)||projectIds.has(p.slug)||typeof p.name!=='string'||!p.name.trim()||!categoryIds.has(p.category)||!Number.isSafeInteger(p.sort_order))throw Error('Invalid project');projectIds.add(p.slug);return {slug:p.slug,name:p.name,description:String(p.description||''),official_url:url(p.official_url),image_url:url(p.image_url),category:p.category,sort_order:p.sort_order};}).sort((a,b)=>a.sort_order-b.sort_order||a.slug.localeCompare(b.slug));
 return {categories,projects};
}
export function projectGroups(catalog){return catalog.categories.map(c=>({id:c.id,title:c.name,desc:c.description,items:catalog.projects.filter(p=>p.category===c.id).map(p=>({slug:p.slug,name:p.name,meta:p.description,href:p.official_url,icon:p.image_url}))})).filter(c=>c.items.length);}
