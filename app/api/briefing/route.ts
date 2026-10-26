import {createSign} from 'node:crypto';
export const runtime='nodejs';
const recent=new Map<string,number[]>();
let queue:Promise<unknown>=Promise.resolve();
const required=['name','email','phone','brand','segment','size','age','description','audience','challenge','goal','agency','budget','timeline'];
const allowedServices=['Gestão de redes sociais','Produção de conteúdo','Identidade visual / Branding','Tráfego pago','Fotografia','Estratégia e planejamento','Outro / Ainda não sei'];
const response=(error:string,status:number)=>Response.json({error},{status});
export async function POST(req:Request){
 const origin=req.headers.get('origin');if(origin){try{if(new URL(origin).host!==req.headers.get('host'))return response('Origem não permitida.',403)}catch{return response('Origem não permitida.',403)}}
 const raw=await req.text();if(raw.length>24000)return response('Briefing muito longo.',413);
 let d:Record<string,unknown>;try{d=JSON.parse(raw)}catch{return response('Dados inválidos.',400)}
 if(!d||typeof d!=='object'||Array.isArray(d))return response('Dados inválidos.',400);
 if(d.company_url||typeof d.started!=='number'||Date.now()-d.started<3000)return response('Não foi possível validar o envio. Aguarde alguns segundos.',400);
 if(required.some(k=>typeof d[k]!=='string'||!(d[k] as string).trim()||(d[k] as string).length>3000)||!/^\S+@\S+\.\S+$/.test(String(d.email))||!/^\+?[()\d\s-]{10,22}$/.test(String(d.phone))||d.consent!==true||!Array.isArray(d.services)||!d.services.length||d.services.length>7||d.services.some(s=>!allowedServices.includes(s))||typeof d.key!=='string'||!/^[a-f0-9-]{36}$/.test(d.key))return response('Confira os campos obrigatórios e o consentimento.',400);
 const sheet=process.env.GOOGLE_SHEET_ID, email=process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, privateKey=process.env.GOOGLE_PRIVATE_KEY;
 if(!sheet||!email||!privateKey)return response('O recebimento de briefings ainda está sendo configurado. Fale com bitestudio.bs@gmail.com. Nenhum dado foi enviado.',503);
 const now=Date.now();for(const [k,times] of recent){if(times.every(t=>now-t>3600000))recent.delete(k)}
 const rateKey=String(d.email).toLowerCase().trim();const hits=(recent.get(rateKey)||[]).filter(t=>now-t<3600000);if(hits.length>=5)return response('Limite de envios atingido. Tente novamente mais tarde.',429);recent.set(rateKey,[...hits,now]);
 try{
 const execute=async()=>{const iat=Math.floor(Date.now()/1000);const enc=(v:unknown)=>Buffer.from(JSON.stringify(v)).toString('base64url');const input=enc({alg:'RS256',typ:'JWT'})+'.'+enc({iss:email,scope:'https://www.googleapis.com/auth/spreadsheets',aud:'https://oauth2.googleapis.com/token',iat,exp:iat+3600});const sign=createSign('RSA-SHA256');sign.update(input);const assertion=input+'.'+sign.sign(privateKey.replace(/\\n/g,'\n'),'base64url');
 const tokenRes=await fetch('https://oauth2.googleapis.com/token',{method:'POST',body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion}),signal:AbortSignal.timeout(15000)});if(!tokenRes.ok)throw new Error('Authentication failed');const token=await tokenRes.json();const headers={Authorization:'Bearer '+token.access_token,'Content-Type':'application/json'};const base='https://sheets.googleapis.com/v4/spreadsheets/'+encodeURIComponent(sheet)+'/values/';
 const existing=await fetch(base+'Briefings!A:A',{headers,cache:'no-store',signal:AbortSignal.timeout(15000)});if(!existing.ok)throw new Error('Sheet read failed');const rows=await existing.json();if(rows.values?.some((r:string[])=>r[0]===d.key))return;
 const values=[d.key,new Date().toISOString(),...['name','email','phone','brand','website','segment','size','age','description','audience'].map(k=>String(d[k]||'')),(d.services as string[]).join('; '),...['challenge','goal','agency','budget','timeline','notes'].map(k=>String(d[k]||'')),'Consentimento LGPD: sim; política v1'];
 const saved=await fetch(base+'Briefings!A:T:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS',{method:'POST',headers,body:JSON.stringify({values:[values]}),signal:AbortSignal.timeout(15000)});if(!saved.ok)throw new Error('Sheet append failed');};
 const task=queue.then(execute);queue=task.catch(()=>{});await task;return Response.json({ok:true});
 }catch{return response('Não foi possível confirmar o registro. Tente novamente; o identificador do envio será preservado para evitar duplicação.',502)}
}
