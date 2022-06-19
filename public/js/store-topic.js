var dataTopic = {};

$(function () {
    //add url link fbgroup
    $("#open-mainImageInputTopic").click(function () {
        onActionUploadAvatar("mainImageInputTopic", dataTopic);
    })

    $("#form-uploadTopic").validate({
        rules: {
            titleTopic: "required",
            descriptionTopic: "required",
        },
        messages: {
            titleTopic: "* Tiêu đề Topic không được bỏ trống",
            descriptionTopic: "* Mô tả của Topic không được bỏ trống",
        }
    });

    $('#modal-uploadTopic').on('hidden.bs.modal', function () {
        $("#btn-uploadTopic").unbind('click');
    })
});

function getDataTopic(dataTopic){
    dataTopic.title = $("#modalTopicTitle").val();
    dataTopic.description = $("#modalTopicDescription").val();
    dataTopic.deadline =  moment($("#modalTopicDeadline").val()).format('YYYY-MM-DD HH:mm:00');
    //$(".required-topic").eq(1) has text is "Bắt buộc" so check this one return 1 when hasclass active
    dataTopic.is_required = ($(".required-topic").eq(1).hasClass("active")) ? 1 : 0;
    dataTopic.weight = parseInt($(".weight-topic.active").text().replace(/[^0-9]/gi, ''));
    dataTopic.tags = "topic";
    dataTopic.avatar_url = dataTopic.url;
    dataTopic.avatar_is_video = ($("#imageReplaceAvatarIsVideo").attr('src')) ? 1 : 0;
    dataTopic.avatar_name = "Avatar-" + dataTopic.title;
    dataTopic.group_id = group_id;
    return dataTopic;
}

function validateDataTopic(data){
    if (data.avatar_url == undefined || data.avatar_url == "") {
        $("#for-inputImageTopic").css('color', 'red');
        $("#for-inputImageTopic").html("Ảnh đại diện không được bỏ trống")
    }

    if ($("#progress-uploading").val() != undefined) {
        //the progress still show. mean the image is uploading or some error happend!!!
        toastr.error("Vui lòng chờ đến khi hình ảnh được tải lên thành công.")
    }

    if ($("#modalTopicDeadline").val() == ""){
        toastr.error("Hạn chót của topic phải đầy đủ ngày giờ")
    }
    return ($("#form-uploadTopic").valid() && data.avatar_url !== "" && data.avatar_url !== undefined && data.group_id !== undefined && $("#modalTopicDeadline").val() !== "")
}

function createTopic(data){
    $("#btn-uploadTopic").html("Đang lưu...");
    $("#btn-uploadTopic").attr('disabled', 'disabled');
    toastr.warning('Đang lưu...')
    axios.post("/web-api/auth/v1/topics", data)
        .then((res)=>{
            toastr.success("Tạo Topic thành công")
            location.reload()
        })
        .catch((e)=>{
            toastr.error("Có lỗi xảy ra. Chưa thể tạo Topic lúc này");
            console.log(e);
        })
        .finally(()=>{
            $("#btn-uploadTopic").html("Đăng bài");
            $("#btn-uploadTopic").removeAttr("disabled");
        })
}

function onActionCreateTopic(){
    const deadline = autoSetDeadline(7);
    $("#modalTopicDeadline").val(deadline);
    $("#btn-uploadTopic").bind('click', function (){
        const data = getDataTopic(dataTopic);
        const isValidate = validateDataTopic(data);
        if (isValidate){
            createTopic(data);
        }
    })
}

function fetchDataTopic(topic_id, callback){
    axios.get(`/web-api/v1/topics/${topic_id}`)
        .then(res=>{
            // console.log(res)
            var topic = res.data.topic;
            console.log(topic)
            callback(topic);
        })
        .catch(e=>{
            console.log(e);
            toastr.error("Có lỗi xảy ra");
        })
        .finally(()=>{
            setTimeout(function (){
                $("#form-uploadTopic").show();
                $("#ldsEllipsis-shortTerm").remove();
            },500)
        })
}

function printOldDataTopic(data){
    $("#modalTopicTitle").val(data.title);
    $("#modalTopicDescription").val(data.description);
    $("#open-mainImageInputTopic").html(generateImage("", data.avatar_url ? data.avatar_url : data.thumb_url));

    const convert_deadline = moment(data.deadline).format('YYYY-MM-DDTHH:mm');
    $("#modalTopicDeadline").val(convert_deadline);

    if (data.is_required == 1){
        $(".required-topic").removeClass("active");
        $(".required-topic").eq(1).addClass("active");
    }

    $(".weight-topic").removeClass("active")
    $(".weight-topic").eq(data.weight - 1).addClass("active");
}

function returnModalCreateTopic(e){
    $('#form-uploadTopic').trigger("reset");
    $("#btn-uploadTopic").html("Đăng bài")
    $("#open-mainImageInputTopic").html(`<div class="card-upload-img d-flex align-items-center justify-content-center rounded-10">
                                            <span id="for-inputImageTopic" style="display: block">Chọn ảnh đại diện</span>
                                         </div>`)
    $("#btn-uploadTopic").unbind('click');
    $(e.currentTarget).unbind();
    dataTopic = {};
}

function settingModalEditTopic(){
    $("#form-uploadTopic").hide();
    $("#form-uploadTopic").parent().append(generateEllipsisLoading());

    $("#modal-uploadTopic").modal('show')
    $("#btn-uploadTopic").html("Lưu")
    //return modal upload
    $('#modal-uploadTopic').on('hidden.bs.modal', returnModalCreateTopic)
}

function editTopic(data, topic_id){
    $("#btn-uploadTopic").html("Đang lưu...");
    $("#btn-uploadTopic").attr('disabled', 'disabled');
    axios.put("/web-api/auth/v1/topics/" + topic_id, data)
        .then((res)=>{
            location.reload();
            toastr.success("Chỉnh sửa Topic thành công")
        })
        .catch((e)=>{
            toastr.error("Có lỗi xảy ra. Chưa thể sửa Topic lúc này");
            console.log(e);
        })
        .finally(()=>{
            $("#btn-uploadTopic").html("Lưu");
            $("#btn-uploadTopic").removeAttr("disabled");
        })
}

function onActionEditTopic(topic_id){
    settingModalEditTopic();
    fetchDataTopic(topic_id, function (oldData){
        printOldDataTopic(oldData);
        dataTopic.url = oldData.avatar_url ? oldData.avatar_url : oldData.thumb_url;
    })
    $("#btn-uploadTopic").bind('click', function (){
        const newData = getDataTopic(dataTopic);
        const isValidate = validateDataTopic(newData);
        if (isValidate){
            editTopic(newData, topic_id);
        } else toastr.error("Vui lòng cung cấp đầy đủ thông tin")
    })
}

function deleteTopic(topic_id) {
    axios.delete('/web-api/auth/v1/topics/' + topic_id)
        .then(function (res) {
            if ($("#topic-" + topic_id).length > 0){
                $("#topic-" + topic_id).remove();
                $("#dropdown-topic-" + topic_id).remove();
                const count = $("#count-topic").text();
                $("#count-topic").html(count-1)
            } else location.reload();
            quickToastMixin("success","Đã xóa Topic")
        })
        .catch(function (e) {
            console.log(e)
            Swal.fire(
                'Opp!',
                'Có lỗi xảy ra! Chưa thể xóa Topic lúc này',
                'error'
            )
        })
}

function onSubmitSubjectTopic(group_id,topic_id){
    storeProduct.onActionCreate();
    autoSelectTopic(group_id,topic_id)
}

function autoSelectTopic(group_id,topic_id){
    if ($(`.change-group-button[data-group-id = ${group_id}]`).length > 0){
        $(`.change-group-button[data-group-id = ${group_id}]`).click();
        $(`.change-topic-button[data-topic-id = ${topic_id}]`).click();
    } else {
        setTimeout(function (){
            autoSelectTopic(group_id,topic_id);
        },1000)
    }
}
