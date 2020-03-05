"use strict";

function App() {
    this.init();
}

document.addEventListener('DOMContentLoaded',function() {
    new App();
});

App.prototype.init = function () {
    this.polyfillClosest();
    new Search();
    new Menu();
    new OfferBanner(document.querySelector('.extraOff'));
    new Filter(document.querySelector('.formFilter'));
    new ProductOptions(document.querySelector('.listOptions'));
    new Thumbnail(document.querySelector('.tumbs'));
    new Bag(document.querySelector('.addToBag'));
    if (window.localStorage && window.sessionStorage) {
        this.storage();
    }
    new Shop(document.querySelector('.shoppingBag'));
};
App.prototype.storage = function () {
    this.localStorageCommonPrice = (localStorage.commonPrice) ? localStorage.commonPrice : "";
    this.localStorageCountItems = (localStorage.countItems) ? localStorage.countItems : "";
    document.querySelector('.commonPrice').innerHTML = '£' + this.localStorageCommonPrice + '<span class="countItems">('+ this.localStorageCountItems +')</span>';
    var storageArr = [this.localStorageCommonPrice, this.localStorageCountItems];
    return storageArr;
};

App.prototype.polyfillClosest = function () {
    if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector;
    if (!Element.prototype.closest) Element.prototype.closest = function (selector) {
        var el = this;
        while (el) {
            if (el.matches(selector)) {
                return el;
            }
            el = el.parentElement;
        }
    };
};

Search.prototype = Object.create(App.prototype);
Menu.prototype = Object.create(App.prototype);
Filter.prototype = Object.create(App.prototype);
OfferBanner.prototype = Object.create(App.prototype);
ProductOptions.prototype = Object.create(App.prototype);
Thumbnail.prototype = Object.create(App.prototype);
Bag.prototype = Object.create(App.prototype);
Shop.prototype = Object.create(App.prototype);

window.addEventListener('resize', function(event){
    new OfferBanner(document.querySelector('.extraOff'));
});
//HEADER

//Search
function Search() {
    this.searchButton = document.querySelector('.searchButton');
    this.searchButton.addEventListener('click', this.openSearch.bind(this));
}

Search.prototype.openSearch = function () {
    document.querySelector('.search').classList.toggle('openSearch');
    document.querySelector('.searchForm').classList.toggle('display');
};

//Menu
function Menu () {
    this.hamburger = document.querySelector('.mobileMenu');
    this.nav = document.querySelector('.nav');
    this.hamburger.addEventListener('click', this.openMenu.bind(this));
}

Menu.prototype.openMenu = function (e) {
    e.preventDefault();

    document.querySelector('.header').classList.toggle('openMenu');
    this.nav.classList.toggle('display');
};

// END HEADER

// ITEM PAGE

//Bag
function Bag (button) {
    if (!button) return;

    this.buttonAdd = button;
    this.cart =  (localStorage.cart) ? JSON.parse(localStorage.cart) : {};
    this.buttonAdd.addEventListener('click', this.addGoose.bind(this));
}

//Tumb
function Thumbnail(thumbnail) {
    if (!thumbnail) return;

    this.thumbnailBlock = thumbnail;
    this.fullImg = document.querySelector('.fullItem').querySelector('img');
    this.thumbnailBlock.addEventListener('click', this.doFullImg.bind(this));
}

Thumbnail.prototype.doFullImg = function (e) {
    var target = e && e.target || e.srcElement;

    if (!target.parentNode.querySelector('img')) return;
    this.fullImg.src = target.parentNode.querySelector('img').src;
};


//Product
function ProductOptions (list) {
    if (!list) return;
    this.options = document.querySelector('.rowOptionsProduct ');
    this.options.addEventListener('click', this.addClassToOption.bind(this));
}

ProductOptions.prototype.addClassToOption = function (e) {
    var target = e && e.target || e.srcElement;
    var listOption = target.parentNode;
    if (target.tagName != 'LI') return;
    for (var i = 0; i < listOption.children.length; i++) {
        listOption.children[i].classList.remove('activeOption');
    }
    target.classList.add('activeOption');
};

//Bag

Bag.prototype.addGoose = function (e) {
    e.preventDefault();
    var quantityOfItems = 0;
    var price = 0;

    if (document.querySelectorAll('.activeOption').length === document.querySelectorAll('.listOptions').length) {
        document.querySelector('.chooseOptions').classList.remove('display');
        document.querySelector('.addedGoose').classList.remove('display');
        this.addCart(e);

        for (var key in this.cart) {
            quantityOfItems++;
            price += +this.cart[key].price.split('£')[1]*this.cart[key].quantity;
        }

        localStorage.countItems = quantityOfItems;
        localStorage.commonPrice = price;
        document.querySelector('.commonPrice').innerHTML = '£ ' + localStorage.commonPrice + '<span class="countItems"> ('+ localStorage.countItems  +')</span>';
        document.querySelector('.addedGoose').classList.add('display');
    } else {
        document.querySelector('.chooseOptions').classList.add('display');
    }
};

Bag.prototype.addCart = function (e) {
    var productName = document.querySelector('.nameProduct').innerText,
        productPrice = document.querySelector('.priceItem').innerText,
        productSize = document.querySelector('.sizeOptions').querySelector('.activeOption').innerText,
        productColor = document.querySelector('.colorOptions').querySelector('.activeOption').innerText,
        id = document.querySelector('.nameProduct').getAttribute('data-nameProduct'),
        imgProduct = document.querySelector('.fullItem').querySelector('img').getAttribute('src'),
        uniqId = id + "-"+productColor + ' '+ productSize;
    uniqId = uniqId.replace(/\s/g, '-');

    if (this.cart[uniqId]) {
        this.cart[uniqId].quantity += 1;
    } else {
        this.cart[uniqId] = {
            product: productName,
            price: productPrice,
            size: productSize,
            color: productColor,
            id: id,
            img: imgProduct,
            quantity: 1
        };
    }

    var obj = JSON.stringify(this.cart);
    localStorage.cart = obj;
};

function OfferBanner (offer) {
    if (!offer) return;
    this.offer = offer;
    this.itemImg = document.querySelectorAll('.arrivalItem')[0];
    this.itemImg.style.cssText= 'margin-bottom:' + (this.offer.clientHeight/2.5) + 'px;';
}

//Filter
function Filter (filter) {
    if (!filter) return;

    this.filterForm = filter;
    this.tabletLabel = document.querySelector('.filterTablet');
    this.desktopSelects = document.querySelector('.desktopSelects');
    this.selectItems = document.querySelectorAll('.selectItem');
    this.options = this.filterForm.querySelectorAll('option');
    this.tabletLabel.addEventListener('click', this.openFilter.bind(this));

    this.ww = window.innerWidth;
    if (this.ww > 1024) {
        this.desktopToggle();
    } else {
        this.mobileSelectedOptions();
    }
}
Filter.prototype.openFilter = function () {
    this.desktopSelects.classList.toggle('mobileSelects');
};

Filter.prototype.openSelect = function (e) {
    var target = e && e.target || e.srcElement;

    if (target.parentNode.getAttribute('class') != 'selectLabel') return;

    target = target.parentNode.parentNode;
    for (var i = 0; i < this.selectItems.length; i++) {
        if (this.selectItems[i] != target) {
            this.selectItems[i].querySelector('select').classList.remove('display');
        }
    }
    target.querySelector('select').classList.toggle('display');

    var optionLength = target.querySelector('select').children.length;
    target.querySelector('select').setAttribute('size', optionLength);
};
Filter.prototype.desktopToggle = function () {
    this.desktopSelects.addEventListener('mouseover', this.openSelect.bind(this));

    for (let i = 0; i < this.options.length; i++) {
        this.options[i].closest('select').addEventListener('click', this.closeSelect.bind(this));
    }
};
Filter.prototype.closeSelect = function (e) {
    var target = e && e.target || e.srcElement;

    this.valueFilter = target.closest('.selectItem').querySelector('.valueFilter');
    this.nameFilter = target.closest('.selectItem').querySelector('.nameFilter');

    target.closest('select').classList.remove('display');

    target = (target.tagName == 'SELECT') ? target(target.options.selectedIndex) : target;
    var optionVal = (target.value === 'notSelected') ?
        this.filterStyles('remove', '', target) :
        this.filterStyles('add', target.innerText, target);

    return optionVal;

};
Filter.prototype.filterStyles = function (method, value, option) {
    console.log(value ,option);
    var firstItem = document.querySelector('.desktopSelects').firstElementChild;
    var lastItem = document.querySelector('.desktopSelects').lastElementChild;

    option.closest('.selectItem').classList[method]('selectedItem');
    this.nameFilter.classList[method]('nameFilterSmall');
    this.valueFilter.innerHTML = value;


    if (option.closest('.selectItem') === firstItem) {
        document.querySelector('.filter').classList[method]('firstSelected');
    }
    if (option.closest('.selectItem') === lastItem) {
        document.querySelector('.filter').classList[method]('lastSelected');
    }

};
Filter.prototype.mobileSelectedOptions = function () {
    this.filterTablet = document.querySelector('.filterTablet');

    for (var j = 0; j < this.selectItems.length; j++) {
        this.selectItems[j].querySelector('select').children[0].setAttribute('selected', 'selected');
        this.filterTablet.innerHTML +=  this.selectItems[j].querySelector('select').children[0].innerHTML + ',';
    }
};
document.onmouseover = function(event) {
    let container = document.querySelector(".desktopSelects");
    if (!container) return;

    if (!container.contains(event.target)) {
        let items = container.querySelectorAll("select");
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove("display");
        }
    }
};


//Shop


function Shop (shop) {
    if (!shop) return;
    this.shop = shop;
    this.buttonBuy = document.querySelector('.buyNow');
    this.totalCost = document.querySelector('.totalCost');
    this.emptyBag = document.querySelector('.emptyBag');
    this.cart =  (localStorage.cart) ? JSON.parse(localStorage.cart) : {};
    this.checkEmpty();
    var str = '';
    this.buttonBuy.addEventListener('click', this.buyGoose.bind(this));
    this.emptyBag.addEventListener('click', this.clearBag.bind(this, ''));
    this.totalSum();

    for (var key in this.cart) {
        str = this.createItem(this.cart[key], key);
        document.querySelector('.shopItems').insertAdjacentHTML('beforeEnd', str);
    }

    this.removeButton = document.querySelectorAll('.removeItem');

    for (var i = 0; i < this.removeButton.length; i++) {
        this.removeButton[i].addEventListener('click', this.removeItem.bind(this));
    }
}

Shop.prototype.createItem = function (item, key) {
    var str = '<div class="shoppingBlock " data-block="'+ key +'">'+
        '<div class="item-image">'+
        '<div class="shopImg">'+
        '<img src="' + item.img + '" alt="">'+
        '</div>'+
        '<div class="viewCover">'+
        '<a href="Item.html" <p class="quickView">Edit item</p><a>'+
        '</div>'+
        '</div>'+
        '<div class="shopOptions">'+
        '<p class="titleProduct"><a href="item1.html" class="productBag">' + item.product + '</a></p>'+
        '<p class="priceBag">' + item.price + '</p>'+
        '<p class="optionBag">Color: <span class="colorBag">' + item.color + '</span></p>'+
        '<p class="optionBag">Size: <span class="sizeBag">' + item.size +'</span></p>'+
        '<p class="optionBag">Quantity: <span class="quantityBag">' + item.quantity +'</span></p>'+
        '<p class="removeItem">Remove Item</p>'+
        '</div>'+
        '</div>';
    return str;
};
Shop.prototype.buyGoose = function (e) {
    e.preventDefault();
    this.clearBag();
    document.querySelector('.shopItems').innerHTML = '<p class="thanks">Thank you for your purchase</p>';
    this.totalSum();
};

Shop.prototype.removeItem = function (e) {
    var target = e && e.target || e.srcElement,
        item = target.closest('.shoppingBlock'),
        data = item.getAttribute('data-block'),
        price = 0,
        quantityOfItems = 0;

    item.parentNode.removeChild(item);
    delete this.cart[data];

    var object = JSON.stringify(this.cart);
    localStorage.cart = object;

    this.cart =  (localStorage.cart) ? JSON.parse(localStorage.cart) : {};
    for (var key in this.cart) {
        quantityOfItems++;
        price += +this.cart[key].price.split('£')[1]*this.cart[key].quantity;
    }

    localStorage.countItems = quantityOfItems;
    localStorage.commonPrice = price;
    document.querySelector('.commonPrice').innerHTML = '£' + localStorage.commonPrice + '<span class="countItems">('+ localStorage.countItems  +')</span>';
    this.checkEmpty();
    this.totalSum();
};


Shop.prototype.clearBag = function (param, e) {
    if (e) e.preventDefault();

    localStorage.clear();
    document.querySelector('.commonPrice').innerHTML = '';

    if (param == '') {
        this.emptyInfo();
        this.totalSum();
    }
};

Shop.prototype.emptyInfo = function () {
    document.querySelector('.shopItems').innerHTML = '<p class="empty">Your shopping bag is empty. Use Catalog to add new items</p>';
};

Shop.prototype.checkEmpty = function () {
    if (localStorage.cart == '{}' ||localStorage.cart == undefined) {
        this.emptyInfo();
    }
};
Shop.prototype.totalSum = function () {
    this.totalCost.innerHTML = localStorage.commonPrice ? ('£ ' + localStorage.commonPrice) : '£ 0';
};


