var dataJob={}, quill_job;
let jobFilter = {"search":null,"location":null,"working_method":null,"category":null,"experience":null,"scope":null,"order_by":null};
const jobFilterFields  = [
    'search',
    'location',
    'working_method',
    'category',
    'experience',
    'scope',
    'order_by',
];

$(function () {
    dropdownSelect();
    if($("#editor-job")){
        quill_job = initQuillEditor("editor-job");
    }
    //bind click for all class .mutilple-active
    $(".multiple-active").each(function () {
        $(this).click(function () {
            if($(this).hasClass("active")){
                $(this).removeClass("active")
            } else $(this).addClass("active");

            //hide error Notification when the requirements are met
            $(this).closest(".form-group").find("div[for*='error']").hide();
        })
    })
    addKeyboardImgQuill(quill_job);
    onChangeJobFilter();
    handleUrlJob();

    //add event upload image
    $("#open-mainImageInputJob").click(function () {
        onActionUploadAvatar("mainImageInputJob", dataJob)
    })

    //validate form upload job
    $("#form-upload-job").validate({
        rules: {
            jobTitle: "required",
            jobDeadline: "required",
            jobTags: "required",
        },
        messages: {
            jobTitle: "* Tiêu đề công việc không được bỏ trống",
            jobDeadline: "* Hạn chót của công việc phải đầy đủ định dạng ngày giờ",
            jobTags: "* Tag không được bỏ trống",
        }
    });

    $("#modal-uploadJob").on("hidden.bs.modal", function (){
        $("#btn-uploadJob").unbind('click')
    })
})

function handleUrlJob(){
    const pageURL = $(location).attr("href");
    if(pageURL.includes("?")){
        //config url
        var filter = pageURL.substr(pageURL.indexOf("?") + 1);
        filter = filter.replace(/\=/g, "-");
        filter = filter.split("&");
        if (filter.length > 1){
            $(window).scrollTop($('#job-scroll-pivot').offset().top);
            $.each(filter, function (index, item){
                if (!item.includes('order_by')){
                    $(`a[field='${item}']`).trigger('click');
                }
            })
        }
    }
}

function applyJob(job_id){
    if (auth_id !== -1){
        axios.put(`/web-api/auth/v1/jobs/${job_id}/apply`)
            .then(res=>{
                sweetAlertSuccess({title: 'Ứng tuyển thành công',
                    description: 'Vui lòng vào Mail của bạn. Kiểm tra thư của ColorME gửi đến và xác nhận việc ứng tuyển'})
            })
            .catch(e=>{
                console.log(e);
                toastr.error("Có lỗi xảy ra")
            })
    }
}

function validateDataJob(data){
    var validate = true;
    if (data.image_url == undefined || data.image_url == "") {
        $("#for-mainInputImageJob").css('color', 'red');
        $("#for-mainInputImageJob").html("Ảnh đại diện không được bỏ trống")
        validate = false;
    }

    if ($("#progress-uploading").val() != undefined){
        //the progress still show. mean the image is uploading or some error happend
        toastr.error("Vui lòng chờ đến khi hình ảnh được tải lên thành công.");
        validate = false;
    }

    if (!$(".job-category.active").length){
        $("div[for='jobCategory-error']").show();
        validate = false
    } else $("div[for='jobCategory-error']").hide();

    if (!$(".job-skills.active").length){
        $("div[for='jobRequiredSkills-error']").show();
        validate = false
    } else $("div[for='jobRequiredSkills-error']").hide()

    var budgetFrom = parseInt($("#budget_from").val());
    var budgetTo = parseInt($("#budget_to").val());
    if (!budgetFrom || !budgetTo|| budgetFrom > budgetTo){
        $("div[for='jobWage-error']").show();
        validate = false
    } else $("div[for='jobWage-error']").hide();

    let quill_content = quill_job.getText();
    if (quill_content.length == 1) {
        $("div[for='editor-job-error']").show();
        validate = false;
    } else $("div[for='editor-job-error']").hide()

    return ($("#form-upload-job").valid() && validate)
}

function getDataJob(){
    dataJob.image_url = dataJob.url;
    dataJob.thumbnail_url = dataJob.thumb_url;
    dataJob.title =  $("input[name='jobTitle']").val();
    dataJob.content = quill_job.container.firstChild.innerHTML;
    dataJob.tags = $("input[name='jobTags']").val();
    dataJob.location_id = parseInt($("#print-location").data('value'));
    dataJob.deadline = moment($("input[name='jobDeadline']").val()).format('YYYY-MM-DD HH:mm:00');
    dataJob.scope = $(".job-scope.active").data('value');
    dataJob.budget_from = parseInt($("#budget_from").val());
    dataJob.budget_to = parseInt($("#budget_to").val());
    dataJob.working_method = $(".working-method-job.active").data('value');
    dataJob.experience_requirement = $(".job-requirements.active").data('value');
    dataJob.payment_method = $(".job-payment.active").data('value');
    dataJob.category_id = [];
    if ($(".job-category.active").length){
        $(".job-category.active").each(function (index, item){
            dataJob.category_id.push($(item).data('value'))
        })
    }

    dataJob.skill_id = [];
    if ($(".job-skills.active").length){
        $(".job-skills.active").each(function (index, item){
            dataJob.skill_id.push($(item).data('value'))
        })
    }
    // console.log(dataJob)
    return dataJob;
}

function createJob(data){
    $("#btn-uploadJob").attr('disabled', true);
    $("#btn-uploadJob span").html("Đang lưu...")
    axios.post("/web-api/auth/v1/jobs", data)
        .then(res=>{
            toastr.success("Việc làm của bạn đã được đăng lên và đang được chờ xét duyệt");
            location.href = `/jobs/${res.data.job.id}`;
        })
        .catch(e=>{
            toastr.error("Có lỗi xảy ra, chưa thể đăng việc làm")
            console.log(e)
        })
        .finally(()=>{
            $("#btn-uploadJob").attr('disabled', false);
            $("#btn-uploadJob span").html('Đăng việc');
        })
}

function onActionCreateJob(){
    $("input[name='jobDeadline']").val(autoSetDeadline(21))
    $("#btn-uploadJob").click(function (){
        var job = getDataJob();
        const isValidate = validateDataJob(job)
        if (isValidate){
            createJob(job)
        } else toastr.error("Vui lòng cung cấp đầy đủ và chính xác các thông tin được yêu cầu")
    })
}

function printOldDataJob(oldData){
    dataJob.url = oldData.image_url;
    dataJob.thumb_url = oldData.thumbnail_url;
    $("#open-mainImageInputJob").html(generateImage('',oldData.image_url));
    $("input[name='jobTitle']").val(oldData.title);

    const convert_deadline = moment(oldData.deadline).format('YYYY-MM-DDTHH:mm');
    $("input[name='jobDeadline']").val(convert_deadline);

    if (oldData.content){
        quill_job.container.firstChild.innerHTML = oldData.content + '<p></p>';
    }

    $("input[name='jobTags']").val(oldData.tags);

    $(".working-method-job input").attr('checked', false);
    $(`.working-method-job[data-value='${oldData.working_method}']`).trigger('click');

    $(".job-scope input").attr('checked', false);
    $(`.job-scope[data-value='${oldData.scope}']`).trigger('click');

    $(".job-payment input").attr('checked', false);
    $(`.job-payment[data-value='${oldData.payment_method}']`).trigger('click');

    $(".job-requirements input").attr('checked', false);
    $(`.job-requirements[data-value='${oldData.experience_requirement}']`).trigger('click');

    $("#budget_from").val(oldData.budget_from);
    $("#budget_to").val(oldData.budget_to);

    $.each(oldData.categories, function (index, item){
        $(`.job-category[data-value='${item.id}']`).addClass("active");
    })

    $.each(oldData.skills, function (index, item){
        $(`.job-skills[data-value='${item.id}']`).addClass("active");
    })

    $(`.dropdown-select-option[data-value='${oldData.location_id}']`).trigger('click');
}

function returnModalCreateJob(e){
    $("#staticBackdropLabel").html('<i class="fas fa-suitcase me-2"></i>Đăng việc làm');
    $("#btn-uploadJob").html('<i class="fas fa-fire me-2" aria-hidden="true"></i>Đăng việc');
    $("#btn-uploadJob").unbind('click');
    $("#form-upload-job").trigger('reset');
    $(".multiple-active").removeClass('active');
    $("#open-mainImageInputJob").html(`<div class="card-upload-img d-flex align-items-center justify-content-center rounded-10">
                                           <span id="for-inputImageTopic" style="display: block">Chọn ảnh đại diện</span>
                                       </div>`)
    dataJob = {};
    $(e.currentTarget).unbind();
}

function settingModalEditJob(oldData){
    $("#btn-uploadJob span").html('Lưu');
    $("#staticBackdropLabel").html('<i class="fas fa-suitcase me-2"></i>Chỉnh sửa việc làm');

    $("#modal-uploadJob").on("hidden.bs.modal", returnModalCreateJob)
}

function fetchDataJob(job_id, callback){
    $("#form-upload-job").closest(".modal-body").append(generateEllipsisLoading());
    $(".lds-ellipsis").show();
    $("#form-upload-job").hide();
    axios.get(`/web-api/v1/jobs/${job_id}`)
        .then(res=>{
            dataJob = res.data.job;
            // console.log(dataJob)
            callback(dataJob)
        })
        .catch(e=>{
            console.log(e);
            toastr.error("Có lỗi xảy ra")
        })
        .finally(()=>{
            setTimeout(function (){
                $("#ldsEllipsis-shortTerm").remove();
                $("#form-upload-job").show();
            },500)
        })
}

function onActionEditJob(job_id){
    settingModalEditJob();
    fetchDataJob(job_id, printOldDataJob)
    $("#btn-uploadJob").click(function (){
        var newData = getDataJob();
        var isValidate = validateDataJob(newData);
        if (isValidate){
            editJob(job_id, newData)
        } else toastr.error("Bạn cần phải cung cấp đầy đủ và chính xác các thông tin được yêu cầu")
    })
}

function editJob(job_id,newData){
    $("#btn-uploadJob").attr('disabled', true);
    $("#btn-uploadJob span").html("Đang lưu...")
    axios.put(`/web-api/auth/v1/jobs/${job_id}`, newData)
        .then(res=>{
            toastr.success("Đã cập nhật bài đăng");
            location.reload()
        })
        .catch(e=>{
            console.log(e)
            toastr.error("Có lỗi xảy ra")
        })
        .finally(()=>{
            $("#btn-uploadJob").attr('disabled', false);
            $("#btn-uploadJob span").html("Lưu...");
        })
}

function deleteJob(job_id) {
    axios.delete(`/web-api/auth/v1/jobs/${job_id}`)
        .then(res=>{
            quickToastMixin("success", "Đã xóa công việc");
            if($(`#divJob${job_id}`).length){
                $(`#divJob${job_id}`).remove();
            } else {
                $("#jobDetail").html(whenRunOutOfData("Không còn dữ liệu để hiển thị"))
            }
        })
        .catch(e=>{
            console.log(e);
            toastr.error("Có lỗi xảy ra, chưa thể xóa công việc này")
        })
}

function onChangeJobFilter() {
    jobFilterFields.forEach(field=> {
        if ($(`.filter-${field}`).length){
            $(`.filter-${field}`).each(function (){
                $(this).click(function (){
                    $(`#btn-job-${field} span`).text($(this).text());
                    jobFilter[field] = $(this).data('value');

                    $(`.filter-${field}`).removeClass("active");
                    $(this).addClass("active");

                    if ($(this).hasClass("filter-order_by")){
                        applyJobFilter();
                    }
                })
            })
        }

    })
}

function applyJobFilter() {
    jobFilter.search = $('#search-job').val();
    // console.log(jobFilter);
    let url = '/jobs?';
    jobFilterFields.forEach(field=>{
        if(jobFilter[field]){
            url += `&${field}=${jobFilter[field]}`;
        }
    });
    console.log(url);
    window.location.href = url;
}

function handleStatusJobHindden(btn, job_id){
    $(".tooltip").tooltip("hide");
    $(btn).prop("onclick", null).off("click");
    $(btn).attr('disabled', false);
    $(btn).attr('data-bs-original-title',"Bỏ ẩn");
    $(btn).html('<i class="fas fa-eye"></i>');
    $(`.btn-accept-job-${job_id}`).hide();
    $(btn).click(function (){
        changeJobStatus(this, job_id, "pending");
    })

    $(`#spanJob${job_id}`).html("<i class=\"fas fa-eye-slash me-2\" aria-hidden=\"true\"></i> Đã ẩn")
        .attr('class', 'badge bg-warning fs-7 mb-2');
}

function handleStatusJobAccepted(btn, job_id){
    $(".tooltip").tooltip("hide");
    if ($(`.btn-accept-job-${job_id}`).length){
        btn = $(`.btn-accept-job-${job_id}`);
    }
    $(btn).hide();
    $(btn).attr('disabled', false);
    $(`#spanJob${job_id}`).html("<i class=\"fas fa-check me-2\" aria-hidden=\"true\"></i> Đã được duyệt")
        .attr('class', 'badge bg-success fs-7 mb-2');
}

function handleStatusJobPendding(btn, job_id){
    $(".tooltip").tooltip("hide");
    $(`.btn-accept-job-${job_id}`).show();

    $(btn).attr('data-bs-original-title',"ẩn");
    $(btn).html('<i class="fas fa-eye-slash"></i>');
    $(btn).prop("onclick", null).off("click");
    $(btn).attr('disabled', false);
    $(btn).click(function (){
        changeJobStatus(this, job_id, "hidden")
    })

    $(`#spanJob${job_id}`).html("<i class=\"fas fa-eye-slash me-2\" aria-hidden=\"true\"></i> Đang chờ duyệt")
        .attr('class', 'badge bg-warning fs-7 mb-2');
}

function changeJobStatus(btn, job_id, status){
    $(btn).attr('disabled', true)
    $(btn).children('span').html("<span class=\"spinner-border spinner-border-sm\"></span>")
    axios.put(`/web-api/auth/v1/jobs/${job_id}/change-status`,{status: status})
        .then(res=>{
            switch (status){
                case "accepted":
                    handleStatusJobAccepted(btn, job_id);
                    break;
                case "hidden":
                    handleStatusJobHindden(btn, job_id);
                    break;
                case "pending":
                    handleStatusJobPendding(btn, job_id);
                    break;
            }
        })
        .catch(e=>{
            console.log(e);
            toastr.error("Có lỗi xảy ra")
        })
}

$(document).ready(function(){
});

function makeNewPosition(){
    var nh = Math.floor(Math.random() * 100) + "%";
    var nw = Math.floor(Math.random() * 100) + "%";

    return [nh,nw];
}

function animateDiv(){
    const min = 300;
    const max = 3000;
    var newq = makeNewPosition();
    const speed = Math.floor(Math.random() * (max - min)) + min;
    $('#pointer1').animate({ top: newq[0], left: newq[1] },speed, function (){
        setTimeout(function (){
            animateDiv();
        },3000)
    });
    setTimeout(function (){
        var newq2 = makeNewPosition();
        const speed = Math.floor(Math.random() * (max - min)) + min;
        $('#pointer2').animate({ top: newq2[0], left: newq2[1] },speed);
    },400)
    setTimeout(function (){
        var newq3 = makeNewPosition();
        const speed = Math.floor(Math.random() * (max - min)) + min;
        $('#pointer3').animate({ top: newq3[0], left: newq3[1] },speed);
    },1900);
};
