var fetchVideosTimes = 0;

function fetchVideosGroup(group_id){
    if (fetchVideosTimes != 0){
        return;
    }
    axios.get(`/web-api/auth/v1/groups/${group_id}/videos`)
        .then(res=>{
            var videos = res.data.videos;
            if (videos){
                printVideosGroup(videos);
            } else $("#videoIsNull").show();
            fetchVideosTimes = 1;
        })
}

$(function (){
        $("#btnFetchVideos").click(function (){
            fetchVideosGroup(group_id)
        })

        const pageURL = $(location).attr("href");
        const tab_href = pageURL.substr(pageURL.indexOf("#"));
        if (tab_href == "#" || tab_href == "# "){
            return
        }
        $(`a[href$="${tab_href}"]`).trigger('click');
    })

    function updateClassDriveUrl(class_id, url) {
        if (url == ""){
            sweetAlertInput({title: '<p class="text-danger"">Bạn chưa nhập URL</p>', value: ''}, function (url){updateClassDriveUrl(class_id, url)});
            return
        }
        axios.put('/web-api/auth/v1/classes/' + class_id, {
            link_drive: url
        }).then(function (res) {
            toastr.success("Đã lưu đường dẫn của bạn");
            $(".facebook-url").attr("href", url)
            if (!$(".facebook-url").hasClass("active")){
                $(".facebook-url").attr("href", url)
                $(".facebook-url").prop("onclick", null).off("click");
                $(".facebook-url").addClass("active");
                $("#facebooks-group-content").html('Nhóm Facebook');
            }
        }).catch(function (e) {
            console.log(e)
            toastr.error("Có lỗi xảy ra, vui lòng thông báo cho quản trị")
        })
    }

    function searchMembersGroup(term, group_id){
        var members;
        var print = $("#search-member-result");
        print.html('');
        print.html(generateEllipsisLoading());
        axios.get("/web-api/auth/v1/groups/" + group_id + "/users?search=" + term)
            .then((res)=>{
                members = res.data.users;
            })
            .catch((e)=>{
                console.log(e)
            })
            .finally(()=>{
                print.html('');
                $.each(members, function (index, member){
                    print.append(generateMemeberGroup(member))
                })
            })
    }

    // axios.post("/web-api/auth/v1/groups/5369/add-user",{user_id: 1966, group_id: 5369})
    function addMemberToGroup(user_id, group_id){
        $("#member-"+user_id).attr('disabled','disabled')
        axios.post(`/web-api/auth/v1/groups/${group_id}/add-user/${user_id}`, {
            user_id: user_id,
            group_id: group_id
        }).then(function (res) {
            toastr.success("Thêm vào Group thành công")
        }).catch(function (e) {
            $("#member-"+user_id).attr('disabled',false)
            console.log(e)
            toastr.error("Có lỗi xảy ra, chưa thể thêm thành viên lúc này")
        })
    }

    function joinGroup(user_id, group_id){
        addMemberToGroup(user_id, group_id);
        location.reload();
    }

    function copyToClipboard(copy_text) {
        navigator.clipboard.writeText(copy_text);
        quickToastMixin('success', "Đã copy URL")
    }

    function addCertificate(user_id, class_id){
        axios.post("/web-api/auth/v1/classes/" + class_id + "/create-certificate/" + user_id)
            .then((res)=>{
                sweetAlertSuccess(undefined, function (){
                    window.location.href = `/digitalcertificate/${res.data.register.id}`
                })
                $("button.swal2-confirm").html("<i class=\"fa fa-thumbs-up\"></i> Xem chứng chỉ")
            })
            .catch((e)=>{
                console.log(e)
                toastr.error("Có lỗi xảy ra")
            })
    }

    function generateMemeberGroup(member) {
        return `<div class="d-flex justify-content-between flex-wrap align-items-center rounded-10 shadow-3 my-4 p-4">
                                <div class="d-flex align-items-center">
                                    <div class="position-relative me-4">
                                        <div class="rounded-circle logo-lg profile-avatar"
                                             style="background-image: url('${member.avatar_url}')"></div>
                                    </div>
                                    <div class="d-flex justify-content-between flex-wrap w-100">
                                        <div class="text-secondary text-sm mb-1">
                                                <div class="text-black text-lg my-2 me-4"><b>${member.name}</b></div>
                                                <div title="${member.email}" class="text-gray align-items-center text-sm text-limit mt-2 me-4">
                                                    ${member.email}
                                                </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="px-1"></div>
                                <div class="col">
                                    <button id="member-${member.id}" onclick="addMemberToGroup(${member.id}, group_id)" class="btn btn-gradient float-end btn-round btn-danger mt-sm-0 mt-4">
                                        Thêm
                                    </button>
                                </div>
                            </div>`
    }

    function reloadHostZoom(group_id) {
        $("#startZoomButton").attr('disabled', 'disabled');
        $("#startZoomButton span").html('Đang cập nhật <div class="spinner-border spinner-border-sm"></div>');
        axios.post('/web-api/auth/v1/groups/' + group_id + '/reload-alternative-host-zoom',{
            group_id: group_id
        }).then(function (res) {
            quickToastMixin("success", "Đã cập nhật lại host");
        }).catch(function (e) {
            console.log(e);
            toastr.error("Có lỗi xảy ra")
        }).finally(()=>{
            $("#startZoomButton").attr('disabled', false);
            $("#startZoomButton span").html('Bắt đầu lớp');
        })
    }

    function setHostZoom(group_id, user_id)
    {
        $("#startZoomButton").attr('disabled', 'disabled');
        $("#startZoomButton span").html('Đang tải <div class="spinner-border spinner-border-sm"></div>');
        axios.post('/web-api/auth/v1/groups/' + group_id + '/set-host-zoom',{
            group_id: group_id,
            user_id: user_id
        }).then(function (res) {
            quickToastMixin("success", "Cập nhật host thành công");
        }).catch(function (e) {
            console.log(e);
            toastr.error("Có lỗi xảy ra")
        }).finally(()=>{
            $("#startZoomButton").attr('disabled', false);
            $("#startZoomButton span").html('Bắt đầu lớp');
        })
    }

    function generateCardVideos(video){
        var duration_str = "";
        var duration_num = video.duration;
        duration_num = Math.floor(duration_num/60)
        if (duration_num > 60){
            const minute = duration_num % 60;
            duration_num = Math.floor(duration_num/60);
            duration_str = duration_num + " Giờ " + minute + " Phút";
        } else duration_str = duration_num + " Phút";

        return `
            <div class="col-lg-3 col-md-4 position-relative my-4">
                <div class="blog-img bg-black position-relative rounded-10">
                    ${video.embed.html}
                </div>
                <div class="my-3">
                    <a href="${video.link}" class="text-black text-limit">
                        <b data-bs-toggle="tooltip" title="${video.name}">
                            ${video.name}
                        </b>
                    </a>
                    <div class="text-secondary text-limit" data-bs-toggle="tooltip" title="Thời lượng ${duration_str}">
                        ${moment(video.created_time).format("hh:mm:ss")} - ${moment(video.created_time).format("MM/DD/YYYY")}
                    </div>
                </div>
                <button class="btn btn-sm btn-light"
                        onclick="copyToClipboard('${video.link}')">
                    <i class="fas fa-link me-2"></i>
                    Copy URL
                </button>
            </div>
            `
    }

    function printVideosGroup(videos){
        $("#printVideos").html('');
        $.each(videos, function(index,item){
            $("#printVideos").append(generateCardVideos(item))
        })

        $('[data-bs-toggle="tooltip"]').tooltip();
    }


    function startZoom(group_id, zoom_url){
        console.log(group_id)
        $("#startZoomButton").attr("disabled", "disabled");
        $("#startZoomButton span").text("Đang tải...");
        axios.get(`/web-api/auth/v1/groups/${group_id}/start-zoom`)
            .then(res=>{
                var script = res.data;
                if (script.includes("không")){
                    toastr.error(script);
                    return;
                } else{
                    eval(script)
                }
                console.log(res);
                window.open(zoom_url, '_blank');
            })
            .catch(e=>{
                console.log(e)
            })
            .finally(()=>{
                $("#startZoomButton").attr("disabled", false);
                $("#startZoomButton span").text("Bắt đầu lớp");
            })

        axios.get('/web-api/auth/v1/groups/clean-up-zoom-recordings')
            .then(res=>{
                console.log(res)
            })
    }

    function generateButtonCheckin(id){
        return `<div id="listBtnCheckin-${id}" class="text-center">
                <button class="btn btn-sm btn-success"><i class="fas fa-check-circle text-white"></i></button>
                <button class="btn btn-sm btn-danger"><i class="fas fa-times text-white"></i></button></div>`
    }

    function optionCheckinLecture(btn, id){
        $(btn).children("button").hide();
        $(btn).append(generateButtonCheckin(id));
    }
