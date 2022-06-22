const cart = {
    cookie: {
        add: (data)=>{
            $.cookie('phoneStore', null, {path:'/'})
            $.cookie('phoneStore', JSON.stringify(data), {path:'/'})
        },
        get: () => {
            let data = $.cookie("phoneStore") ? JSON.parse($.cookie("phoneStore")) : [];
            return data;
        },
    },

    show: (config={refresh: 1}) => {
        const data = cart.cookie.get();
        console.log(data)
    },
    getProduct: (t) => {
        let data = {};
    },
    post: (data, callback,final) => {

    },
    getCartData: ()=>{
        let data;
        return data;
    },
    checkout: (btn)=>{
        toastr.info('Đang tạo đơn hàng...')
        $(btn).html(`Đang tạo <div class="spinner-border spinner-border-sm" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>`)
        $(btn).attr('disabled',true)
        const data = cart.getCartData();
        cart.post(data, (res)=>{
            location.href = '/checkout'
        }, function (){
            $(btn).html(`Tiến hành thanh toán`)
            $(btn).attr('disabled',false)
        });
    },
    add: (id) => {
        const numb = parseInt($(".badge-numb-product").eq(0).text());
        const cookies = cart.cookie.get();
        const isLess = (cookies).every((item) => (item != id));
        if (isLess) {
            (cookies).push(id);
            cart.cookie.add(cookies);
            $(".badge-numb-product").html(numb + 1);
        }
        $(".cart-shopping").eq(0).trigger('click')
    },
    remove: (t) => {
        const numb = parseInt($(".badge-numb-product").eq(0).text());
        const cookies = cart.cookie.get();
        const data = cart.getProduct(t);
        if (data.type == 'course') {
            cookies.courses = (cookies.courses).filter((value) => (value != data.id));
            console.log(cookies.courses)
            $(`.card-cart.course[data-product-id=${data.id}]`).remove();
            $(".badge-numb-product").html(numb - 1)
        } else {
            cookies.bundles = (cookies.bundles).filter((value) => (value != data.id));
            $(`.card-cart.bundle[data-product-id=${data.id}]`).remove();
            $(".badge-numb-product").html(numb - 1)
        }
        cart.cookie.add(cookies);
        // cart.show();
        const path = $(location).attr('pathname');
        if (path.includes('checkout')){
            $("#canvasCart").unbind('hide');
            $("#canvasCart").on('hide.bs.offcanvas', function (){
                toastr.warning('Đang cập nhật lại thanh toán')
                $('#cartCheckout').trigger('click')
            })
        }
        // cart.show();
    },
}
$(function () {
    const cookies = cart.cookie.get();
    console.log(cookies)
    if (cookies){
        const count = (cookies.bundles).length + (cookies.courses).length;
        $(".badge-numb-product").html(count)
    }
})

