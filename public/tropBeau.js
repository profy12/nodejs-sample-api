console.log('Test');
//$("#domain-list").click(()=>{console.log('youhou');});
/*window.onload = function(){
    let zef = document.getElementById("dez");
    $("li").hover(()=>{$(this).css('color','darkred');},()=>{$(this).css('color','red');});
    console.log(zef);
    zef.style.color = "blue";
}
*/
function addClassEffect(event){
    event.currentTarget.setAttribute('class','domains-hover');
}
function removeClassEffect(event){
    event.currentTarget.setAttribute('class','domains');
}
function putEffect(){
    console.log('Setting effect');
    const domainListEl = document.getElementById('domain-list');
    const domainList = domainListEl.childNodes;
    domainList.forEach(domainEl=>{
        console.log(domainEl);
        domainEl.addEventListener("mouseover",addClassEffect);
        domainEl.addEventListener("mouseout",removeClassEffect);
    });
    /*
    $(".domains").hover(
        (event)=>{
            $(event.currentTarget).toggleClass('domains-hover');
        },
        (event)=>{
            $(event.currentTarget).toggleClass('domains-hover');
        }
        );
        
    }
    */
}
$(document).ready(function(){
    console.log("document loaded");
    putEffect();
})
//window.setInterval(putEffect, 10000);
