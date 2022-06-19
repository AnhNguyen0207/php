var quill_blog;
$(function () {
    dropdownSelect()
    quill_blog = initQuillEditor("editor-blog");
    addKeyboardImgQuill(quill_blog);

    const slug_pattern = /^[a-z0-9-]+$/;
    $("#titleBlog").on('change', function(){
        $("#slugBlog:text").val(convertToSlug(this.value))
    })

    $("#slugBlog").on('change', function(){
        if (!slug_pattern.test(this.value)) {
            $("#for-slug").html("Url chỉ được chứa các kí tự 0-9, a-z, -");
        } else {
            $("#for-slug").html('');
        }
    })

    $("#open-mainImageInputBlog").click(function () {
        onActionUploadAvatar("mainImageInputBlog", dataBlog)
    })

    $("#form-upload-blog").validate({
        rules: {
            title: "required",
            description: {
                required: true,
            },
            slug: {
                required: true,
            },
            tag: "required",
        },
        messages: {
            title: "* Vui lòng nhập tiêu đề cho blog",
            description: {
                required: "* Vui lòng nhập mô tả cho blog",
            },
            slug: {
                required: "&nbsp; &nbsp; * URL không được bỏ trống",
            },
            tag: "* Vui lòng nhập tag. Chú ý: các tag phải được đặt cách nhau bởi dấu Phẩy",
        }
    });
})

function uploadBlog(blog) {
    $("#save-data").attr('disabled', 'disabled');
    $("#save-data").html("Đang lưu...");
    axios.post("/web-api/auth/v1/blogs", blog)
        .then((res) => {
            toastr.success("Đăng blog thành công");
            window.location.href = "/blog/" + res.data.blog.slug;
        })
        .catch((e) => {
            console.log(e)
            quickToastMixin("error", "Có lỗi xảy ra, chưa thể đăng blog lúc này")
        })
        .finally(() => {
                $("#save-data").removeAttr('disabled');
                $("#save-data").html("Save")
            }
        )
}

function getDataBlog(){
    dataBlog.category_id = parseInt($('#categoryBlog').find(".print").data('value'));
    dataBlog.description = $("#descriptionBlog").val();
    dataBlog.title = $("#titleBlog").val();
    dataBlog.slug = $("#slugBlog").val();
    dataBlog.tags = $("#tags-blog").val();
    dataBlog.kind = $('#type-blog').find(".print").data('value')
    dataBlog.publish_status = $('#statusBlog').find(".print").data('value')
    dataBlog.content = quill_blog.container.firstChild.innerHTML;
    console.log(dataBlog)
    return dataBlog;
}

function checkValidateBlog(dataBlog) {
    let valid = true;
    if (dataBlog.url == "" || dataBlog.url == undefined) {
        $("#for-input-image-blog").addClass("error");
        $("#for-input-image-blog").html("Vui lòng chèn thêm ảnh cho blog");
        valid = false;
    }

    $("#for-content-blog").html("");
    let quill_content = quill_blog.getText();
    if (quill_content.length == 1) {
        $("#for-content-blog").html("* Nội dung của bài viết không được bỏ trống")
        valid = false;
    }

    if ($("#progress-uploading").val() != undefined){
        //the progress still show. mean the image is uploading or some error happend
        toastr.error("Vui lòng chờ đến khi hình ảnh được tải lên thành công.")
    }

    $.each($(".dropdown-select .print"), (index,item)=>{
        const value = $(item).data('value');
        if (!value){
            $(item).children().addClass('error')
            $(item).children().removeClass('text-gray')
            valid = false;
        }
        $(this).blur((e)=>{
            $(item).children().removeClass('error')
        })
    })
    const slug_pattern = /^[a-z0-9-]+$/;
    return ($("#form-upload-blog").valid() && valid && slug_pattern.test(dataBlog.slug));
}

function saveNewBlog() {
    let data = getDataBlog();
    const isValidated = checkValidateBlog(data);
    if (isValidated) {
        uploadBlog(data);
    }else toastr.error("Vui lòng điền đầy đủ thông tin")
}
