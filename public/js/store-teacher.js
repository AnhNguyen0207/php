var dataTeacher = {};
$(function (){
    quill_teacher = initQuillEditor("editor-teacher");
    const limit = 3;
    var times = 0;
    do {
        addMoreBoxQA();
        times ++;
    } while (times < limit);

    $("#open-mainImageInputTeacher").click(function () {
        onActionUploadAvatar("mainImageInputTeacher", dataTeacher)
    })

    const slug_pattern = /^[a-z0-9-]+$/;
    $("#titleTeacher").on('keyup', function(){
        $("#slugTeacher:text").val(convertToSlug(this.value))
    })

    $("#slugTeacher").on('keyup', function(){
        if (!slug_pattern.test(this.value)) {
            $("#for-slug").html("Url chỉ được chứa các kí tự 0-9, a-z, -");
        } else {
            $("#for-slug").html('');
        }
    })
})

function removeBoxQA(btn){
    $(btn).parent().parent().remove();
}

function generateQAInput(){
    return `
                            <div class="box-QA row justify-content-between my-4">
                                <div style="display: block" class="class remove-qa col-12 p-0 m-0 border-bottom border-danger text-end mb-4">
                                    <span onclick="removeBoxQA(this)" class="btn btn-light rounded-circle">X</span>
                                </div>
                                <div class="col-md-4 p-0">
                                    <textarea class="form-control question" type="text" placeholder="Nhập câu hỏi"></textarea>
                                </div>
                                <div class="col-md-7 p-0">
                                    <textarea class="form-control answer" placeholder="Nhập câu trả lời"></textarea>
                                </div>
                            </div>`
}


function addMoreBoxQA(){
    $("#list-QA").append(generateQAInput());
}

function optionRemoveQA(){
    $.each($(".remove-qa"), function (){
        $(this).show();
    })
}

function getDataTeacher(){
    dataTeacher.teacher_content = quill_teacher.container.firstChild.innerHTML;
    //
    // $.each($(".box-QA"), function (){
    //     const q = $(this).find(".question").val();
    //     const a = $(this).find(".answer").val();
    //
    //     if (!q.length || !a.length){
    //         return;
    //     } else {
    //         let qa = [];
    //         qa.push(q,a);
    //         dataTeacher.teacher_content.push(qa);
    //     }
    // })
    dataTeacher.title = $("#titleTeacher").val();
    dataTeacher.description = $("#descriptionTeacher").val();
    dataTeacher.slug = $("#slugTeacher").val();

    console.log(dataTeacher)
    return dataTeacher;
}

function uploadTeacher(teacher){
    axios.post("/web-api/auth/v1/teacher", teacher)
        .then(r=>{
            toastr.success("Đã lưu thông tin giảng viên");
            location.href = `/teachers`;
        })
        .catch(e=>{
            console.log(e)
            toastr.error("có lỗi xảy ra")
        })
}

function validateTeacherData(data){
    let valid = false;
    if (!data.url || data.url == "" || !(data.teacher_content).length || !data.description || data.description == ""){
        valid = false;
    } else {
        valid = true;
    }

    return valid;
    //...
}

function saveTeacher(){
    const teacher = getDataTeacher();
    const isValid = validateTeacherData(teacher);
    if (isValid){
        uploadTeacher(teacher)
    } else {
        toastr.error("Vui lòng nhập đầy đủ thông tin được yêu cầu");
    }
}

function deleteTeacher(){
    axios.post("/web-api/auth/v1/teacher", teacher)
        .then(r=>{
            toastr.success("Đã lưu thông tin giảng viên");
            // location.href = `/teacher/${teacher.url}`;
        })
        .catch(e=>{
            console.log(e)
            toastr.error("có lỗi xảy ra")
        })
}
