var dataProduct = {};
var times_fetchGroups = 0;

$(function () {
    optionVideoAsAvatar();

    $('#modal-uploadProduct').on('hidden.bs.modal', function () {
        $("#btn-uploadProduct").unbind('click');
    })

    $('#modal-uploadProduct').on('shown.bs.modal', function () {
        onLoadListGroup();
    })

    $("#open-mainImageInputProduct").click(function () {
        onActionUploadAvatar("mainImageInputProduct", dataProduct);
    })

    $("#form-uploadProduct").validate({
        rules: {
            title: "required",
            tag: "required",
        },
        messages: {
            title: "* Vui lòng nhập tiêu đề cho bài viết",
            tag: "* Vui lòng nhập tag. Chú ý: các tag phải được đặt cách nhau bởi dấu Phẩy",
        }
    });

})

function checkFileType(file) {
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const validVideoTypes = ['video/m4v', 'video/avi', 'video/mp4', 'video/mov'];
    const fileType = file['type'];
    if (validImageTypes.includes(fileType)) {
        return "image";
    }

    if (validVideoTypes.includes(fileType)) {
        return "video";
    }
}

function generateAvatarVideo(url){
    var url_video = url.includes("watch?v=") ? url.replace("watch?v=", "embed/") : url;
    return `<iframe title="avatar is video" style="height: 300px" class="w-100" src="${url_video}" frameborder="0" allowfullscreen="allowfullscreen"></iframe>`
}

function addEventGetSelectedTopic(topic){
    $(".change-topic-button").each(function () {
        $(this).on("click", function (e) {
            $("#change-dropdown-topic").html($(this).html());
            var topic_id = $(e.target).data('topic-id');
            // console.log($(e.target).data('topic-id'))
            if (topic.length > 0){
                var selected_topic = topic.find(function (item) {
                    return item.id == topic_id
                })
                // console.log(selected_topic)
                dataProduct.topic_id = selected_topic.id;
            }
        });
    });
}

function getDataTopicOfGroup(groups, find_id){
    const selected_group = groups.find(function(item){
        return item.class_id == find_id
    })
    const topic = selected_group.topics;
    return topic;
}

function printDataDropdownTopic(topic, print){
    if (topic.length == 0) {
        $("#change-dropdown-topic").html("Không có Topic nào")
        $("#change-dropdown-topic").attr('disabled', 'disabled')
        return;
    } else {
        $("#change-dropdown-topic").removeAttr('disabled');
        $.each(topic, function (index, item) {
            print.append(generateDropdownButtonTopic(item))
        })
    }
}

function printDataDropdownGroup(groups) {
    if (groups.length > 0){
        $.each(groups, function (index, item){
            $("#print-dropdown-groups").append(generateDropdownButtonGroup(item));
        })
    }
}

function initDataDropdownTopic(groups){
    console.log(groups)
    var topic;
    $(".change-group-button").each(function () {
        $(this).on("click", function (e) {
            $("#change-dropdown-group").html($(this).html());
            var group_id = $(e.target).data('group-id');
            var print_topic = $("#print-dropdown-topic");
            print_topic.html("");
            $("#change-dropdown-topic").html("Vui lòng chọn Topic");
            topic = getDataTopicOfGroup(groups, group_id);
            printDataDropdownTopic(topic, print_topic);
            addEventGetSelectedTopic(topic);
        });
    });
}

function configDataGroups(groups) {
    printListUsersGroup(groups,20)
    initDataDropdownTopic(groups)
}

function onLoadListGroup(){
    if (times_fetchGroups == 0){
        $("#loadingGroup").show();
        fetchDataGroup(configDataGroups);
        times_fetchGroups = 1;
    }
}

function selectVideoAsAvatar(e){
    let avatar_url = e.target.value;
    //fix if url different from the traditional
    avatar_url = avatar_url.includes("&ab_channel=") ? avatar_url.replace(/\&.*/g,"$'") : avatar_url;
    avatar_url = avatar_url.includes("&list=") ? avatar_url.replace(/\&.*/g,"$'") : avatar_url;
    avatar_url = avatar_url.includes("youtu.be/") ? avatar_url.replace("youtu.be/", "youtube.com/watch?v=") : avatar_url;
    //add embed
    avatar_url = avatar_url.includes("watch?v=") ? avatar_url.replace("watch?v=", "embed/") : avatar_url;
    $("#videoUploaded").html(generateAvatarVideo(avatar_url))
    dataProduct.url = dataProduct.thumb_url = avatar_url;
}

function optionVideoAsAvatar(){
    $("#insert-urlAvatarVideo").bind("keypress", function (e){
        if (e.keyCode == 13){
            selectVideoAsAvatar(e);
        }
    })

    $("#insert-urlAvatarVideo").on("change", function (e){
        selectVideoAsAvatar(e);
    })
}

function fetchDataProduct(product_id, callback={then, final}) {
    axios.get("/web-api/v1/products/" + product_id)
        .then((res) => {
            dataProduct = res.data.post;
            callback.then(dataProduct);
        })
        .catch((e) => {
            console.log(e);
            toastr.error("Có lỗi xảy ra, không thể lấy thông tin bài viết");
        })
        .finally(() => {
            callback.final();
        })
}

const storeProduct = {
    validate: (data)=>{
        if (data.url == undefined || data.url == "") {
            $("#for-inputImageProduct").css('color', 'red');
            $("#for-inputImageProduct").html("Ảnh đại diện không được bỏ trống")
        }

        $("#for-content-product").html("");
        let quill_content = quill.getText();
        if (quill_content.length == 1) {
            $("#for-content-product").html("* Nội dung của bài viết không được bỏ trống")
        }

        if ($("#progress-uploading").val() != undefined) {
            //the progress still show. mean the image is uploading or some error happend
            toastr.error("Vui lòng chờ đến khi hình ảnh được tải lên thành công.")
        }
        return ($("#form-uploadProduct").valid() && data.url !== "" && data.url !== undefined && quill_content.length !== 1)
    },

    getData: ()=>{
        dataProduct.title = $("#title-product").val();
        dataProduct.tags = $("#tag-product").val();
        dataProduct.content = quill.container.firstChild.innerHTML;
        dataProduct.feature_time = 'null';
        dataProduct.publish_status = "PUBLISHED";
        dataProduct.keyword = null;
        return dataProduct;
    },

    readyModalEdit: ()=>{
        $("#modal-uploadProduct").modal('show');
        $("#form-uploadProduct").hide();
        $("#content-modalUploadProduct").append(generateEllipsisLoading())

        //add event return modal create when modal is closed
        $('#modal-uploadProduct').on('hidden.bs.modal', function (e) {
            quill.container.firstChild.innerHTML = "";
            $('#form-uploadProduct').trigger("reset");
            $("#btn-uploadProduct").html('Đăng bài');
            if ($('#modalProductDetail').hasClass('show')){
                $("body").addClass('modal-open');
            }
            $("#open-mainImageInputProduct").html(`<div class="card-upload-img d-flex align-items-center justify-content-center rounded-10">
                                                     <span id="for-inputImageProduct" style="display: block">Chọn ảnh đại diện</span>
                                               </div>`)

            $("#videoUploaded").html(`<img style="max-height: 300px" onclick="document.getElementById('insert-urlAvatarVideo').focus()"
                                class="w-100" src="https://d1j8r0kxyu9tj8.cloudfront.net/files/16444004566in4A9hgHPLF0y2.png" alt="avatar-is-video">`);
            $("#btn-avatarIsImage").trigger('click');
            $("#btn-uploadProduct").unbind('click');
            $(e.currentTarget).unbind();
            dataProduct = {};
        });
    },

    printOldData: (oldData)=>{
        $("#btn-uploadProduct").html('Lưu');
        if (oldData.url.includes('youtube')){
            $("#btn-avatarIsVideo").trigger('click');
            $("#insert-urlAvatarVideo").val(oldData.url)
            $("#videoUploaded").html(generateAvatarVideo(oldData.url))
        } else {
            $("#open-mainImageInputProduct").html(generateImage("show-mainImageInputProduct", oldData.url))
        }
        $("#title-product").val(oldData.title);
        $("#tag-product").val(oldData.tags);
        convertToTag($("#tag-product").val(), "print-tag-product")
        if (oldData.content){
            quill.container.firstChild.innerHTML = oldData.content + '<p></p>';
        }
        if (oldData.topic.length > 0){
            const topic = oldData.topic[0];
            $(`.change-group-button[data-group-id = ${topic.group_id}]`).click();
            $(`.change-topic-button[data-topic-id = ${topic.id}]`).click();
        }
    },

    create: (data)=>{
        toastr.warning("Đang Lưu...")
        $("#btn-uploadProduct").html("Đang lưu...");
        $("#btn-uploadProduct").attr('disabled', 'disabled');

        axios.post("/web-api/auth/v1/products", data)
            .then((res) => {
                toastr.success("Đăng bài viết thành công");
                window.location.href = `/products/${res.data.post.id}`;
                // window.location.href = `/profile/${auth_id}`;
            })
            .catch((e) => {
                console.log(e);
                toastr.error("Đăng bài viết thất bại, vui lòng thử lại sau");
            })
            .finally(() => {
                $("#btn-uploadProduct").html("Đăng bài");
                $("#btn-uploadProduct").removeAttr('disabled');
            })
    },

    edit: (product_id, data)=>{
        $("#btn-uploadProduct").html("Đang lưu...");
        $("#btn-uploadProduct").attr('disabled', 'disabled');
        axios.put("/web-api/auth/v1/products/" + product_id, data)
            .then((res) => {
                toastr.success("Chỉnh sửa bài viết thành công")
                window.location.href = `/products/${product_id}`;
            })
            .catch((e) => {
                console.log(e)
                toastr.error("Chỉnh sửa thất bại. Có lỗi xảy ra, vui lòng thử lại sau")
            })
            .finally(() => {
                $("#btn-uploadProduct").html("Lưu");
                $("#btn-uploadProduct").removeAttr("disabled");
            })
    },

    onActionCreate: ()=>{
        $("#btn-uploadProduct").bind('click', function () {
            const data = storeProduct.getData(dataProduct);
            let isValidate = storeProduct.validate(data);
            if (isValidate) {
                storeProduct.create(data);
            } else toastr.error("Vui lòng cung cấp đầy đủ các thông tin được yêu cầu")
        })
    },

    onActionEdit: (product_id)=>{
        toastr.info('Đang tải xuống dữ liệu bài viết', '', {timeOut: 1500})
        $(".lds-ellipsis").show();
        $("#form-uploadProduct").hide();
        storeProduct.readyModalEdit();
        fetchDataProduct(product_id, {then: storeProduct.printOldData,
            final: function (){
                setTimeout(function (){
                    $("#ldsEllipsis-shortTerm").remove();
                    $("#form-uploadProduct").show();
                },300)
            }
        });
        $("#btn-uploadProduct").bind('click', function () {
            let newData = storeProduct.getData(dataProduct);
            let isValidateProduct = storeProduct.validate(newData);
            if (isValidateProduct) {
                storeProduct.edit(product_id, newData);
            } else toastr.error("Vui lòng cung cấp đầy đủ các thông tin được yêu cầu")
        })
    },

    delete: (product_id)=> {
        axios.delete("/web-api/auth/v1/products/" + product_id)
            .then((res) => {
                quickToastMixin("success","Đã xóa bài viết")
                $("#modalProductDetail").modal('hide');
                if ($("#productContent").length !== 0){
                    $("#productContent").html(whenRunOutOfData("Bài viết đã xóa"))
                    return
                }
                setTimeout(function () {
                    window.location.reload();
                }, 600)
            })
            .catch((e) => {
                toastr.error('Có lỗi xảy ra, chưa thể thục hiện hành động XÓA ngay lúc này.');
                console.log(e)
            })
    }
}
