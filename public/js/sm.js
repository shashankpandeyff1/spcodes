function setsm(){
  let link=encodeURI(window.location.href);
  let msg=encodeURIComponent(` Hey! Visit this Page of Shashank Pandey's site`);
  let title=encodeURIComponent(document.querySelector('title').textContent);
  let fb=document.getElementsByClassName('fb')[0];
  let tr=document.getElementsByClassName('tr')[0];
  let wa=document.getElementsByClassName('wa')[0];
  let ld=document.getElementsByClassName('ld')[0];
  fb.href=`https://www.facebook.com/sharer/sharer.php?u=${link}&text=${msg}&title=${title}`;
  tr.href=`https://twitter.com/intent/tweet?text=${link}&text=${ msg}&title=${title}`;
//  wa.href=`https://wa.me/?text=${link}&text=${link}&title=${title}`;
  wa.href=`whatsapp://send?text=${link}`
  ld.href=`https://www.linkedin.com/sharing/share-offsite/?url=${link}&text=${msg}&title=${title}`;
}
setsm();

function closesm(){
  document.getElementsByClassName('smbox')[0].style.display="none";
}


function showsm(){
  document.getElementsByClassName('smbox')[0].style.display="block";
  document.getElementsByClassName('smbox')[0].style.display="flex";
}
