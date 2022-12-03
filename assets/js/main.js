let cart = {
    //выбранный тип оплаты
    payment_type: {
        id: '0',
        type: 'MIR',
        card_number: '1234 56•• •••• 1234',
    },
    //выбранный тип доставки
    delivery_type: {
        id: '3',
        type: 1,
        point_issue: 'Бишкек, улица Табышалиева, 57'
    },
    day: 5,
    //элементы, что есть в наличии
    data: [
        {
            id: 0,
            //количество выбранного товара к доставке
            count: 1,
            //сколько сть на складе.
            max_in_stock: "infinity",
            //все скидки
            discount_persent: {
                fullbuyer: 50,
                discount: 0,
            },
            //цена со скидкой и без
            price: {
                one: 1051,
                full: 1051,
                discount: 526,
            },
            selected: true
        },
        {
            id: 1,
            count: 200,
            max_in_stock: "infinity",
            discount_persent: {
                fullbuyer: 55,
                discount: 10,
            },
            price: {
                one: 11500,
                full: 11500,
                discount: 4025,
            },
            selected: true
        },
        {
            id: 2,
            count: 2,
            max_in_stock: 2,
            discount_persent: {
                fullbuyer: 55,
                discount: 0,
            },
            price: {
                one: 475,
                full: 475,
                discount: 214,
            },
            selected: true
        },
    ]
}

function makeMoney(n) {
    return n.toString().split('').reverse().join('') 
    .match(/\d{0,3}/g).join(' ')
    .split('').reverse().join('').trim()
}

function toggleSection(e) {
    const head = e.closest('.selected_section')
    const p = document.getElementById('selected_section__p')
    const checkbox = document.getElementById('selected_section__checkbox')

    let price_total = 0
    let count_total = 0
    cart.data.map(item => {
        if (item.selected) {
            price_total += Number(item.price.discount)
            count_total += Number(item.count)
        }
    })
    if (e.dataset.head) {
        if (head.classList.contains('open')) {
            checkbox.style.display = 'none'
            p.style.display = 'flex'
            p.innerHTML =  `${count_total} товаров · ${makeMoney(price_total)} сом`
        } else {
            checkbox.style.display = 'flex'
            p.style.display = 'none'
        }
    }
    head.classList.toggle('open')
}

function deleteItem(e) {
    //удаляет компонент при клике на иконку корзины
    let id = Number(e.dataset.id)
    e.closest('article.item').remove()
    cart = {
        ...cart,
        data: cart.data.filter(item => item.id !== id)
    }
    totalPriceСalculation()
    cartCreator()
}

function toLikeItem(e) {
    //Ставит лайк на выбранный компонент в корзине
    e.classList.toggle("liked")
}


function removeNonSaveSelectedType(parentId) {
    //При закрытии модальных окон без сохранения
    // мы возвращаем все radio type в изначальное положение
    setTimeout(() => {
        if (parentId === 'modal_payment_outer') {
            document.getElementById(`payment_type__${cart.payment_type.id}`).checked = true
        }
        if (parentId === 'modal_delivery_outer') {
            changeDeliveryToHeadType(cart.delivery_type.type)
            document.getElementById(`delivery_type__${cart.delivery_type.id}`).checked = true
        }
    }, 300)
}

let modal

function openModal(type) {
    //открытие модального окна
    modal = document.getElementById(`modal_${type}_outer`)
    modal.classList.add('open')
}

function closeModal(e) {
    //закрытие модальных окон через "крестик"
    let parent = e.closest('.open')
    parent.classList.remove('open')
    removeNonSaveSelectedType(parent.id)
}

document.addEventListener('click', function(e) {
    //закрытие модальных окон, если клик произошел на полупрозрачный фон
    if (e.target === modal) {
        modal.classList.remove('open')
        removeNonSaveSelectedType(modal.id)
    }
})

function changeDeliveryToHeadType(id) {
    //переключение типов доставки
    document.getElementById(`delivery_type_head__${id}`).classList.add('selected')
    document.getElementById(`delivery_type_head__${id === 0 ? 1 : 0}`).classList.remove('selected')
    document.getElementById(`delivery_type_body__${id}`).classList.add('selected')
    document.getElementById(`delivery_type_body__${id === 0 ? 1 : 0}`).classList.remove('selected')
}

function changeDeliveryType() {
    //сохранение выбранного radiotype в доставке
    let delivery_type = document.querySelector('article input[type=radio][name=delivery_type]:checked');

    cart.delivery_type.type = delivery_type.closest('.selected').dataset.id
    cart.delivery_type.id = delivery_type.value
    cart.delivery_type.point_issue = delivery_type.dataset.issue

    //закрытие модального окна
    modal.classList.remove('open')

    //обновление данных
    document.getElementById('delivery_main').innerHTML = cart.delivery_type.point_issue + 
    `<br><span><i class="star"></i> 4.99  Ежедневно с 10 до 21 </span>`
    document.getElementById('delivery_aside').innerHTML = cart.delivery_type.point_issue
}

function changePaymentType() {
    //сохранение выбранного radiotype в оплате
    let payment_type = document.querySelector('input[type=radio][name=payment_type]:checked');

    cart.payment_type.id = payment_type.dataset.id
    cart.payment_type.type = payment_type.value
    cart.payment_type.card_number = payment_type.dataset.payment
    
    //закрытие модального окна
    modal.classList.remove('open')

    //обновление данных
    const new_payment = `
    <img src="./assets/images/payment_type/${cart.payment_type.type}.jpg" alt="">
    <p>${cart.payment_type.card_number}</p>
    `

    document.getElementById('payment_type__card').innerHTML = new_payment + `<p>01/30</p>`
    document.getElementById('aside_card_selected').innerHTML = new_payment
}

function newItemCount(id, value) {
    cart.data.map(item => {
        if (item.id === id) {
            item.count = value
        }
    })
}

function minus(e) {
    const input = document.getElementById(`item_right__counter_${e.dataset.id}`)
    
    let newValue = input.value = Number(input.value) - 1
    
    if (newValue <= 1) {
        input.value = 1
        e.disabled = true
    } else {
        input.value = newValue
        document.getElementById(`plus_${e.dataset.id}`).disabled = false
    }
    if (newValue == 1) {
        document.getElementById(`plus_${e.dataset.id}`).disabled = false
    }

    newItemCount(Number(input.dataset.id), newValue)
    priceСalculation(Number(input.dataset.id))
    cartCreator()
}

function plus(e) {
    const input = document.getElementById(`item_right__counter_${e.dataset.id}`)
    let newValue = Number(input.value) + 1

    let max = e.dataset.max
    if (newValue >= 1) {
        document.getElementById(`minus_${e.dataset.id}`).disabled = false
    }
    if (newValue != max) {
        input.value = newValue
    } else {
        input.value = max
        e.disabled = true
    }

    newItemCount(Number(input.dataset.id), newValue)
    priceСalculation(Number(input.dataset.id))
    cartCreator()
}

function typeCount(e) {
    let input = Number(e.value.replace(/[^\d.]/g, ''))
    let minus = document.getElementById(`minus_${e.dataset.id}`)
    let plus = document.getElementById(`plus_${e.dataset.id}`)
    let max = plus.dataset.max

    if (input <= 1) {
        minus.disabled = true
        e.value = 1
    } else {
        minus.disabled = false
    }

    if (max !== "infinity") {
        if (input >= max || input === max) {
            plus.disabled = true
            e.value = max
        } else {
            plus.disabled = false
        }
    }

    newItemCount(Number(e.dataset.id), e.value)
    priceСalculation(Number(e.dataset.id))
    cartCreator()
}

function selectAll(e) {
    cart.data.map(item => {
        item.selected = e.checked
        document.getElementById(`selected_checkbox_${item.id}`).checked = e.checked
        const price = item.price.one * item.count
        const pricePersent = price / 100

        let discount_1 = 0
        let discount_2 = 0

        if (item.discount_persent.discount) {
            discount_1 = pricePersent * item.discount_persent.discount
        }

        if (item.discount_persent.fullbuyer) {
            discount_2 = pricePersent * item.discount_persent.fullbuyer
        }

        const discount = discount_1 + discount_2
        const priceWithDiscoutn = price - discount

        item.price.full = price.toFixed(0)
        item.price.discount = priceWithDiscoutn.toFixed(0)
    })
    totalPriceСalculation()
    cartCreator()
}

function selectItem(id) {
    cart.data.map(item => {
        if (item.id === id) {
            item.selected = !item.selected
        }
    })
    document.getElementById(`selected_checkbox`).checked = 
    cart.data.every( ( value ) => value.selected === true )
    totalPriceСalculation()
    cartCreator()
}

function priceСalculation(id) {
    const full_price_desktop = document.getElementById(`full_price_${id}_desktop`)
    const price_desktop = document.getElementById(`price_${id}_desktop`)
    const full_price_mobile = document.getElementById(`full_price_${id}_mobile`)
    const price_mobile = document.getElementById(`price_${id}_mobile`)
    const tooltip = document.getElementById(`tooltip_${id}`)

    cart.data.map(item => {
        if (item.id === id) {
            const price = item.price.one * item.count
            const pricePersent = price / 100

            let discount_1 = 0
            let discount_2 = 0

            if (item.discount_persent.discount) {
                discount_1 = pricePersent * item.discount_persent.discount
            }

            if (item.discount_persent.fullbuyer) {
                discount_2 = pricePersent * item.discount_persent.fullbuyer
            }

            const discount = discount_1 + discount_2
            const priceWithDiscoutn = price - discount

            if (String(price).length - 1 >=7) {
                full_price_desktop.style.fontSize = '10px'
                full_price_mobile.style.fontSize = '10px'
            } else if (String(price).length - 1 >=5) {
                full_price_desktop.style.fontSize = '14px'
                full_price_mobile.style.fontSize = '14px'
            } else {
                full_price_desktop.style.fontSize = '16px'
                full_price_mobile.style.fontSize = '16px'
            }

            if (String(priceWithDiscoutn.toFixed(0)).length - 1 >=7) {
                price_desktop.style.fontSize = '11px'
                price_mobile.style.fontSize = '11px'
            } else if (String(priceWithDiscoutn.toFixed(0)).length - 1 >=5) {
                price_desktop.style.fontSize = '15px'
                price_mobile.style.fontSize = '15px'
            } else {
                price_desktop.style.fontSize = '20px'
                price_mobile.style.fontSize = '20px'
            }

            full_price_desktop.innerHTML = makeMoney(price) + ' com'
            full_price_mobile.innerHTML = makeMoney(price) + ' com'
            price_desktop.innerHTML = makeMoney(priceWithDiscoutn.toFixed(0))
            price_mobile.innerHTML = makeMoney(priceWithDiscoutn.toFixed(0))

            let d1 = ''
            let d2 = ''
            if (discount_1) {
                d1 = `<li>
                    <span>Скидка ${item.discount_persent.discount}%</span>
                    <p>−${(discount_1.toFixed(0))} сом</p>
                </li>`
            }

            if (discount_2) {
                d2 = `<li>
                    <span>Скидка ${item.discount_persent.fullbuyer}%</span>
                    <p>−${makeMoney(discount_2.toFixed(0))} сом</p>
                </li>`
            }

            tooltip.innerHTML = 
            '<ul>' + d1 + d2 + '</ul>'

            item.price.full = Number(price)
            item.price.discount = Number(priceWithDiscoutn.toFixed(0))
        }
    })
    totalPriceСalculation()
}

function totalPriceСalculation() {
    //считаем кол-во товаров для корзины и вводим кол-во товаров
    const cart_desktop = document.getElementById('cart_desktop')
    const cart_mobile = document.getElementById('cart_mobile')

    let countItems = 0
    cart.data.map(item => {
        if (item.selected) {
            countItems++
        }

    })
    cart_desktop.innerHTML = countItems
    cart_mobile.innerHTML = countItems

    // подсчет цены со скидкой, без скидки и общей суммы
    const aside_price_total_w = document.getElementById('aside_price_total')
    const aside_full_price_total_w = document.getElementById('aside_full_price_total')
    const aside_price_discount_w = document.getElementById('aside_price_discount')

    let aside_price_total = 0,
    aside_full_price_total = 0

    cart.data.map(item => {
        if (item.selected) {
            aside_full_price_total += Number(item.price.full)
            aside_price_total += Number(item.price.discount)

        }
    })

    aside_price_total_w.innerHTML = makeMoney(aside_price_total)
    aside_full_price_total_w.innerHTML = makeMoney(aside_full_price_total) + ' com'
    aside_price_discount_w.innerHTML = `−${makeMoney(aside_full_price_total - aside_price_total)} com`
}

function payNow(e) {
    const button = document.getElementById('submit_cart')
    let aside_price_total = 0
    cart.data.map(item => {
        if (item.selected) {
            aside_price_total += item.price.discount
        }
    })
    if (e.checked) {
        button.innerHTML = `Оплатить ${makeMoney(aside_price_total)} сом`
    } else {
        button.innerHTML = 'Заказать'
    }
}
cartCreator()
function cartCreator() {
    let maxCount = 0
    let newCart = []
    let totalItems = 0
    cart.data.map(item => {
        if (maxCount < item.count) {
            maxCount = item.count
        }
    })
    let j = 1
    for(;;) {
        if (maxCount - 184 * j >= 0) {
            j = ++j
        } else {
            break
        }
    }
    let r = 0
    while (j) {
        let c = 0
        let nCart = ''
        cart.data.map(item => {
            if (item.selected) {
                if ((item.count - 184 * r) >= 0) {
                    let count = item.count - 184 * r
                    if (count > 184) {
                        count = count - (item.count - 184 * (r+1))
                    }
                    totalItems++
                    count = count == 1 ? '' : `<span>${count}</span>`
                    nCart += `<li id="delivery_body_li__${r}_${item.id}">` + count + 
                    `<picture>
                        <sourse srcset="./assets/images/product/product_${item.id + 1}.webp" type="image/webp">
                        <sourse srcset="./assets/images/product/product_${item.id + 1}.jpg" type="image/jp2">
                        <img src="./assets/images/product/product_${item.id + 1}.jpg" alt="Футболка UZcotton мужская">
                    </picture>`
                    + '</li>'
                    c++
                }
            }
        })
        r++
        j--
        newCart.push(nCart)
    }
    const ul = document.getElementById('delivery_body__ul')
    let li = ''
    let dayNow = cart.day
    newCart.map(row => {
        if (!!row) {
            li += '<li>' + `<p class="head">${dayNow}—${++dayNow} февраля</p>` + '<ul>' + row + '</ul>' + '</li>'
        }
        dayNow++
    })
    ul.innerHTML = li

    if (totalItems === 0 || totalItems >=5) {
        totalItems = totalItems + ' товаров'
    } else if (totalItems === 1) {
        totalItems = totalItems + ' товар'
    } else {
        totalItems = totalItems + ' товара'
    }
    const totalCount = document.getElementById('count_items').innerHTML = totalItems
}

// 1. Форма
function submitCart() {
    // Имя
    const name = document.getElementById('person_name')
    const name_p = document.getElementById('person_name__p')
    if (!!name.value.length) {
        name.closest('label').classList.remove('error')
        name_p.innerHTML = ''
    } else {
        name_p.innerHTML = 'Укажите имя'
        name.closest('label').classList.add('error')
    }

    // Фамилия
    const surename = document.getElementById('person_surename')
    const surename_p = document.getElementById('person_surename__p')
    if (!!surename.value.length) {
        surename.closest('label').classList.remove('error')
        surename_p.innerHTML = ''
    } else {
        surename_p.innerHTML = 'Введите фамилию'
        surename.closest('label').classList.add('error')
    }

    // Почта
    const mail = document.getElementById('person_mail')
    const mail_p = document.getElementById('person_mail__p')
    if (!!mail.value.length) {
        mail.closest('label').classList.remove('error')
        mail_p.innerHTML = ''
    } else {
        mail_p.innerHTML = 'Укажите электронную почту'
        mail.closest('label').classList.add('error')
    }

    // Номер телефона
    const number = document.getElementById('person_number')
    const number_p = document.getElementById('person_number__p')
    if (!!number.value.length) {
        number.closest('label').classList.remove('error')
        number_p.innerHTML = ''
    } else {
        number_p.innerHTML = 'Укажите имя'
        number.closest('label').classList.add('error')
    }

    // ИНН
    const inn = document.getElementById('person_inn')
    const inn_p = document.getElementById('person_inn__p')
    if (!!inn.value.length) {
        inn.closest('label').classList.remove('error')
        inn_p.innerHTML = ''
    } else {
        inn_p.innerHTML = 'Укажите имя'
        inn.closest('label').classList.add('error')
    }

    if (name.closest('label').classList.contains('error') || surename.classList.closest('label').contains('error')
    || mail.closest('label').classList.contains('error') || number.classList.closest('label').contains('error')
    || inn.closest('label').classList.contains('error')) {
        document.getElementById('recipient_body__form').scrollIntoView({behavior: "smooth"})
    }
}

function validateName(e, type) {
    if (!e.value.length) {
        document.getElementById(`person_${type}__span`).classList.remove('active')
        e.closest('label').classList.remove('error')
        document.getElementById('person_name__p').innerHTML = ''
        document.getElementById('person_surename__p').innerHTML = ''
    } else {
        document.getElementById(`person_${type}__span`).classList.add('active')
        if (e.value === e.value.replace(/[^А-яЁё ]/g, '')) {
            e.closest('label').classList.remove('error')
            document.getElementById('person_name__p').innerHTML = ''
            document.getElementById('person_surename__p').innerHTML = ''
        } else {
            e.closest('label').classList.add('error')
        }
    }
}

function validateMail(e) {
    if (!e.value.length) {
        document.getElementById('person_mail__span').classList.remove('active')
        document.getElementById('person_mail__p').innerHTML = ''
    } else {
        document.getElementById('person_mail__span').classList.add('active')
        if (e.value.match(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/)) {
            e.closest('label').classList.remove('error')
            document.getElementById('person_mail__p').innerHTML = ''
        } else {
            e.closest('label').classList.add('error')
            document.getElementById('person_mail__p').innerHTML = 'Проверьте адрес электронной почты'
        }
    }
}

function validateNumber(e) {
    if (!e.value.length) {
        document.getElementById('person_number__span').classList.remove('active')
        e.closest('label').classList.remove('error')
        document.getElementById('person_mail__p').innerHTML = ''
    } else {
        document.getElementById('person_number__span').classList.add('active')
        let number = e.value.replace(/[^0-9]/g, '')
        if (!e.value.match(/[!@#$&*%]/) && !e.value.match(/[A-Za-z]/)) {
            e.closest('label').classList.remove('error')
            document.getElementById('person_mail__p').innerHTML = ''
            e.value = `+${number.slice(0,1)} ${number.slice(1,4)} ${number.slice(4,7)} ${number.slice(7,9)} ${number.slice(9)}`
        } else {
            e.closest('label').classList.add('error')
            document.getElementById('person_mail__p').innerHTML = 'Формат: +9 999 999 99 99'
        }
    }
}

function validateINN(e) {
    if (!e.value.length) {
        document.getElementById('person_inn__span').classList.remove('active')
        e.closest('label').classList.remove('error')
        document.getElementById('person_inn__p').innerHTML = ''
    } else {
        document.getElementById('person_inn__span').classList.add('active')
        if (e.value === e.value.replace(/[^0-9]/, '').substr(0,10)) {
            e.closest('label').classList.remove('error')
            document.getElementById('person_inn__p').innerHTML = ''
        } else {
            e.closest('label').classList.add('error')
            document.getElementById('person_inn__p').innerHTML = 'Формат: 1234567'
        }
    }
}