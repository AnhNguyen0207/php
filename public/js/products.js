function removeEventInteractInModal(){
    $('.like-product').unbind('click')
    $('.modal-product-liker').unbind('click')
}

$(function (){
    //change url when open modal without redirecting.
    $("#modalProductDetail").on('show.bs.modal', onModalProductShow);
    $("#modalProductDetail").on('hide.bs.modal', onModalProductHide);
    $("#print-product").show()
    $(".lds-ellipsis").hide();
})

function onModalProductShow(event) {
    // $('#productContent').html("");
    var button = $(event.relatedTarget);
    var product_id = button.data('product-id');
    window.history.pushState({}, '', '/products/' + product_id);
}

function onModalProductHide() {
    window.history.back();
    $('#modalProduct').empty();
    removeEventInteractInModal();
}

//ready
$(document).ready(function () {
    $('.change-sortby-button').on('click', function (event) {
        var sortBy = $(this).attr('data-value');
        $("#dropdown-sort-by").attr("data-value", sortBy);
        window.location.href = urlBuilder();
    })

    $('.change-category-button').on('click', function (event) {
        var category = $(this).attr('data-value');
        $("#dropdown-category").attr("data-value", category);
        window.location.href = urlBuilder();
    })

    function urlBuilder() {
        var sortBy = "sortBy=" + $("#dropdown-sort-by").attr("data-value") + "&";
        var category = "category=" + $("#dropdown-category").attr("data-value") + "&";
        var orderBy = "orderBy=" + getUrlParameter('orderBy') + "&";
        var fromDate = "fromDate=" + getUrlParameter('fromDate') + "&";
        var toDate = "toDate=" + getUrlParameter('toDate') + "&";
        var tag = "tag=" + getUrlParameter('tag') + "&";
        var searchString = "search=" + $("#search-product-input").val() + "&";

        var result = "?";
        if ($("#dropdown-sort-by").attr("data-value") != "") {
            result += sortBy;
        }
        if ($("#dropdown-category").attr("data-value") != "") {
            result += category;
        }
        if (getUrlParameter('orderBy') != "") {
            result += orderBy;
        }
        if (getUrlParameter('fromDate') != "") {
            result += fromDate;
        }
        if (getUrlParameter('toDate') != "") {
            result += toDate;
        }
        if (getUrlParameter('tag') != "") {
            result += tag;
        }
        if ($("#search-product-input").val() != "") {
            result += searchString;
        }

        return result;
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return '';
    };

    //load more products
    var isRunning = false;

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() >= $('#contentProduct').height()) {
            if (!isRunning && totalProduct > pageProduct) {
                loadMoreProduct(pageProduct);
                pageProduct++;
            }
        }
    });

    function loadMoreProduct(page) {
        isRunning = true;
        $('.lds-ellipsis').show();
        axios.get("/products/load-more", {
            params: {
                search: searchProduct,
                sortBy: sortByProduct,
                category: categoryProduct,
                page: pageProduct
            },
        })
            .then(function (response) {
                $("#loadMoreProduct").append(response.data);
                // console.log('loaded');
                isRunning = false;
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                $('.lds-ellipsis').hide();
            });

    }

    if (pageProduct >= totalProduct) {
        $('#all-of-data').show();
    }
});

//interact
function likeProduct(product_id) {
    axios.post('/web-api/auth/v1/products/' + product_id + '/like').then(function (data) {
        // console.log(data['data']['like_counts']);
        var classLikeProductId = "." + product_id + "-likes-count";
        var classLikeButtonProductId = "." + product_id + "-like-button";
        $(classLikeProductId).html(data['data']['like_counts']);
        $(classLikeButtonProductId).toggleClass('liked');

    }).catch(function (e) {
        console.log(e);
        if (auth_id == -1) {
            $("#modalLogin").modal('show');
            onModalLoginShow();
        } else toastr.error("Có lỗi xảy ra")

    });
}

function featureProduct(product_id) {
    axios.post('/web-api/auth/v1/products/' + product_id + '/feature')
        .then(function (res) {
            var classFeatureButtonProductId = "." + product_id + "-feature-button";
            $(classFeatureButtonProductId).toggleClass('featured');
            if (res.data.data.feature.id > 0){
                $(classFeatureButtonProductId).addClass('featured');
            } else $(classFeatureButtonProductId).removeClass('featured');
        })
        .catch(function (e) {
            console.log(e);
            if (auth_id == -1){
                $("#modalLogin").modal('show');
                onModalLoginShow();
            } else {
                Swal.fire({
                    title: 'Chưa được rồi',
                    icon: 'warning',
                    text: 'Bạn không phải là người đánh dấu nổi bật bài viết này',
                    confirmButtonText: '<i class="far fa-thumbs-up me-2"></i>Okay',
                    confirmButtonColor: '#00b700'
                });
            }

        });
}

function getCommentProduct(product_id) {
    // console.log(product_id)
    var rand = (new Date()).getTime(); //pass in a random parameter to clear the cache
    axios.get(`/web-api/v1/comments?product_id=${product_id}&rand=${rand}`)
        .then(res => {
            $("#count-comment").html(`Bình luận (${res.data.comments.items.length})`);
            const data = res.data.comments.items;
            $("#print-comment").html('');
            data.forEach(function (item) {
                $("#print-comment").append(generateCommentProduct(item))
                if (item.commenter_id != auth_id) {
                    $("#btn-edit-comment-" + item.id).hide();
                }
            })
        })
        .catch((e) => {
            console.log(e)
        })
}

function createCommentProduct(product_id) {
    if ($("#commentInput").val().length < 2) {
        toastr.error('Bình luận của bạn KHÔNG được bỏ trống');
        $("#commentInput").val("");
        return;
    } else {
        $("#print-comment").append(generateEllipsisLoading());
        const comments = {
            product_id: product_id,
            content: $("#commentInput").val(),
            parent_id: 0
        };
        $("#commentInput").val("");
        axios.post("/web-api/auth/v1/comments", comments)
            .then((res) => {
                $("#print-comment").append(generateCommentProduct(res.data.comment))
            })
            .catch((e) => {
                toastr.error('Có lỗi xảy ra, chưa thể thực hiện bình luận lúc này.');
                console.log(e)
            })
            .finally(() => {
                $("#ldsEllipsis-shortTerm").remove();
            })
    }
}

function showEditComment(comment_id) {
    let content_comment, content_edit;
    content_comment = $("#content-comment-" + comment_id);
    $("#comment-" + comment_id).append(generateFormEditComment(comment_id, content_comment))
    $("#card-comment-" + comment_id).hide();

    //add even for button
    //Cancel edit
    $("#cancel-edit-comment-" + comment_id).bind('click', function () {
        $("#form-edit-comment-" + comment_id).remove();
        $("#card-comment-" + comment_id).show();
    })

    //save edit
    content_edit = $("#input-edit-comment-" + comment_id);
    $("#btn-edit-content-comment-" + comment_id).bind('click', function () {
        updateCommentProduct(comment_id, content_comment, content_edit);
    })

    //press enter to edit
    $("#input-edit-comment-" + comment_id).bind('keypress', function (event) {
        if (event.keyCode === 13 && !event.shiftKey) {
            updateCommentProduct(comment_id, content_comment, content_edit);
        }
    });
}

function updateCommentProduct(comment_id, content_comment, content_edit) {
    if (content_edit.val() == "") {
        toastr.error("Nội dung bình luận không được bỏ trống")
        return
    } else {
        axios.put("/web-api/auth/v1/comments/" + comment_id, {
            content: content_edit.val()
        })
            .then((res) => {
                content_comment.html(res.data.comment.content);
                $("#cancel-edit-comment-" + comment_id).trigger("click");
            })
            .catch((e) => {
                console.log(e);
                toastr.error("Có lỗi xảy ra, vui lòng thử lại sau")
            })
    }
}

function deleteCommentProduct(comment_id) {
    axios.delete("/web-api/auth/v1/comments/" + comment_id)
        .then((res) => {
            quickToastMixin("success", "Đã xóa bình luận")
            $("#comment-" + comment_id).remove()
        })
        .catch((e) => {
            toastr.error('Có lỗi xảy ra, chưa thể thục hiện hành động XÓA ngay lúc này.');
            console.log(e)
        })
}


function keyUpEnter(e, input_id) {
    if (e.keyCode == 13 && !e.shiftKey) {
        $("#" + input_id).trigger('click')
    }
}

function generateFormEditComment(comment_id, content_comment) {
    return `
                <form id="form-edit-comment-${comment_id}">
                    <div class="comment-form position-relative">
                               <textarea id="input-edit-comment-${comment_id}" class="bg-light-gray w-100 p-4 rounded-10"
                                         placeholder="Comment...">${content_comment.html()}</textarea>
                        <button id="btn-edit-content-comment-${comment_id}" style="bottom: 15px" type="button" class="btn btn-sm position-absolute">
                            Lưu
                        </button>
                    </div>
                    <p id="cancel-edit-comment-${comment_id}" class="btn-sm cursor-pointer" style="font-weight: 600">Hủy</p>
                </form>`
}

function generateCommentProduct(item) {
    let part = item.commenter.name.split(' ');
    return `
                <div id="comment-${item.id}">
                    <div id="card-comment-${item.id}" class="w-100 rounded-10 bg-light-gray my-4 p-4">
                        <div class="d-flex justify-content-between">
                            <div class="d-flex flex-grow-1">
                                <img class="logo-md rounded-circle me-3"
                                     src="${item.commenter.avatar_url}">
                                <div class="d-flex flex-grow-1">
                                    <small class="mt-1 text-wrap flex-grow-1">
                                        <p class="mb-1">
                                            <a href="profile/${item.parent_id}" class="text-black">
                                                <b> ${part[part.length - 2]} ${part[part.length - 1]}</b>
                                            </a>
                                            <span class="text-secondary">· ${moment.unix(item.created_at).fromNow()}</span>
                                        </p>
                                        <div class="form-group mb-0">
                                            <span id="content-comment-${item.id}" class="d-block">${item.content}</span>
                                        </div>
                                    </small>
                                </div>
                            </div>
                            <div id="btn-edit-comment-${item.id}" class="ms-4" style="margin: -10px">
                                <div class="cursor-pointer btn-light rounded-circle d-flex align-items-center
                                                                    justify-content-center p-2" data-bs-toggle="dropdown">
                                    <i class="fas fa-ellipsis-h text-sm p-1" data-bs-toggle="tooltip"
                                       title="Chỉnh sửa hoặc xóa bình luận này"></i>
                                </div>
                                <div class="dropdown-menu shadow-3 border-0 p-2" style="border-radius: 15px">
                                    <button onclick="showEditComment(${item.id})" id="edit-comment-${item.id}"
                                            class="dropdown-item text-black rounded-10 nav-link">
                                        <i class="fas fa-pencil-alt me-2"></i>Chỉnh sửa
                                    </button>
                                    <button onclick="confirmDelete({title: 'Bạn có chắc muốn xóa bình luận này?', description: ''}, function (){deleteCommentProduct(${item.id})})" class="dropdown-item text-black rounded-10 nav-link">
                                        <i class="fas fa-trash me-2"></i>Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
}

