//1. gnb 마우스오버, 포커스시 밑줄 => span.bar
$(function(){ 
    $('.gnb li a').on('mouseenter focus', function(){//focus 탭으로 이동했을때
        let bar = $(this).position().left;
        let widthNum = $(this).width();
        $('span.bar').css({'left':bar+'px','width':widthNum+'px', 'opacity':1})
    })

    $('.gnb li a').on('mouseleave', function(){
        $('span.bar').css({'left':0,'width':0, 'opacity':0})
    })
})