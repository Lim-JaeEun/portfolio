const canvas =document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
let canvasParents = canvas.parentNode;
let canvasWidth, canvasHeight;

let imageSrc = './images/temburins_main_03.jpg';
let currentIdx = 0;

let isMouseDown = false;
let prevPos = {x:0, y:0};
let scratch_flag = false;

let percent = 0;

let isEnd = false;
let circle_wrap_width = document.querySelector('canvas').clientHeight;
let mainChk = document.querySelector('body').classList.contains('main_complete');

const bestSeller_slider = document.querySelector('.bestItem_swiper');
const bestSeller_cursor = document.querySelector('.cursor');
window.onload=()=>{
    
    if(!document.querySelector('body').classList.contains('main_complete')) {
        setTimeout(()=>{
            window.scrollTo({
                top:0,
                left:0, 
            })
        },50)

    }
}
function resize(){
    canvasWidth = canvasParents.clientWidth;
    canvasHeight = canvasParents.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = canvasWidth+'px';
    canvas.style.height = canvasHeight+'px';
    
    circle_infinite();

    if(isEnd) return;
    drawImage();

}


function drawImage(){
    ctx.clearRect(0,0,canvasWidth,canvasHeight)
    const image = new Image();
    image.src = imageSrc;
    image.onload=()=>{
        let sw, sh;
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = image.width;
        const ih = image.height;
        
        const cr = ch / cw;
        const ir = ih / iw;
       
        if(ir>=cr) {
           sw = iw;
           sh = sw * (ch/cw);
            
        }else {
            sh = ih;
            sw = sh * (cw/ch);
        }

        let sx = (iw/2) - (sw/2);
        let sy = (ih/2) - (sh/2);
        ctx.drawImage(image,sx,sy,sw,sh,0,0,cw,ch);
    }
}
function getDistance(p1,p2){
    const dx = p2.x - p1.x;
    const dy = p2.y - p2.y;
    //두 점 사이의 거리 
    return Math.sqrt(dx * dx + dy * dy)
}
function getAngle(p1,p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.atan2(dy,dx);
}
function drawCircles(e){
    let nextPos;
    if(e.touches == undefined) {
        nextPos = {x:e.offsetX, y:e.offsetY};
    }else {
        nextPos = {x:e.touches[0].clientX, y:e.touches[0].clientY};
    }
    const dist = getDistance(prevPos, nextPos);
    const angle = getAngle(prevPos, nextPos);
    for(let i=0; i<dist; i++){
        let x = prevPos.x + Math.cos(angle) * i;
        let y = prevPos.y + Math.sin(angle) * i;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x,y,canvasWidth/15,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }
    prevPos = nextPos;
    
    remove_Percent();
}    
// Throttle
let timer;
function throttle(callbackFn, timeout) {
    if(!timer) {
        timer = setTimeout(() => {
            timer = null;
            callbackFn();
        }, timeout);
    }
} 
function remove_Percent(){
    const canvas_background_img = document.querySelector('.preview_img');
    canvas_background_img.style.display='none';

    throttle(()=>{
        const pixels = ctx.getImageData(0,0,canvasWidth,canvasHeight);
        const gap = 32;
        const totalLength = pixels.data.length / gap;

        let count = 0;
        for(let i=0; i<pixels.data.length - 3; i+=gap) {
            if(pixels.data[i+3] == 0) count ++;
        }
        percent = Math.round(count/totalLength * 100);

  
        if(percent > 60) {
            scratch_flag = true;
            gsap.to(canvas,{
                opacity:0, 
                duration:.8, 
                onComplete:()=>{
                    canvas.style.opacity = 1;
                    drawImage();
                }
            })
            gsap.to('.arrow_bottom',{
                opacity:1,
                top:'-25%',
                ease:'power2.out',
                onComplete:()=>{
                    //document.querySelector('body').classList.add('main_complete');
                    isEnd = true 
                }
            })
        }
    },500)
    
}


const circle = document.querySelector('.arrow_bottom');
const circle_innerText = document.querySelector('.circle_text');

circle_innerText.innerHTML = circle_innerText.innerText.split("")
.map((char,i)=> `<span style="transform:rotate(${i * 2}deg)">${char}</span>`)
.join("");
function circle_infinite(){
    const circle_inner_span = document.querySelectorAll('.circle_text span');
    circle_inner_span.forEach((el)=>{
        el.style.transformOrigin = `0 ${canvasHeight/2}px`
    })
}
const next_section_Btn = document.querySelector(".next_section_btn > a");

const elem = document.querySelector(next_section_Btn.getAttribute("href"));

const regex = /[^0-9]/g;
const linkST = ScrollTrigger.create({
    trigger:elem,
    start:'top top'
})
ScrollTrigger.create({
    trigger:elem,
    start:'top top',
    end: 'bottom center'
})
circle.addEventListener('click',(e)=>{
    e.preventDefault();
    gsap.to('.arrow_bottom',{
        // position:'sticky',
        left:'0%',
        top:'0%',
        width:circle_wrap_width,
        height:circle_wrap_width,
        zIndex:1,
        //delay:.5,
        ease:'power1.out',
        duration:1,
    })
    gsap.to(window,{
        duration:1.3,
        scrollTo:linkST.start,
        overwrite:"auto",
        //delay:.2,
        onComplete:()=>{
            document.querySelector('body').classList.add('main_complete');
        }
    })  
  
    document.querySelectorAll('.circle_text span').forEach(el=>{
        gsap.to(el,{
            duration:.8,
            ease:'power1.out',
            transformOrigin : `0 ${circle_wrap_width/2}px`
        })
    })
    gsap.to('.next_section_btn',{
        opacity:0,
        display:'none'
    })



})
function scratch_txt(e){
    const moving_txt = gsap.timeline({paused:true})
    moving_txt.to('.scratch_txt',{
        x:e.pageX + 20,
        y:e.pageY + 20,
    })
    moving_txt.to('.scratch_txt',{
        opacity:1,
        ease:'power1.out',
    })
    return moving_txt;
}

function onMouseDown(e){
    if(isMouseDown) return;
    isMouseDown = true;
    prevPos ={x:e.offsetX ||e.touches[0].clientX, y:e.offsetY||e.touches[0].clientY};
}
function onMouseUp(){
    isMouseDown = false;

}
function onMouseMove(e){
    //const testfunc = scratch_txt(e);
    if(scratch_flag === false){
        gsap.to('.scratch_txt',{
            x:e.pageX + 20,
            y:e.pageY + 20,
            duration:1
        })
        gsap.to('.scratch_txt',{
            opacity:1,
            ease:'power1.out',
            delay:.3
        })
    }else {
        gsap.to('.scratch_txt',{
            opacity:0,
            ease:'power1.out',
            delay:.2
        })
    }
    if(!isMouseDown || isEnd) return;
    drawCircles(e);

    

}



canvas.addEventListener('mousedown',onMouseDown)
canvas.addEventListener('touchstart',onMouseDown)

canvas.addEventListener('mouseup',onMouseUp)
canvas.addEventListener('touchend',onMouseUp)


canvas.addEventListener('mousemove', onMouseMove)
canvas.addEventListener("touchmove", onMouseMove);
window.addEventListener('resize',resize)


canvas.addEventListener('mouseleave',()=>{
    gsap.to('.scratch_txt',{
        opacity:0,
        ease:'power1.out',
        delay:.5
    })
})
resize();


/*nav_Btn click*/

const nav_btn = () =>{
    const nav_timeline = gsap.timeline({paused:true})
    nav_timeline.to('.line',{
        opacity:0,
        duration:.3
    },0)

    nav_timeline.to('.hamburger-lines',{
        width:'379px',
        ease:'power1.out',
        duration:.5,
        //opacity:1,
    })
    nav_timeline.to('.left_menu',{
        opacity:1,
        zIndex:5,
        duration:.3,
    
    },'>')
    nav_timeline.to('.left_menu .menu_item',{
        opacity:1,
        ease:'power1.out',
        y:0,
        stagger:{
            each:.15,
            from:"start"
        },
    },'>')

    return nav_timeline;
}


const new_items = gsap.utils.toArray('.items > li');
const new_item_TL = gsap.timeline({
    delay:.5,  
    scrollTrigger:{
        trigger:'.new_item_wrap',
        start:'top top',
        end:'+=4000',
        scrub:1,
        pin:true, 
        snap: 1/3,

    }
})
new_items.forEach((el,idx)=>{
    if(idx !==0) {
        let new_item_img = el.childNodes[1].children[0];
        let new_item_txt = el.childNodes[1].children[1];
        new_item_TL.to(el,{
            left:0,
            //ease:'Power3.easeInOut',
            stagger:1.15,
            //스케일키우기
        })
        new_item_TL.to(new_item_img,{
            scale : 1,
            stagger:1.15,
        },">-.3")
        /*new_item_TL.to(new_item_txt,{
            skewY:'0deg',
            stagger:1.15,
        },">-.3")*/
    }

})

/*Best seller 마우스커서변형*/
const bestItem_swiper = new Swiper(".bestItem_swiper",{
	slidesPerView: 'auto',
	loop: true,
	touchRatio: 1.2,
	spaceBetween: 15,
	effect: 'slide',
    //reverseDirection:false,
	/*
	freeMode: {
		enabled: true
	},
	mousewheel: {
		sensitivity: .5,
	}*/

})
//(function () {

const bestSeller_cursor_x = gsap.quickSetter(bestSeller_cursor, 'x', 'px');
const bestSeller_cursor_y = gsap.quickSetter(bestSeller_cursor, 'y', 'px');
bestSeller_slider.addEventListener('pointermove',(e)=>{
    gsap.to(bestSeller_cursor,{
        x:bestSeller_cursor_x(e.x),
        y:bestSeller_cursor_y(e.y),
        opacity: 1,
        scale:1.2,
    })

})
bestSeller_slider.addEventListener('mouseleave',()=>{
    gsap.to(bestSeller_cursor,{
        opacity:0,
    })
})
 
const best_img = document.querySelector('.best_img');
const hide_img = document.querySelector('.hide');
let ratio_chk = true;
let ratio;
let ratio2;
document.querySelector('.best_img').addEventListener('drag',(e)=>{
    ratio = Math.round((e.offsetY/best_img.clientHeight)*100);
    if(ratio > 0) {
        ratio2 = ratio;
    } 
    gsap.to(hide_img,{
        //duration:.5,
        ease:'power1.out',
        height:`${ratio2}%`
    })
    if(!ratio_chk) {
        gsap.to(hide_img,{
            //duration:.5,
            ease:'power1.out',
            height:0
        })
        ratio_chk = true
    }
})

document.querySelector('.best_img').addEventListener('dragleave',(e)=>{
    if(ratio2 < 50) {
        gsap.to(hide_img,{
            //duration:.5,
            ease:'power1.out',
            height:0
        })
    }else {
        gsap.to(hide_img,{
            //duration:.5,
            ease:'power1.out',
            height:'100%',
            onComplete:()=>{
                ratio_chk = false
            }
        }) 

    }

})

/*전시 텍스트*/
const collection = gsap.timeline({
    scrollTrigger: {
        trigger:'#collection',
        start:'10% 80%',
        end:'top bottom',
        //scrub:1,
        toggleActions: "play none reverse none", // 진입, 떠났을때, 다시돌아와서엔터에 들어왔을때, 떠났을때
        //markers:true
    }
});

//gsap.utils.toArray('.explain_wrap span').forEach(el =>{
collection.to('.explain_wrap span',{
    y:'0%',
    duration:1,
},0)
//})

/*전시 비디오*/
collection.to('.video_wrap > video',{
    //height:'100%',
    y:'0%',
    duration:2,  
    ease:'power1.out'

},0)

const cursor_wrap = document.querySelector('.schedule_warp');
const schedule_list = document.querySelectorAll(".schedule .list");
let cursor_list = document.querySelector('.cursor_list_wrap');
let cursor_move = document.querySelector('.cursor_move');

schedule_list.forEach((el,idx) =>{
    el.addEventListener('mouseenter',()=>{
        cursor_list.style.transform = `translateY(${idx * -100}%)`;
        document.querySelector('.cusor_hover_wrap').style.opacity = 1;

    })
})
document.querySelector('.schedule').addEventListener('mouseleave',()=>{
    document.querySelector('.cusor_hover_wrap').style.opacity = 0;
})

/*banner 이동버튼*/
const elHarf = .5;
const banner_wrap = document.querySelector('.banner');
const banner_btn = document.querySelector('.info_btn');

banner_wrap.addEventListener('mousemove',(e)=>{
    let Nx = (e.offsetX/banner_wrap.clientWidth - elHarf) * 200;
    let Ny = (e.offsetY/banner_wrap.clientHeight - elHarf) * 200;
    gsap.to(banner_btn,{
        duration: 1,
        x:Nx,
        y:Ny,
        ease: "slow(0.15, 0.9)"
    })

})
banner_wrap.addEventListener('mouseout',()=>{
    gsap.to(banner_btn,{
        duration:1,
        ease: "slow(0.15, 0.9)",
        x:0,
        y:0,
    })
})

const nav_play_func = nav_btn();
document.querySelector('.hamburger-lines').addEventListener('click',()=>{
    nav_play_func.play();
})
window.addEventListener('scroll',()=>{
    nav_play_func.timeScale(1.5);
    nav_play_func.reverse();
})

