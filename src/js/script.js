'use strict';

/**
 * 
 * для добавления анимаций достаточно добавить в html код атрибут data-animate со следующим значением
 * 
 * appearence - для появления элемента засчет изменения прозначности
 * 
 * appearence-left - для появления элемента засчет изменения прозрачности с выездом слева
 * 
 * appearence-right - для появления элемента засчет изменения прозрачности с выездом справа
 * 
 * appearence-list - для поочередного появления засчет изменения прозначности элементов с тэгом li, вложенных в данный корневой элемент
 */

//  {ref, offsetY, animation, delay}
const scrollCfg = []

// проверяем величину прокрутки и запускаем анимации
document.addEventListener('scroll', (event) => {
    scrollCfg.forEach((item, index) => {
        if (window.pageYOffset >= item.offsetY) {
            onScroll(item.ref)
            scrollCfg.splice(index, 1)
        }
    })
})

document.querySelectorAll('[data-animate]').forEach(item => {

    switch (item.getAttribute('data-animate')) {
        case 'appearence':
            appearance({
                target: item
            })
            break
        case 'appearence-left':
            appearance({
                target: item,
                direction: 'left'
            })
            break
        case 'appearence-right':
            appearance({
                target: item,
                direction: 'right'
            })
            break
        case 'appearence-list':
            item.querySelectorAll('li').forEach((elem, ind) => {
                appearance({
                    target: elem,
                    delay: (ind + 1) / 2 + 0.1
                })
            })
            break
    }
})

// Promo
const promoCfg = {}

promoCfg.target = document.querySelector('#promo')
parallax(promoCfg)


// Обработчик события scroll

function onScroll(element) {
    element.style.animationPlayState = 'running'
}

// Добавляет на элемент анимацию паралаксаы

function parallax ({target}) {
    var scrollPosition = 0;

    document.addEventListener('scroll', function(){
        scrollPosition = 100 + (window.pageYOffset) / 200
        target.style.backgroundSize = scrollPosition + '%'; 
    });
}

// Добавляет на элемент анимацию появления

function appearance ({target, direction, delay}) {

    if (delay) {
        target.style.animationDelay = delay + 's'
    }

    switch (direction) {
        case 'left':
            target.classList.add('animate-appearence-left')
            break
        case 'right':
            target.classList.add('animate-appearence-righgt')
            break
        default:
            target.classList.add('animate-appearence')
    }
    
    scrollCfg.push({
        ref: target,
        offsetY: target.offsetTop - document.documentElement.clientHeight,
        delay: delay
    })
}