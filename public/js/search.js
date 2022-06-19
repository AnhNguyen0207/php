var pageUser = 1;
var pagePost = 1;
function addEventChangeDropdownItem(){
    $(".dropdown-item").click(function () {
        var parent = $(this).closest('.dropdown').find('.dropdown-toggle');
        var children = $(this).closest('.dropdown-menu').find('.dropdown-item');
        children.removeClass("active");
        $(this).addClass("active");
        if (!$(this).text().includes("Tất cả")) {
            parent.html(`<b class="text-gradient">${parent.val()}</b>: ${$(this).html()}`)
        } else {
            parent.html(parent.val() + " ")
        }
    });
}

function addEventSelectAllParam(){
    $("#paramAll").click(function () {
        if (!$(this).hasClass("btn-gradient")) {
            $(this).addClass("btn-gradient")
            $(".all").each(function (){
                $(this).trigger('click')
            })

            if ($("#search").val() != ""){
                quickToastMixin("success", `Lọc tất cả các kết quả liên quan tới ${$("#search").val()}`)
            } else quickToastMixin("success", `Lọc tất cả các kết quả`)
        }
    })
}
$(function () {
    $(".dropdown-select-option").each(function () {
        $(this).on("click", function () {
            $(this).parent().prev().html($(this).html())
                .data('value', $(this).data('value'))
                .attr('data-value', $(this).data('value'))
        });
    });
    addEventSelectAllParam();
    addEventChangeDropdownItem();

    //off button select all param if change any option
    $(".dropdown-toggle").on("blur", function (){
        $("#paramAll").removeClass("btn-gradient")
    })

    // add even keyup code 13(enter)
    $("#search").on("keyup", function (e) {
        if (e.keyCode == 13) {
            searchItems()
        }
    })
})

function searchItems() {
    if ($("#search").val().length < 4) {
        toastr.error("Từ khóa tìm kiếm phải > 4 ký tự")
        return
    } else {
        $("#printSearch").show();
        $("#printSearch-users").html("")
        $("#printSearch-products").html("")
        $(".loading").show();
        pageUser = 1;
        pagePost = 1;
        searchDataUsers()
        searchDataPost()
    }
}

function printDataUsers(users){
    if (users.length > 0){
        $.each(users, function (index, item) {
            $("#printSearch-users").append(generateItemUsers(item))
            if (index == (users.length - 1)) {
                pageUser++;
                var add = `<div onclick="this.remove();searchDataUsers(pageUser)" class="col-md-6 col-lg-3 col-sm-12 cursor-pointer my-2">
                                                <div class="d-flex align-items-center bg-gray-50 btn-round py-1 w-100">
                                                    <div class="">
                                                        <div>
                                                            <div class="rounded-circle d-flex align-items-center justify-content-center text-white logo-md" style="background-color: lightgray">
                                                                +
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="ms-2">
                                                        <div><b>
                                                                <div class="color-black bold">Xem thêm</div>
                                                            </b></div>
                                                        <div class="text-sm">Xem thêm kết quả</div>
                                                    </div>
                                                </div>
                                            </div>`
                $("#printSearch-users").append(add)
            }
        })
    }
    if (users.length == 0 && pageUser == 1){
        $("#printSearch-users").html("<div class='ms-4'>Không tìm thấy người dùng</div>")
    }
    if (users.length == 0 && pageUser !== 1){
        $("#printSearch-users").append("<div class='col-12 mt-5 text-danger ms-4'>Không còn thêm thành viên nào khác</div>")
    }
}
function searchDataUsers() {
    $(".loading").eq(0).show()
    var name = $("#search").val();
    axios.get(`/web-api/v1/users?search=${name}&limit=4&page=${pageUser}`)
        .then((res) => {
            $(".loading").hide();
            var users = res.data.users.items;
            printDataUsers(users);
        })
        .catch((e) => {
            console.log(e);
            toastr.error("Có lỗi xảy ra, không thể lấy thông tin người dùng")
        })
}
function paramSearch() {
    var param = {};
    param.page = pagePost;
    var view = $("button[value ~= View]"),
        course_id = $("button[value ~= Môn] span"),
        gen_id = $("button[value ~= Khóa] span"),
        like = $("button[value ~= Like]"),
        created = $("button[value = 'Thời gian']");
    param.search = $("#search").val();
    if ($("#paramAll").hasClass("btn-gradient")) {
        return param;
    }

    // check view
    if(view.text().includes("Tăng")){
        param.view = "asc"
    } else if (view.text().includes("Giảm")){
        param.view = "desc"
    }

    //check like
    if(like.text().includes("Tăng")){
        param.like = "asc"
    } else if (like.text().includes("Giảm")){
        param.like = "desc"
    }

    //check time
    if(created.text().includes("Mới")){
        param.created = "asc"
    } else if (created.text().includes("Cũ")){
        param.created = "desc"
    }

    //check course_id
    if (course_id.data('value') !== "" && course_id.data('value') !== undefined){
        param.course_id = course_id.data('value')
    } else delete param[course_id]

    //check gen_id
    if (gen_id.data('value') !== "" && gen_id.data('value') !== undefined){
        param.gen_id = gen_id.data('value')
    } else delete param[gen_id]

    return param;
}

function printDataPost(products){
    var view_more = `<div class="col-md-12 text-center mt-3" onclick="this.remove(), searchDataPost()"><div class="btn btn-round bg-gray-50"><i class="fas fa-plus-circle me-2"></i>Xem thêm</div></div>`
    // console.log(products)
    $.each(products, function (index, item) {
        $("#printSearch-products").append(generateItemPost(item));
        $('[data-bs-toggle="tooltip"]').tooltip();

        if (index == (products.length - 1)){
            $("#printSearch-products").append(view_more)
            pagePost ++;
        }
    })
}

function searchDataPost(page) {
    var products;
    $(".loading").eq(1).show();
    var params = paramSearch();
    // console.log(params)
    axios.get("/web-api/v1/products", {params: params})
        .then((res) => {
            $(".loading").eq(1).hide();
            products = res.data.products.items;
            printDataPost(products);
        })
        .catch(e=>{
            console.log(e)
            toastr.error("Có lỗi xảy ra, không thể tìm bài viết")
        })
}

function generateItemUsers(user) {
    return `<div class="col-lg-3 col-sm-6 my-2">
                           <a class="btn btn-round bg-gray-50 d-flex align-items-center w-100 p-1" href="/profile/${user.id}" target="_blank" rel="noopener">
                                <div class="me-2">
                                    <img class="rounded-circle logo-md" src="${user.avatar_url}" alt="${user.name}">
                                </div>
                                <div class="text-start text-limit w-100" style="line-height: 1.3">
                                    <div><b>${user.name}</b></div>
                                    <small><p style="max-width: 90%" class="text-limit text-limit text-ssm my-0">${(user.university) ? (user.university) : ""}</p></small>
                                </div>
                            </a>
                       </div>`
}

function printNameLikers(likers){
    var users_name = "";
    if (likers.length){
        $.each(likers, function (index, item){
            users_name += item.name + ", ";
        })
    } else {
        users_name = "Chưa có người thích";
    }
    return users_name;
}

function checkAuthorLiked(likers){
    var valid = false;
    if (likers.length){
        $.each(likers, function (index, item){
            if (item.id == auth_id){
                valid = true
            }
        })
    }

    return valid;
}

function generateItemPost(product) {
    return `
                <div class="col-lg-4 col-md-6 my-3">
                    <div class="product position-relative cursor-pointer">
                        <div class="blog-img"
                             style="background-image: url('${product.url}')" onclick="openModalProduct(${product.id})"
                             data-bs-toggle="modal"
                             data-bs-target="#modalProductDetail" data-product-id="${product.id}"></div>
                        <div class="info-product">
                            <div style="right: 0; bottom: 0" class="text-md position-absolute p-2">
                                <div class="bg-black text-white btn btn-sm text-ssm px-2 py-0"><small>${(product.topic[0]) ? product.topic[0].group.name : ''}</small></div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                            <a href="/profile/${product.author.id}">
                                <div class="blogs-author d-flex align-items-center my-2 me-2">
                                    <div style="background-image: url('${product.author.avatar_url}')" loading="lazy" class="rounded-circle ms-1"></div>
                                    <span class="px-2 py-1 text-center text-limit"><small>${product.author.name}</small></span>
                                </div>
                            </a>
                            <a href="profile/${product.author.id}" target="_blank" rel="noopener" class="d-block d-sm-none d-md-block">
                                <div class="blog-time text-sm text-limit"><small>${moment.unix(product.updated_at).fromNow()} · ${product.views} Views</small></div>
                            </a>
                        </div>
                        <div class="d-flex align-items-center cursor-pointer">
                            <span class="text-gray" data-bs-toggle="tooltip" data-bs-original-title="Được đánh dấu nổi bật bởi ${product.feature ? product.feature.name : ''}">
                                <i class="fas fa-star text-lg me-2 ${product.feature ? 'featured' : ''} ${product.id}-feature-button" onclick="featureProduct(${product.id})"></i></span>
                                <div style="height: 35px" data-bs-toggle="tooltip" data-bs-original-title="${printNameLikers(product.likers)}">
                                    <i id="${product.id}-like-button" style="font-size: 30px" class="fas fa-heart
                                     text-gray ${product.id}-like-button ${checkAuthorLiked(product.likers) ? 'liked' : ''}"
                                     onclick="likeProduct(${product.id})"></i>
                                    <div id="${product.id}-likes-count" class="text-center text-white pointer-events-none ${product.id}-likes-count"
                                        style="margin-top: -35px" data-bs-toggle="modal" data-bs-target="#modalLiker"
                                        onclick="openModalLiker(${product.id})"
                                        data-product-id="${product.id}">
                                        ${product.likers.length}
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>`
}
