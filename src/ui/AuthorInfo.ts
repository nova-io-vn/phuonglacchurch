export const AUTHOR={name:'Đinh Quốc Bảo',phone:'0345591223',website:'https://qb.nova.io.vn'};
export function setupAuthorInfo(){
 const dialog=document.getElementById('author-dialog') as HTMLDialogElement;
 document.getElementById('author-open')!.onclick=()=>dialog.showModal();
 document.getElementById('author-close')!.onclick=()=>dialog.close();
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
}
