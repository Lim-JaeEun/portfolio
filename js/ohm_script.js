const draggable_area = document.querySelector('.draggable_area');
const target = document.querySelectorAll(".img_wrap");
let isPress = false,
prevPosX = 0,
prevPosY = 0;
let para_el;
function start(e){
    //현재 좌표
    prevPosX = e.clientX;
    prevPosY = e.clientY;
    isPress = true;
}
function move(e){
    if(!isPress) return;
    //이전좌표와 현재클릭좌표의 값을 구해준다.
    const posX = prevPosX - e.clientX;
    const posY = prevPosY - e.clientY;

    //이전좌표는 현재 좌표값으로 대체해줌
    prevPosX = e.clientX ;
    prevPosY = e.clientY;

    //el값의 오프셋값 - 구한값을빼줌
    para_el.style.top = (para_el.offsetTop - posY) + "px";
    para_el.style.left = (para_el.offsetLeft - posX) + "px";
}

function end(){
    isPress = false;
}


draggable_area.addEventListener('mousemove',(e)=>{
    move(e);
})
window.addEventListener('load',()=>{
    target.forEach(el => {
        el.style.top = Math.random() * (window.innerHeight - el.clientHeight) + 'px';
        el.style.left = Math.random() * (window.innerWidth - el.clientWidth) + 'px';
        el.children[1].addEventListener('click',(e)=>{
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
            el.style.transition = '.3s ease-out';
        })

        el.addEventListener('mousedown',(e)=>{
            //move를 위해 현재 선택된 el값을 담아준다.
            para_el = el;
            start(e);
        })
        el.addEventListener('mouseup',()=>{
            end();
        })
    })
    
})