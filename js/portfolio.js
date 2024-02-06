/*포트폴리오 텍스트 아치형으로 만들기 */
const text_arc = () =>{
    document.querySelector('.portfolio').style.opacity = 1;
    const circle_innerText = document.querySelector('.portfolio p');
    const s_circle = document.querySelector('.circle_s').offsetWidth;
    circle_innerText.innerHTML = circle_innerText.innerText.split("")
    .map((char,i)=> i !== 8 ? `<span style="transform:rotate(${(i+1) * 8}deg)">${char}</span>` : `<span style="transform:rotate(${(i+1) * 7.7}deg)">${char}</span>`)
    .join("");

    const circle_inner_span = document.querySelectorAll('.portfolio span');
    circle_inner_span.forEach((el)=>{
        el.style.transformOrigin = `0 ${s_circle/1.8}px`;
    })
}


/* 슬라이드 아이템 호버시 효과주기 */
const hover_slide=()=>{

    const slide_item_func = (title_wrap,show_info,hover_info) =>{
        const item_hover_tl = gsap.timeline({paused:true});
        item_hover_tl.to(title_wrap,{
            width:'92%',
            bottom:'6%',
            left:'4%',
            backgroundColor:'#fff',
            ease:'power1.in',
            duration:.4
        },'hover')
        item_hover_tl.to(show_info,{
            opacity:0,
            duration:.1,
        },'hover -=.5')
        item_hover_tl.to(hover_info,{
            opacity:1,
            color:'#000',
           // duration:.1,
        },'hover')

        return item_hover_tl;
    }


    const slide_item = gsap.utils.toArray('.item_wrap .item');
    slide_item.forEach(el=>{
        const title_wrap =el.childNodes[3];
        const hover_anim = slide_item_func(title_wrap,title_wrap.children[0],title_wrap.children[1]);
        
        el.addEventListener('mouseenter',()=>{
            hover_anim.timeScale(1);
            hover_anim.play();
        });
        el.addEventListener('mouseleave',()=>{
            hover_anim.timeScale(2);
            hover_anim.reverse();
        });
    })
}




/* 슬라이드 아이템 클릭시 세부내용 보여주기 */

const click_slide_item = document.querySelectorAll('.item');
const slide_item_inner = document.querySelectorAll('.item_inner');

function click_slide_inner(inner_div){
    const item_inner_tl = gsap.timeline({paused:true});
    item_inner_tl.to('.background_filter',{
        opacity:1,
        zIndex:1000,
        duration:.5,
    },'tt')
    item_inner_tl.to('.item_inner_wrap',{
        opacity:1,
        zIndex:1004,
        display:'block',
        onComplete:()=>{
            document.querySelector('.main').classList.add('inner')
        },
    },'tt')

    item_inner_tl.to(inner_div,{
        opacity:1,
        duration:.7,
        zIndex:2
    })

    return item_inner_tl;
}

click_slide_item.forEach((slide,idx)=>{
    const inner_para = slide_item_inner[idx];
    const click_slide_inner_func = click_slide_inner(inner_para);
    slide.addEventListener('click',(e)=>{
        click_slide_inner_func.timeScale(1);
        click_slide_inner_func.play();
    })

    /*close 버튼클릭*/
    slide_item_inner.forEach(el=>{
        const close_btn = el.querySelector('.close_wrap');
        close_btn.addEventListener('click',()=>{
           
            click_slide_inner_func.timeScale(2)
            click_slide_inner_func.reverse();
            setTimeout(() => {
                document.querySelector('.main').classList.remove('inner')
            }, 300);
            
        })
    })
})


/*mousemove시 circle 이동*/
const point_circle = document.querySelector('.point_circle');
const gird_circles = document.querySelectorAll('.nav_item');

gird_circles.forEach((circle,idx) =>{
    const firstCircle_x = gird_circles[0].offsetLeft;
    const firstCircle_y = gird_circles[0].offsetTop;
    circle.addEventListener('mouseenter',()=>{
       if(idx !== 0) {
        gird_circles[0].style.color = '#fff';
        gsap.to(point_circle,{
            x:circle.offsetLeft,
            y:circle.offsetTop,
            duration:.7
        })
        gsap.to(gird_circles[idx],{
            color:'#000',
            duration:.1
        },">-.5")
       }

    })
    circle.addEventListener('mouseleave',()=>{
        if(idx !==0) {
            gird_circles[0].style.color = '#000';
            gsap.to(point_circle,{
                x:firstCircle_x,
                y:firstCircle_y,
                duration:.7,
                ease:'power1.in'
                
            })
            gsap.to(gird_circles[idx],{
                 color:'#fff',
                 duration:.1
             },">-.5")
        }

    })
})
/*슬라이드*/
const slide_func = () =>{
    const sliders = [...document.querySelectorAll('.slider')];
    sliders.forEach((slider)=>{
        let isDragStart = false;
        let isDragging = false;
        let isSlide = false;
        let prevPageX,prevScrollLeft,positionDiff;
        const sliderItem = slider.querySelectorAll('.item');
    
    
        const dragStar=(e)=>{
            if(isSlide) return;
            isSlide = true;
            isDragStart = true;
            prevPageX = e.pageX || e.touches[0].pageX;
            prevScrollLeft = slider.scrollLeft;
            setTimeout(() => {
                isSlide = false
            }, 700);
    
        }   
    
        const dragging = (e) =>{
            if(!isDragStart) return;
    
            isDragging = true;
            slider.classList.add('dragging');
            positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
            slider.scrollLeft = prevScrollLeft - positionDiff;
            e.preventDefault();
        }
    
        const dragStop = () =>{
            isDragStart = false;
            slider.classList.remove('dragging')
            if(!isDragging) return;
            isDragging = false;
    
            
        }

        slider.addEventListener("mousedown", dragStar);
        slider.addEventListener("touchstart", dragStar);
    
        slider.addEventListener("mousemove", dragging);
        slider.addEventListener("touchmove", dragging);
    
        slider.addEventListener("mouseup", dragStop);
        slider.addEventListener("touchend", dragStop);
        slider.addEventListener("mouseleave", dragStop);


    })
    let item_width = document.querySelectorAll('.item')[0].clientWidth;
    document.querySelector('.slider').style.width = `${innerWidth - (item_width/2.6)}px`
}
window.addEventListener('load',()=>{
    text_arc();
    slide_func();
    hover_slide();
});
window.addEventListener('resize',()=>{
    slide_func();
})


/*lottie icon*/

const lottieAni = bodymovin.loadAnimation({
    container: document.querySelector('.drag_icon'), // 필수, 애니메이션 들어가는 곳 
    path: 'https://lottie.host/cac1deaf-c5f3-4bba-a2f6-8cd89c462f9b/eWMhNPPD9Y.json',// 필수(url 또는 json파일 다운로드 경로)
    renderer: 'svg', // 필수
    loop: true, // 반복재생
    autoplay: true // 자동재생
  });
